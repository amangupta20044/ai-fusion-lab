"use client"
import { Button } from '@/components/ui/button'
import { Mic, Paperclip, Send } from 'lucide-react'
import React, { useContext, useEffect, useState } from 'react'
import AiMultiModels from './AiMultiModels'
import axios from 'axios';
import { AiSelectedModelContext } from '@/context/AiSelectedModelContext';

function ChatInputBox() {
    const [userInput,setUserInput]=useState("");
    const {aiSelectedModels,setAiSelectedModels,messages,setMessages}=useContext(AiSelectedModelContext );

    // making chat handle function

const handleSend = async () => {
    if (!userInput.trim()) return;

    // 1️⃣ Add user message to all enabled models
    setMessages((prev) => {
        const updated = { ...prev };
        Object.keys(aiSelectedModels ?? {}).forEach((modelKey) => {
        if (aiSelectedModels[modelKey].enable) {
            updated[modelKey] = [
                ...(updated[modelKey] ?? []),
                { role: "user", content: userInput },
            ];
        }
    });
    return updated;
    });

    const currentInput = userInput; // capture before reset
    setUserInput("");

    // 2️⃣ Fetch response from each enabled model
    Object.entries(aiSelectedModels ?? {}).forEach(async ([parentModel, modelInfo]) => {
        if (!modelInfo.modelId || aiSelectedModels[parentModel]?.enable == false) return;

        console.debug("Sending request for model:", { parentModel, modelId: modelInfo.modelId });

        // Add loading placeholder before API call
        setMessages((prev) => ({
            ...prev,
            [parentModel]: [
                ...(prev[parentModel] ?? []),
                { role: "assistant", content: "Loading...", model: parentModel, loading: true },
            ],
        }));


        try {
            const result = await axios.post("/api/ai-multi-model", {
                model: modelInfo.modelId,
                msg: [{ role: "user", content: currentInput }],
                parentModel,
            });

            console.debug("/api/ai-multi-model result:", result.data);

            const { aiResponse, model } = result.data;

            // 3️⃣ Add AI response to that model’s messages
            setMessages((prev) => {
                const updated = [...(prev[parentModel] ?? [])];
                const loadingIndex = updated.findIndex((m) => m.loading);

                if (loadingIndex !== -1) {
                    updated[loadingIndex] = {
                        role: "assistant",
                        content: aiResponse,
                        model,
                        loading: false,
                    };
                } else {
                    // fallback if no loading msg found
                    updated.push({
                        role: "assistant",
                        content: aiResponse,
                        model,
                        loading: false,
                    });
                }

                return { ...prev, [parentModel]: updated };
            });
        } catch (err) {
            console.error(err);
            setMessages((prev) => ({
                ...prev,
                [parentModel]: [
                    ...(prev[parentModel] ?? []),
                    { role: "assistant", content: "⚠️ Error fetching response." },
                ],
            }));
        }
    });
};

  useEffect(() => {
    console.log(messages);
  }, [messages]);

  return (
    <div className='relative min-h-screen'>
        {/* Page Content */}
        <div>
            <AiMultiModels/>
        </div>
        {/* fixed chat input */}
        <div className='fixed bottom-0 left-0 flex w-full justify-center px-4 pb-4'>
            <div className='w-full border rounded-xl shadow-md max-w-2xl p-4'>
                <input type= 'text' placeholder='Ask me anything...' 
                className='border-0 outline-none w-full'
                value={userInput}
                onChange={(event)=>setUserInput(event.target.value)}
                />
                <div className='m-3 flex justify-between items-center'>
                    <Button className={''} variant={'ghost'} size={'icon'}>
                        <Paperclip className='h-5 w-5'/>
                    </Button>
                    <div>
                        <Button variant={'ghost'} size={'icon'}><Mic/></Button>
                        <Button size={'icon'} className={'bg-[#9f6aeb]'} onClick={handleSend}><Send/></Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default ChatInputBox