import { apiClient } from './client'

export interface PetInfo {
  name: string
  species: string
  breed: string
  age: string
  weight: string
}

export interface Consultation {
  id: string
  user_id: string
  pet_id: string | null
  title: string
  status: 'active' | 'closed'
  urgency_level: 'none' | 'low' | 'medium' | 'high' | 'critical'
  pet_info: PetInfo | null
  created_at: string
  updated_at: string
  message_count?: number
  last_message_preview?: string
}

export interface Message {
  id: string
  consultation_id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  created_at: string
}

export interface ConsultationReport {
  report_content: string
  urgency_level: string
  recommendations: string[]
}

export const consultationApi = {
  create: (data: { pet_id?: string; title?: string; pet_info?: PetInfo }) =>
    apiClient.post<Consultation>('/api/consultations', data),

  list: (skip = 0, limit = 20) =>
    apiClient.get<{ items: Consultation[]; total: number }>('/api/consultations', {
      params: { skip, limit },
    }),

  get: (id: string) =>
    apiClient.get<Consultation & { messages: Message[] }>(`/api/consultations/${id}`),

  update: (id: string, data: { title?: string; status?: string }) =>
    apiClient.patch<Consultation>(`/api/consultations/${id}`, data),

  delete: (id: string) => apiClient.delete(`/api/consultations/${id}`),

  getMessages: (id: string) =>
    apiClient.get<{ items: Message[] }>(`/api/consultations/${id}/messages`),

  generateReport: (id: string) =>
    apiClient.post<ConsultationReport>(`/api/consultations/${id}/report`),

  sendMessage: (
    consultationId: string,
    content: string,
    onToken: (token: string) => void,
    onDone: (urgencyLevel: string) => void,
    onError: (error: string) => void,
  ) => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || ''
    const controller = new AbortController()

    fetch(`${baseUrl}/api/consultations/${consultationId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(localStorage.getItem('token')
          ? { Authorization: `Bearer ${localStorage.getItem('token')}` }
          : {}),
      },
      body: JSON.stringify({ content }),
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        const reader = response.body?.getReader()
        if (!reader) throw new Error('No response body')

        const decoder = new TextDecoder()
        let buffer = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() || ''

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6)) as {
                  content?: string
                  done?: boolean
                  urgency_level?: string
                }
                if (data.done) {
                  onDone(data.urgency_level || 'none')
                } else if (data.content) {
                  onToken(data.content)
                }
              } catch {
                // skip malformed chunk
              }
            }
          }
        }
      })
      .catch((error: unknown) => {
        if (error instanceof Error && error.name !== 'AbortError') {
          onError(error.message)
        }
      })

    return controller
  },
}
