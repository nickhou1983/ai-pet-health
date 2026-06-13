import { create } from 'zustand'
import {
  consultationApi,
  type Consultation,
  type ConsultationReport,
  type Message,
  type PetInfo,
} from '../api/consultation'

interface CreateConsultationInput {
  pet_id?: string
  title?: string
  pet_info?: PetInfo
}

interface ConsultationState {
  consultations: Consultation[]
  currentConsultation: Consultation | null
  messages: Message[]
  isStreaming: boolean
  streamingContent: string
  loading: boolean
  error: string | null
  report: ConsultationReport | null
  fetchConsultations: () => Promise<void>
  createConsultation: (data: CreateConsultationInput) => Promise<Consultation>
  selectConsultation: (id: string) => Promise<void>
  sendMessage: (content: string) => Promise<void>
  generateReport: () => Promise<ConsultationReport | null>
  closeConsultation: () => Promise<void>
  clearReport: () => void
}

const sortByUpdatedAt = (consultations: Consultation[]) =>
  [...consultations].sort(
    (left, right) =>
      new Date(right.updated_at).getTime() - new Date(left.updated_at).getTime(),
  )

const upsertConsultation = (
  consultations: Consultation[],
  consultation: Consultation,
): Consultation[] => {
  const nextItems = consultations.filter((item) => item.id !== consultation.id)
  nextItems.unshift(consultation)
  return sortByUpdatedAt(nextItems)
}

const createLocalMessage = (
  consultationId: string,
  role: Message['role'],
  content: string,
): Message => ({
  id: `local-${role}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  consultation_id: consultationId,
  role,
  content,
  created_at: new Date().toISOString(),
})

export const useConsultationStore = create<ConsultationState>((set, get) => ({
  consultations: [],
  currentConsultation: null,
  messages: [],
  isStreaming: false,
  streamingContent: '',
  loading: false,
  error: null,
  report: null,

  fetchConsultations: async () => {
    set({ loading: true, error: null })
    try {
      const response = await consultationApi.list()
      set({ consultations: sortByUpdatedAt(response.data.items), loading: false })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : '加载问诊记录失败',
        loading: false,
      })
    }
  },

  createConsultation: async (data) => {
    set({ loading: true, error: null, report: null })
    try {
      const response = await consultationApi.create(data)
      const consultation = response.data
      set((state) => ({
        consultations: upsertConsultation(state.consultations, consultation),
        currentConsultation: consultation,
        messages: [],
        loading: false,
      }))
      return consultation
    } catch (error) {
      const message = error instanceof Error ? error.message : '创建问诊失败'
      set({ error: message, loading: false })
      throw new Error(message)
    }
  },

  selectConsultation: async (id) => {
    set({ loading: true, error: null, report: null })
    try {
      const response = await consultationApi.get(id)
      const { messages, ...consultation } = response.data
      set((state) => ({
        currentConsultation: consultation,
        messages,
        consultations: upsertConsultation(state.consultations, {
          ...consultation,
          message_count: consultation.message_count ?? messages.length,
        }),
        loading: false,
      }))
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : '加载问诊详情失败',
        loading: false,
        currentConsultation: null,
        messages: [],
      })
    }
  },

  sendMessage: async (content) => {
    const trimmedContent = content.trim()
    const consultation = get().currentConsultation

    if (!consultation || !trimmedContent) return

    const now = new Date().toISOString()
    const userMessage = createLocalMessage(consultation.id, 'user', trimmedContent)

    set((state) => ({
      messages: [...state.messages, userMessage],
      isStreaming: true,
      streamingContent: '',
      error: null,
      consultations: upsertConsultation(state.consultations, {
        ...consultation,
        updated_at: now,
        last_message_preview: trimmedContent,
        message_count: state.messages.length + 1,
      }),
      currentConsultation: {
        ...consultation,
        updated_at: now,
      },
    }))

    await new Promise<void>((resolve, reject) => {
      let streamedContent = ''

      consultationApi.sendMessage(
        consultation.id,
        trimmedContent,
        (token) => {
          streamedContent += token
          set((state) => ({
            streamingContent: state.streamingContent + token,
          }))
        },
        (urgencyLevel) => {
          void (async () => {
            try {
              const response = await consultationApi.get(consultation.id)
              const { messages, ...freshConsultation } = response.data
              set((state) => ({
                currentConsultation: freshConsultation,
                messages,
                isStreaming: false,
                streamingContent: '',
                consultations: upsertConsultation(state.consultations, {
                  ...freshConsultation,
                  urgency_level: (freshConsultation.urgency_level ||
                    urgencyLevel) as Consultation['urgency_level'],
                  message_count:
                    freshConsultation.message_count ?? messages.length,
                  last_message_preview:
                    messages[messages.length - 1]?.content.slice(0, 120) ||
                    streamedContent,
                }),
              }))
            } catch {
              const assistantMessage = createLocalMessage(
                consultation.id,
                'assistant',
                streamedContent || 'AI 已完成回复。',
              )
              set((state) => {
                const urgency = [
                  'none',
                  'low',
                  'medium',
                  'high',
                  'critical',
                ].includes(urgencyLevel)
                  ? (urgencyLevel as Consultation['urgency_level'])
                  : consultation.urgency_level

                return {
                  messages: [...state.messages, assistantMessage],
                  isStreaming: false,
                  streamingContent: '',
                  consultations: upsertConsultation(state.consultations, {
                    ...consultation,
                    urgency_level: urgency,
                    updated_at: new Date().toISOString(),
                    message_count: state.messages.length + 1,
                    last_message_preview:
                      assistantMessage.content.slice(0, 120),
                  }),
                  currentConsultation: {
                    ...consultation,
                    urgency_level: urgency,
                    updated_at: new Date().toISOString(),
                  },
                }
              })
            } finally {
              resolve()
            }
          })()
        },
        (message) => {
          set({
            isStreaming: false,
            streamingContent: '',
            error: message,
          })
          reject(new Error(message))
        },
      )
    })
  },

  generateReport: async () => {
    const consultation = get().currentConsultation
    if (!consultation) return null

    set({ loading: true, error: null })
    try {
      const response = await consultationApi.generateReport(consultation.id)
      set({ report: response.data, loading: false })
      return response.data
    } catch (error) {
      const message = error instanceof Error ? error.message : '生成报告失败'
      set({ error: message, loading: false })
      throw new Error(message)
    }
  },

  closeConsultation: async () => {
    const consultation = get().currentConsultation
    if (!consultation) return

    set({ loading: true, error: null })
    try {
      const response = await consultationApi.update(consultation.id, {
        status: 'closed',
      })
      const nextConsultation = response.data
      set((state) => ({
        currentConsultation: nextConsultation,
        consultations: upsertConsultation(state.consultations, nextConsultation),
        loading: false,
      }))
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : '结束问诊失败',
        loading: false,
      })
    }
  },

  clearReport: () => set({ report: null }),
}))
