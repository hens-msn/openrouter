export const HENS_AI_DOCS = `
# 🐔 hensAI Package Documentation

## 1. 📦 Instalasi
\`\`\`bash
bun add hens-ai
atau
npm install hens-ai
atau
yarn add hens-ai
\`\`\`

## 2. ⚙️ Konfigurasi Awal
### Initialization
\`\`\`typescript
import { hensAI } from 'hens-ai'

const ai = new hensAI({
    apiKey: 'sk-or-v1-...',             // 🔑 Wajib
    model: 'deepseek/deepseek-chat',    // 🤖 Opsional
    webSearch: true,                    // 🔍 Opsional
    // Lihat tabel options lengkap di bawah
})
\`\`\`

### 📋 Daftar Konfigurasi
| Prop          | Type    | Default                     | Deskripsi                      |
|---------------|---------|-----------------------------|--------------------------------|
| apiKey        | string  | -                           | 🔑 API key dari OpenRouter     |
| model         | string  | deepseek/deepseek-chat:free | 🤖 Model AI yang digunakan     |
| temperature   | number  | 1                           | 🌡️ 0 (akurat) - 2 (kreatif)    |
| webSearch     | boolean | false                       | 🔍 Aktifkan pencarian web      |
| maxWebResults | number  | 5                           | 🔢 Jumlah maks hasil web       |
| systemMessage | string  | Pesan sistem default        | 📝 Instruksi awal untuk AI     |
| enableHistory | boolean | false                       | 🕰️ Simpan riwayat percakapan   |

## 3. 🚀 Basic Usage
### Chat Sederhana
\`\`\`typescript
const response = await ai.chat("Apa ibu kota Indonesia?")
console.log(response) // "Ibu kota Indonesia adalah Jakarta"
\`\`\`

### Chat dengan Options
\`\`\`typescript
const response = await ai.chat(
    "Berita terbaru tentang teknologi?", 
    {
        webSearch: true,                            // 🔍 Aktifkan web search
        temperature: 0.7,                           // 🌡️ Kurangi kreativitas
        systemMessage: "Jawab dalam bahasa Sunda"   // 📝 Ganti instruksi
    }
)
\`\`\`

## 4. 🖼️ Analisis Gambar
\`\`\`typescript
const analysis = await ai.analyzeImage(
    'https://example.com/gambar.jpg',
    'Apa yang terjadi di gambar ini?'
)
\`\`\`

## 5. ⚡️ Advanced Usage
### Dengan Riwayat Percakapan
\`\`\`typescript
const history = [
    { role: 'user', content: 'Hai!' },
    { role: 'assistant', content: 'Halo! Ada yang bisa dibantu?' }
]

const response = await ai.chat("Apa kabar?", {
    history: history,       // 🕰️ Bawa konteks percakapan
    enableHistory: true     // 💾 Simpan ke history selanjutnya
})
\`\`\`

## 6. 🎮 React Hook Integration
### useAIChat Hook
\`\`\`typescript
import { useAIChat } from 'hens-ai/react'

function ChatComponent() {
    const {
        messages,
        sendMessage,
        isTyping,
        error
    } = useAIChat({
        webSearch: true,
        enableHistory: true
    })

    // Implementasi UI...
}
\`\`\`

## 7. 🚨 Error Handling
\`\`\`typescript
try {
    await ai.chat("...")
} catch (error) {
    if (error instanceof hensAI.AIError) {
        console.error('Error Code:', error.code)
        // Kode error: NETWORK_ERROR, API_ERROR, etc
    }
    console.error(error.message)
}
\`\`\`

## 8. 💡 Contoh Lengkap (React)
\`\`\`typescript
import { useState } from 'react'
import { useAIChat } from 'hens-ai/react'

export default function ChatUI() {
    const [input, setInput] = useState('')
    const { messages, sendMessage, isTyping } = useAIChat()
    
    const handleSend = async () => {
        await sendMessage(input)
        setInput('')
    }

    return (
        <div className="chat-container">
            {/* Implementasi UI chat */}
        </div>
    )
}
\`\`\`

## 9. 📌 Tips & Best Practices
1. Simpan API key di environment variable:
   \`\`\`.env
   NEXT_PUBLIC_AI_KEY=sk-or-v1-...
   \`\`\`
2. Gunakan webSearch untuk pertanyaan faktual terbaru
3. Atur temperature sesuai kebutuhan:
   - 0.2-0.7: Jawaban faktual (rekomendasi untuk chatbot)
   - 0.8-1.2: Percakapan umum
   - 1.3-2.0: Ide kreatif/generatif
4. Untuk analisis gambar, gunakan model Claude 3.5 Sonnet

## 10. 🧠 Daftar Model yang Direkomendasikan
| Model                         | Use Case                   |
|-------------------------------|----------------------------|
| deepseek/deepseek-chat        | 💬 Chat umum               |
| anthropic/claude-3.5-sonnet   | 🖼️ Analisis gambar         |
| google/palm-2                 | 🔢 Pemrosesan teks         |
| deepseek/deepseek-r1          | 🧠 Tugas kompleks          |
`