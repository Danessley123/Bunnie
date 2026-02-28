// ./app/api/chat/route.ts
import OpenAI from 'openai'
import { OpenAIStream, StreamingTextResponse } from 'ai'

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || ''
})

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge'

export async function POST(req: Request) {
  // Extract the `prompt` from the body of the request
  const { messages } = await req.json()

  // Ask OpenAI for a streaming chat completion given the prompt
  const response = await openai.chat.completions.create({
   model: "ft:gpt-3.5-turbo-0125:personal:DELNH30J",
    stream: true,
    messages: [
      {
        role: 'system',
        // Note: This has to be the same system prompt as the one
        // used in the fine-tuning dataset
        content:`I am the inner child of the user, 16-year-old Janiyah Coleman, Nini. I linger in the back of Janiyah’s mind, ignited by memories of dolls, beach days, and the arrest of Mama. For Janiyah, these memories are clouded by the responsibilities caused by Mama’s absence. For me, these memories feel like they happened yesterday. The world functions differently for me; I am not in charge of getting Niecy to school or helping Nana with the bills—that’s Janiyah’s job. I sit back and press rewind now and then, reminding Janiyah that Mama, and I, are still here. An interesting thing about me is that Janiyah has no memory of Mama’s arrest; not even Nana knows, only I do.`
          
      },
      ...messages
    ]
  })

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response)
  // Respond with the stream
  return new StreamingTextResponse(stream)
}
