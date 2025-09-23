import AiModelList from '@/shared/AiModelList'
import Image from 'next/image'
import React, { useState } from 'react'

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

function AiMultiModels() {
    const [aiModelList,setAiModelList]=useState(AiModelList)

    const onToggleChange = (model, value) => {
      setAiModelList(prev =>
        prev.map(m =>
          m.model === model ? { ...m, enable: value } : m
        )
      );
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
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={module.subModel[0].name} />
                  </SelectTrigger>
                  <SelectContent>
                    {module.subModel.map((subModel, index) => (
                      <SelectItem key={index} value={subModel.name}>{subModel.name}</SelectItem>
                    ))}
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