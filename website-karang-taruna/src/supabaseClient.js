import { createClient } from '@supabase/supabase-js'

// Hapus '/rest/v1' dari ujung URL:
const supabaseUrl = 'https://luzcoezufthxumngzktu.supabase.co' 

const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1emNvZXp1ZnRoeHVtbmd6a3R1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgyNDQ4NzMsImV4cCI6MjEwMzgyMDg3M30.PI0jI72IlHNteTVrgqqfjLfqTOqbyijWy0ZVodrF8zA'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)