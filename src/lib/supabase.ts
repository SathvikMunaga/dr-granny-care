import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://denixywtzwkwndqeoeeg.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlbml4eXd0endrd25kcWVvZWVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwNzcwOTIsImV4cCI6MjA3MjY1MzA5Mn0.gNSWMSetDGOLK0o_W-Inx6-wnqqk7AEhdUfHx1ebE8Y'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Profile = {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  created_at: string
}

export type Chat = {
  id: string
  user_id: string
  title: string
  created_at: string
  updated_at: string
}

export type Message = {
  id: string
  chat_id: string
  content: string
  is_user: boolean
  created_at: string
  attachment_url?: string | null
}

export type Attachment = {
  id: string
  message_id: string
  file_name: string
  file_type: string
  file_url: string
  created_at: string
}