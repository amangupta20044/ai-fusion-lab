import { Button } from '@/components/ui/button'
import { Mic, Paperclip, Send } from 'lucide-react'
import React from 'react'
import AiMultiModels from './AiMultiModels'

function ChatInputBox() {
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
                className='border-0 outline-none'/>
                <div className='m-3 flex justify-between items-center'>
                    <Button className={''} variant={'ghost'} size={'icon'}>
                        <Paperclip className='h-5 w-5'/>
                    </Button>
                    <div>
                        <Button variant={'ghost'} size={'icon'}><Mic/></Button>
                        <Button size={'icon'} className={'bg-[#9f6aeb]'}><Send/></Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default ChatInputBox