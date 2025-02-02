import { useState } from "react";
import { FactorChatMessage, FactorChatResponse } from "./types";
import { exampleResponse } from "./exampleResponse";

export function useFactorChat() {
  const [messages, setMessages] = useState<FactorChatMessage[]>([])
  const [input, setInput] = useState<string>('')
  const [loading, setLoading] = useState(false)

  // handles text box state
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
  }


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement> | React.KeyboardEvent<HTMLDivElement>) => {
    event.preventDefault()

    // append user message to end of array
    const newMessages: FactorChatMessage[] = [...messages, { origin: 'user', contents: input }]
    setMessages(newMessages)

    // clear text box
    setInput('')

    //try getting response. If successful push new message, if not display error
    try {
      setLoading(true)

      const res = await fetch('http://localhost:5000/api/chat', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMessages)
      })

      const backendMessage: FactorChatResponse = await res.json()

      setMessages([...newMessages, {origin: "backend", contents: backendMessage}])
      // setMessages([...newMessages, {origin: "backend", contents: exampleResponse}])
      
    } catch (error) {
      console.error('Error:\n', error)
      const errorMsg: FactorChatResponse = {
        text: "Something went wrong", //probably should handle displaying actual error,
        figures: [],
        files: []
      }
      setMessages([...newMessages, {origin: "backend", contents: errorMsg}])
    }
    
    setLoading(false)
  }

  return {input, handleInputChange, handleSubmit, messages, setMessages, loading}
}
