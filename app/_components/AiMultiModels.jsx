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

function AiMultiModels() {
  const { user } = useUser();
  const [aiModelList, setAiModelList] = useState(AiModelList);
  const { aiSelecteModels, setAiSelectedModels } = useContext(AiSelectedModelContext);

  const onToggleChange = (model, value) => {
    setAiModelList(prev =>
      prev.map(m =>
        m.model === model ? { ...m, enable: value } : m
      )
    );
  };

  const onSelectValue = async (parentModel, value) => {
    setAiSelectedModels(prev => ({
      ...prev,
      [parentModel]: {
        modelId: value,
      },
    }));

    if (user?.primaryEmailAddress?.emailAddress) {
      const docRef = doc(db, "users", user.primaryEmailAddress.emailAddress);
      await updateDoc(docRef, {
        aiSelectedModelPref: {
          ...aiSelecteModels,
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
                  defaultValue={aiSelecteModels?.[module.model]?.modelId ?? ""}
                  onValueChange={value => onSelectValue(module.model, value)}
                  disabled={module.premium}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue
                      placeholder={
                        aiSelecteModels?.[module.model]?.modelId ??
                        "Select model"
                      }
                    />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectGroup className="px-3">
                      <SelectLabel className="text-sm text-gray-400">
                        Free
                      </SelectLabel>
                      {module.subModel.map(
                        (subModel, idx) =>
                          !subModel.premium && (
                            <SelectItem key={idx} value={subModel.name}>
                              {subModel.name}
                            </SelectItem>
                          )
                      )}
                    </SelectGroup>

                    <SelectGroup className="px-3">
                      <SelectLabel className="text-sm text-gray-400">
                        Premium
                      </SelectLabel>
                      {module.subModel.map(
                        (subModel, idx) =>
                          subModel.premium && (
                            <SelectItem
                              key={idx}
                              value={subModel.name}
                              disabled
                            >
                              {subModel.name}
                              <Lock className="h-4 w-4 ml-1" />
                            </SelectItem>
                          )
                      )}
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
        </div>
      ))}
    </div>
  );
}

export default AiMultiModels;
