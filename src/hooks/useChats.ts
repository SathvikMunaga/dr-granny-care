import { useState, useEffect } from 'react'
import { supabase, Chat, Message } from '@/lib/supabase'
import { useAuth } from './useAuth'
import { useToast } from './use-toast'

export function useChats() {
  const [chats, setChats] = useState<Chat[]>([])
  const [currentChat, setCurrentChat] = useState<Chat | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    if (user) {
      loadChats()
    } else {
      setChats([])
      setCurrentChat(null)
      setMessages([])
    }
  }, [user])

  const loadChats = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('chats')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })

      if (error) throw error
      setChats(data || [])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load chats",
        variant: "destructive"
      })
    }
  }

  const createNewChat = async () => {
    if (!user) return null

    try {
      const { data, error } = await supabase
        .from('chats')
        .insert({
          user_id: user.id,
          title: 'New Chat',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error
      
      const newChat = data as Chat
      setChats(prev => [newChat, ...prev])
      setCurrentChat(newChat)
      setMessages([])
      
      return newChat
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create new chat",
        variant: "destructive"
      })
      return null
    }
  }

  const loadMessages = async (chatId: string) => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true })

      if (error) throw error
      setMessages(data || [])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const sendMessage = async (content: string, attachmentUrl?: string) => {
    if (!user || !currentChat) return

    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          chat_id: currentChat.id,
          content,
          is_user: true,
          attachment_url: attachmentUrl,
          created_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error

      const newMessage = data as Message
      setMessages(prev => [...prev, newMessage])

      // Update chat's updated_at timestamp
      await supabase
        .from('chats')
        .update({ 
          updated_at: new Date().toISOString(),
          title: content.slice(0, 50) // Update title with first message
        })
        .eq('id', currentChat.id)

      // Simulate AI response
      setTimeout(async () => {
        const aiResponse = generateAIResponse(content)
        
        const { data: aiMessage, error: aiError } = await supabase
          .from('messages')
          .insert({
            chat_id: currentChat.id,
            content: aiResponse,
            is_user: false,
            created_at: new Date().toISOString()
          })
          .select()
          .single()

        if (!aiError) {
          setMessages(prev => [...prev, aiMessage as Message])
        }
      }, 1000)

      return newMessage
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      })
    }
  }

  const selectChat = (chat: Chat) => {
    setCurrentChat(chat)
    loadMessages(chat.id)
  }

  return {
    chats,
    currentChat,
    messages,
    loading,
    createNewChat,
    sendMessage,
    selectChat,
    loadChats
  }
}

const generateAIResponse = (userMessage: string): string => {
  const responses = [
    "I understand your concern. Based on my medical knowledge, I'd recommend consulting with your healthcare provider for a proper evaluation.",
    "That's a great question! Health and wellness are very important. Let me share some general guidance that might help.",
    "From a medical perspective, there are several factors to consider. It's always best to get personalized advice from a qualified healthcare professional.",
    "Thank you for sharing that with me. Your health is important, and I want to make sure you get the best care possible.",
    "I appreciate you bringing this to my attention. Let me provide some general health information that might be helpful."
  ]
  
  return responses[Math.floor(Math.random() * responses.length)]
}