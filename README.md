# 📚 @henotic/openrouter - Dokumentasi Lengkap

## 1. 📦 Instalasi & Setup
### Instalasi Package
```bash
bun add @henotic/openrouter
atau
npm install @henotic/openrouter
atau
yarn add @henotic/openrouter
```

### Setup Environment Variable
Buat file `.env` di root project:
```env
OPENROUTER_API_KEY=sk-or-v1-...
```

### Inisialisasi Dasar
```typescript
import { OpenRouter } from '@henotic/openrouter'

const ai = new OpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY!,
    model: 'deepseek/deepseek-chat',
    webSearch: true,
    enableHistory: true
})
```

## 2. ⚙️ Konfigurasi Lengkap
### Interface Konfigurasi
```typescript
interface OpenRouterConfig {
    apiKey: string
    model?: string
    temperature?: number
    webSearch?: boolean
    maxWebResults?: number
    systemMessage?: string
    enableHistory?: boolean
}
```

### Default Values
| Property       | Default Value                              |
|----------------|-------------------------------------------|
| model          | 'deepseek/deepseek-chat:free'             |
| temperature    | 1                                         |
| webSearch      | false                                     |
| maxWebResults  | 5                                         |
| systemMessage  | 'Kamu adalah asisten AI yang membantu...' |
| enableHistory  | false                                     |

## 3. 🚀 Core Features
### 3.1 Text Response
```typescript
async textResponse(
    prompt: string,
    options?: {
        systemMessage?: string
        chatHistory?: Array<{ isBot: boolean; text: string }>
        webSearch?: boolean
        enableHistory?: boolean
    }
): Promise<string>
```

#### Contoh Penggunaan
```typescript
// Basic Chat
const response1 = await ai.textResponse("Apa itu React?")

// Dengan Web Search
const response2 = await ai.textResponse("Berita terbaru teknologi", {
    webSearch: true
})

// Dengan Chat History
const history = [
    { isBot: false, text: 'Hai!' },
    { isBot: true, text: 'Halo! Ada yang bisa dibantu?' }
]
const response3 = await ai.textResponse("Apa kabar?", {
    chatHistory: history,
    enableHistory: true
})
```

### 3.2 Image Analysis (Fleksibel)
```typescript
async imageAnalysis(
    imageUrl: string,
    options?: string | {
        model?: string
        prompt?: string
        temperature?: number
    }
): Promise<string>
```

### Contoh Penggunaan
```typescript
// Cara sederhana
const analysis1 = await ai.imageAnalysis('https://example.com/gambar.jpg')

// Dengan prompt custom
const analysis2 = await ai.imageAnalysis(
    'https://example.com/gambar2.jpg',
    'Apa yang terjadi di gambar ini?'
)

// Dengan opsi lengkap
const analysis3 = await ai.imageAnalysis(
    'https://example.com/gambar3.jpg',
    {
        model: 'google/palm-2',
        prompt: 'Analisis detail gambar ini',
        temperature: 0.7
    }
)
```

## 4. 🛠️ Advanced Usage
### 4.1 Custom Model Selection
```typescript
const customAI = new OpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY!,
    model: 'anthropic/claude-3.5-sonnet',
    temperature: 0.7
})
```

### 4.2 Error Handling
```typescript
try {
    const response = await ai.textResponse("...")
} catch (error) {
    if (error instanceof Error) {
        console.error('Error:', error.message)
        // Handle specific error cases
    }
}
```

### 4.3 Multi-Modal Support
```typescript
const multiModalResponse = await ai.textResponse(
    "Deskripsikan gambar ini dan berikan analisis",
    {
        chatHistory: [
            {
                isBot: false,
                text: [
                    { type: 'text', text: 'Ini gambar apa?' },
                    { 
                        type: 'image_url', 
                        image_url: { url: 'https://example.com/gambar.jpg' }
                    }
                ]
            }
        ]
    }
)
```

## 5. 🧠 Model Recommendations
| Model                         | Use Case                   | Temperature Range |
|-------------------------------|----------------------------|-------------------|
| deepseek/deepseek-chat        | 💬 Chat umum               | 0.7 - 1.2         |
| anthropic/claude-3.5-sonnet   | 🖼️ Analisis gambar         | 0.5 - 0.9         |
| google/palm-2                 | 🔢 Pemrosesan teks         | 0.3 - 0.8         |
| deepseek/deepseek-r1          | 🧠 Tugas kompleks          | 0.4 - 1.0         |

## 6. 🚨 Error Codes & Troubleshooting
| Error Type          | Penyebab                  | Solusi                     |
|---------------------|--------------------------|----------------------------|
| Network Error       | Koneksi internet bermasalah | Cek koneksi internet      |
| API Key Invalid     | API key tidak valid       | Periksa API key           |
| Model Not Found     | Model tidak tersedia      | Cek daftar model          |
| Rate Limit Exceeded | Melebihi batas request    | Tunggu beberapa saat      |

## 7. 📌 Best Practices
1. **Environment Variables**: Selalu simpan API key di environment variable
2. **Error Handling**: Implementasikan error handling yang baik
3. **Temperature**: Sesuaikan temperature dengan use case
4. **Web Search**: Gunakan web search untuk informasi terkini
5. **History Management**: Manfaatkan chat history untuk percakapan kontekstual

## 8. 🚀 Performance Optimization
- Gunakan `enableHistory: false` untuk percakapan satu kali
- Atur `maxWebResults` sesuai kebutuhan (3-5 optimal)
- Gunakan model yang spesifik untuk tugas tertentu
- Implementasikan caching untuk response yang sering digunakan

## 9. 🔧 Development Setup
### Install Dependencies
```bash
bun install
```

### Run Development Server
```bash
bun run dev
```

### Build Project
```bash
bun run build
```

### Run Tests
```bash
bun run test
```

## 10. 📚 Additional Resources
- [OpenRouter API Documentation](https://openrouter.ai/docs)
- [DeepSeek Model Documentation](https://deepseek.com/docs)
- [Claude 3.5 Sonnet Guide](https://docs.anthropic.com)
- [Google PaLM 2 Overview](https://ai.google/discover/palm2)