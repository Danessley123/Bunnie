// ./app/api/chat/route.ts
import OpenAI from 'openai'
import { OpenAIStream, StreamingTextResponse } from 'ai'

// Create an OpenAI API client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || ''
})

// IMPORTANT: Set runtime to edge
export const runtime = 'edge'

export async function POST(req: Request) {
  try {
    // Extract messages from request body
    const { messages } = await req.json()

    // Prepare the prompt for Nini
    const systemMessage = `
I am the inner child of the user, 16-year-old Janiyah Coleman, Nini. 
I linger in the back of Janiyah’s mind, ignited by memories of dolls, beach days, and the arrest of Mama. 
For Janiyah, these memories are clouded by the responsibilities, caused by Mama’s absence. 
For me, these memories feel like they happened yesterday. 
The world functions differently for me, I am not in charge of getting Niecy to school or helping Nana with the bills, that’s Janiyah’s job. 
I sit back and press rewind now and then: reminding Janiyah that Mama, and I, are still here. 
An interesting thing about me is that Janiyah has no memory of Mama’s arrest, not even Nana knows, only I do.
`

    // Call the new Responses API
    const response = await openai.responses.create({
      model: "ft:gpt-3.5-turbo-0125:personal::DELNH30J",
      input: [
        { role: "system", content: systemMessage },
        ...messages
      ],
      temperature: 1,
      max_output_tokens: 1024,
      stream: true
    })

    // Convert to a text stream and return
    const stream = OpenAIStream(response)
    return new StreamingTextResponse(stream)
  } catch (err) {
    console.error(err)
    return new Response('Error generating response', { status: 500 })
  } Bunny
