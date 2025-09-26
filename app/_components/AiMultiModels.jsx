import AiModelList from '@/shared/AiModelList'
import Image from 'next/image'
import React, { useContext, useState } from 'react'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from '@/components/ui/switch'
import { MessageSquare, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SelectGroup, SelectLabel } from '@radix-ui/react-select'
import { AiSelectedModelContext } from '@/context/AiSelectedModelContext'
import { useUser } from '@clerk/nextjs'

function AiMultiModels() {
    const {user}=useUser();

    const [aiModelList,setAiModelList]=useState(AiModelList)

    const {aiSelecteModels,setAiSelectedModels}=useContext(AiSelectedModelContext);

    const onToggleChange = (model, value) => {
      setAiModelList(prev =>
        prev.map(m =>
          m.model === model ? { ...m, enable: value } : m))
        
    };

    const onSelectValue=async(parentModel,value)=>{
      setAiSelectedModels(prev=>({
        ...prev,
        [parentModel]:{
         modelId:value
      }
      }))
      // Update to firebase database
      const docRef=doc(db,"users", user?.primaryEmailAddress?.emailAddress);
      await updateDoc(docRef,{
        aiSelectedModelPref: aiSelecteModels
      })
    };

  return (
    <div className='flex flex-1 h-[65vh] border-b'>
        {aiModelList.map((module, index) => (
          <div
            key={module.model || index}
            className={`flex flex-col border-r h-full overflow-auto  ${module.enable ? 'flex-1 min-w-[400px]' : 'w-[100px] flex-none'}`}
          >
            <div className='flex w-full h-[70px] items-center justify-between border-b p-4'>
              <div className='flex items-center gap-4'>
                <Image src={module.icon} alt={module.model}
                  width={24} height={24}
                />
                {module.enable && <Select>
                  <Select defaultValue={aiSelecteModels?.[module.model]?.modelId} 
                  onValueChange={(value)=>onSelectValue(module.model,value)}
                  disabled={module.premium}></Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={aiSelecteModels[module.model].modelId} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup className='px-3'>
                      <SelectLabel className='text-sm text-gray-400'>Free</SelectLabel>
                      {module.subModel.map((subModel, index) => subModel.premium == false && (
                        <SelectItem key={index} value={subModel.name}>{subModel.id}</SelectItem>
                      ))}
                    </SelectGroup>
                     <SelectGroup className='px-3'>
                      <SelectLabel className='text-sm text-gray-400'>Premium</SelectLabel>
                      {module.subModel.map((subModel, index) => subModel.premium == true && (
                        <SelectItem key={index} value={subModel.name} disabled={subModel.premium}>
                          {subModel.name} {subModel.premium && <Lock className='h-4 w-4' />}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>}
              </div>
              <div>
                {module.enable ? <Switch checked={module.enable}
                  onCheckedChange={(v) => onToggleChange(module.model, v)}
                />
                  : <MessageSquare onClick={() => onToggleChange(module.model, true)} />}
              </div>
            </div>
            {module.premium && module.enable && (
              <div className='flex items-center justify-center h-full'>
                <Button><Lock />Upgrade to Unlock</Button>
              </div>
            )}
          </div>
        ))}
        
    </div>
  )
}

export default AiMultiModels