import AiModelList from '@/shared/AiModelList'
import Image from 'next/image'
import React, { useContext, useState } from 'react'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select"
import { Switch } from '@/components/ui/switch'
import { MessageSquare, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AiSelectedModelContext } from '@/context/AiSelectedModelContext'
import { useUser } from '@clerk/nextjs'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '@/config/FirebaseConfig'

import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

function AiMultiModels() {
  const { user } = useUser();
  const [aiModelList, setAiModelList] = useState(AiModelList);
  const { aiSelectedModels, setAiSelectedModels, messages, setMessages } = useContext(AiSelectedModelContext);

  const onToggleChange = (model, value) => {
    // Update local list state
    setAiModelList(prev => prev.map(m => (m.model === model ? { ...m, enable: value } : m)));

    // Update selected models in context (ensure object shape)
    setAiSelectedModels(prev => ({
      ...(prev ?? {}),
      [model]: {
        ...(prev?.[model] ?? {}),
        enable: value,
      },
    }));
  };

  const onSelectValue = async (parentModel, value) => {
    setAiSelectedModels(prev => ({
      ...(prev ?? {}),
      [parentModel]: {
        ...(prev?.[parentModel] ?? {}),
        modelId: value,
      },
    }));

    if (user?.primaryEmailAddress?.emailAddress) {
      const docRef = doc(db, "users", user.primaryEmailAddress.emailAddress);
      await updateDoc(docRef, {
        aiSelectedModelPref: {
          ...(aiSelectedModels ?? {}),
          [parentModel]: { modelId: value },
        },
      });
    }
  };

  return (
    <div className="flex flex-1 h-[65vh] border-b">
      {aiModelList.map((module, index) => (
        <div
          key={module.model || index}
          className={`flex flex-col border-r h-full overflow-auto ${
            module.enable ? "flex-1 min-w-[400px]" : "w-[100px] flex-none"
          }`}
        >
          <div className="flex w-full h-[70px] items-center justify-between border-b p-4">
            <div className="flex items-center gap-4">
              <Image
                src={module.icon}
                alt={module.model}
                width={24}
                height={24}
              />

              {module.enable && (
                <Select
                  defaultValue={aiSelectedModels?.[module.model]?.modelId ?? ""}
                  onValueChange={value => onSelectValue(module.model, value)}
                  disabled={module.premium}
                >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue
                        placeholder={
                          aiSelectedModels?.[module.model]?.modelId ??
                          "Select model"
                        }
                      />
                    </SelectTrigger>

                  <SelectContent>
                    <SelectGroup className="px-3">
                      <SelectLabel className="text-sm text-gray-400">
                        Free
                      </SelectLabel>
                      {module.subModel
                        .filter(subModel => !subModel.premium)
                        .map((subModel) => (
                          <SelectItem key={subModel.id ?? subModel.name} value={subModel.name}>
                            {subModel.name}
                          </SelectItem>
                        ))}
                    </SelectGroup>

                    <SelectGroup className="px-3">
                      <SelectLabel className="text-sm text-gray-400">
                        Premium
                      </SelectLabel>
                      {module.subModel
                        .filter(subModel => subModel.premium)
                        .map((subModel) => (
                          <SelectItem key={subModel.id ?? subModel.name} value={subModel.name} disabled>
                            {subModel.name}
                            <Lock className="h-4 w-4 ml-1" />
                          </SelectItem>
                        ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            </div>

            <div>
              {module.enable ? (
                <Switch
                  checked={module.enable}
                  onCheckedChange={v => onToggleChange(module.model, v)}
                />
              ) : (
                <MessageSquare
                  onClick={() => onToggleChange(module.model, true)}
                />
              )}
            </div>
          </div>

          {module.premium && module.enable && (
            <div className="flex items-center justify-center h-full">
              <Button>
                <Lock /> Upgrade to Unlock
              </Button>
            </div>
          )}

            {module.enable && (
              <div className='flex-1 p-4'>
                <div className='flex-1 p-4 space-y-2'>
                  {messages?.[module.model]?.map((m, i) => (
                    <div
                      key={i}
                      className={`p-2 rounded-md ${m.role == 'user' ?
                        "bg-blue-100 text-blue-900"
                        : "bg-gray-100 text-gray-900"}`}>
                      {m.role == 'assistant' && (
                        <span className='text-sm text-gray-400'>{m.model ?? module.model}</span>
                      )}
                      <div className='flex gap-3 items-center'>
                        {m.content && <span className='text-sm text-gray-500 animate-pulse'>thinking...</span>}
                      </div>
                      {!m.content && 
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {m.content}
                      </ReactMarkdown>
                        }
                      
                    </div>
                  ))}
                </div>
              </div>
            )}
        </div>
      ))}
    </div>
  );
}

export default AiMultiModels;
