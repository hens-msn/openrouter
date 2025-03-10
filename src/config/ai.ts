import { OpenRouter } from './openrouter'

// Konfigurasi global
export const ai = new OpenRouter({
    apiKey: process.env.NEXT_PUBLIC_OPENROUTER_KEY!,
    model: 'deepseek/deepseek-chat',
    webSearch: false,
    enableHistory: false,
    systemMessage: 'Bahasakan jawaban dalam bahasa Indonesia yang santai dan kekinian'
})
