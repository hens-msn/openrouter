/**
 * 🚀 Interface konfigurasi untuk OpenRouter AI
 * Semua properti wajib ada di constructor kecuali apiKey
 */
interface OpenRouterConfig {
    /** 🔑 API key wajib diisi (bisa dapat dari env variable) */
    apiKey: string
    /** 🤖 Model default: deepseek/deepseek-chat:free (bisa ganti ke model lain) */
    model?: string
    /** 🌡️ Level kreativitas AI (0 = rigid, 1 = normal, 2 = sangat kreatif; default 1) */
    temperature?: number
    /** 🌐 Aktifkan fitur pencarian web real-time */
    webSearch?: boolean
    /** 🔢 Maksimal hasil web yang akan diproses (5 = optimal) */
    maxWebResults?: number
    /** 📝 Instruksi sistem default untuk AI */
    systemMessage?: string
    /** 🕰️ Aktifkan riwayat percakapan untuk konteks lebih baik */
    enableHistory?: boolean
}

// 🎭 Tipe role untuk message (system/user/assistant)
type MessageRole = 'system' | 'user' | 'assistant'

// 📦 Tipe konten message bisa berupa teks atau multi-modal (text + image)
type MessageContent = string | Array<{
    type: 'text' | 'image_url'
    text?: string
    image_url?: { url: string }
}>

/**
 * 📤 Interface untuk request ke API OpenRouter
 * Structure harus sesuai dengan dokumentasi resmi
 */
interface OpenRouterRequest {
    model: string
    messages: Array<{
        role: MessageRole
        content: MessageContent
    }>
    temperature?: number
    plugins?: Array<{
        id: string
        max_results?: number
        search_prompt?: string
    }>
    webSearch?: boolean
}

export class OpenRouter {
    // ⚙️ Simpan config dengan nilai default yang sudah di-merge
    private readonly config: Required<OpenRouterConfig>
    
    constructor(config: OpenRouterConfig) {
        this.config = {
            model: 'deepseek/deepseek-chat:free',                                       // 🆓 Model gratis default
            temperature: 1,                                                             // 🎛️ Temperatur optimal
            webSearch: false,                                                           // 🔍 Pencarian web default mati
            maxWebResults: 5,                                                           // 🎯 Hasil web optimal
            systemMessage: 'Kamu adalah asisten AI yang membantu menjawab pertanyaan',  // 🤖 Pesan sistem dasar
            enableHistory: false,                                                       // 🧠 Riwayat percakapan default mati
            ...config                                                                   // 🎨 Boleh diisi via constructor
        }
    }

    /**
     * 📡 Method utama untuk mengirim request ke API
     * @private - Hanya dipanggil internal class
     */
    private async _sendRequest(body: OpenRouterRequest): Promise<string> {
        try {
            // 🌐 Kirim request ke endpoint OpenRouter
            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.config.apiKey}`,  // 🔐 API key
                    'HTTP-Referer': 'https://henotic.space',          // 🏠 Referer website
                    'X-Title': 'Henotic Technology',                  // 🏢 Nama aplikasi
                    'Content-Type': 'application/json'                // 📄 Format data
                },
                body: JSON.stringify(body)  // 🚚 Convert object ke JSON
            })

            // ❌ Handle error response dari API
            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error?.message || 'Gagal memproses permintaan')  // 🚨 Error message
            }

            // ✅ Parsing response yang sukses
            const data = await response.json()
            return data.choices[0].message.content  // 🎉 Ambil konten respons pertama
        } catch (error) {
            console.error('[OpenRouter Error]', error)  // 📛 Log error ke console
            throw new Error(
                error instanceof Error 
                    ? error.message  // 🧩 Ambil message dari error object
                    : 'Terjadi kesalahan tidak terduga'  // 🎲 Error generic
            )
        }
    }

    /**
     * 💬 Membuat respons teks dengan konteks percakapan
     * @param prompt - Pertanyaan/input dari user
     * @param options - Opsi tambahan (override config)
     */
    async textResponse(
        prompt: string,
        options?: {
            systemMessage?: string
            chatHistory?: Array<{ isBot: boolean; text: string }>
            webSearch?: boolean
            enableHistory?: boolean
        }
    ): Promise<string> {
        // 🎚️ Tentukan apakah pakai riwayat dari options atau config
        const enableHistory = options?.enableHistory ?? this.config.enableHistory
        
        // 📜 Sistem message: prioritas options > config
        const systemMessage = options?.systemMessage || this.config.systemMessage
        
        // 🕰️ Konversi riwayat chat ke format OpenRouter
        const historyMessages = enableHistory 
            ? options?.chatHistory?.map(m => ({
                role: (m.isBot ? 'assistant' : 'user') as MessageRole,  // 🔄 Konversi boolean ke role
                content: m.text  // 📝 Ambil teks percakapan
            })) || []  // 🧺 Fallback ke array kosong jika undefined
            : []

        // 📦 Susun array messages sesuai format OpenRouter
        const messages = [
            { 
                role: 'system' as MessageRole,  // 🏷️ Type assertion untuk TypeScript
                content: systemMessage 
            },
            ...historyMessages,  // 🧩 Tambahkan riwayat jika enableHistory true
            { 
                role: 'user' as MessageRole, 
                content: prompt  // 💌 Input user terbaru
            }
        ]

        // 🌐 Tambahkan suffix :online jika web search aktif
        const model = `${this.config.model}${options?.webSearch ? ':online' : ''}`

        // 🚀 Kirim request dengan konfigurasi yang sudah disiapkan
        return this._sendRequest({
            model,
            messages,
            temperature: this.config.temperature,  // 🌡️ Gunakan temperatur dari config
            ...(this.config.webSearch && {  // 🔍 Kondisi untuk web search
                plugins: [{
                    id: 'web',
                    max_results: this.config.maxWebResults,  // 🔢 Maksimal hasil
                    search_prompt: `Pencarian web terbaru (${new Date().toLocaleDateString()})...`  // 📅 Tambahkan tanggal
                }]
            })
        })
    }

    /**
     * 🖼️ Analisis gambar dengan opsi fleksibel
     * @param imageUrl - URL gambar yang akan dianalisis
     * @param options - Opsi tambahan (bisa string atau object)
     */
    async imageAnalysis(
        imageUrl: string,
        options: string | {
            model?: string
            prompt?: string
            temperature?: number
        } = {}
    ): Promise<string> {
        // Handle jika options berupa string (backward compatibility)
        const config = typeof options === 'string' 
            ? { prompt: options }
            : options

        const {
            model = 'anthropic/claude-3.5-sonnet',  // 🧠 Model default
            prompt = 'Deskripsikan gambar ini',     // 📝 Prompt default
            temperature = 1                         // 🌡️ Temperatur default
        } = config

        return this._sendRequest({
            model,
            temperature,
            messages: [{
                role: 'user',
                content: [
                    { type: 'text', text: prompt },
                    { type: 'image_url', image_url: { url: imageUrl } }
                ]
            }]
        })
    }
}