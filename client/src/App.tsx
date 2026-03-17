import { useState } from 'react'
import Header from './components/Header'
import ComposePanel from './components/ComposePanel'
import PreviewPanel from './components/PreviewPanel'
import Notification from './components/Notification'
import axios from 'axios'

function App() {
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [notification, setNotification] = useState<{ text: string, type: 'success' | 'error' } | null>(null)
  const [provider, setProvider] = useState<'groq' | 'claude' | 'gemini'>('groq')
  
  const [formData, setFormData] = useState({
    rawContent: '',
    language: 'English',
    blogTitle: '',
    blogUrl: ''
  })

  const showNotification = (text: string, type: 'success' | 'error') => {
    setNotification({ text, type })
  }

  const handleGenerate = async () => {
    if (!formData.rawContent) {
      showNotification('Please paste some content to reformat', 'error')
      return
    }

    setIsLoading(true)
    try {
      const response = await axios.post('/api/generate', {
        ...formData,
        provider
      })
      
      setMessage(response.data.message)
      showNotification('Post reformatted successfully!', 'success')
    } catch (error) {
      console.error(error)
      showNotification('Failed to generate post. Check API limits.', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="fixed top-[-50%] left-[-20%] w-[70vw] h-[70vw] rounded-full bg-wa-green/5 blur-[120px] pointer-events-none -z-10 blur-glow"></div>
      
      <Header />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-10 md:mb-14">
          <h1 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-white">
            Paste any post. Get it in your <span className="text-wa-green">format.</span>
          </h1>
          <p className="text-white/60 text-lg md:text-xl font-medium leading-relaxed">
            Drop any product content — AI reformats it to your WhatsApp style instantly.
          </p>
        </div>

        <div className="flex flex-col lg:grid lg:grid-cols-[1fr_400px] xl:grid-cols-[1.5fr_1fr] gap-6 md:gap-8 items-start pb-20 w-full relative">
          <ComposePanel 
             formData={formData}
             setFormData={setFormData}
             message={message}
             setMessage={setMessage}
             isLoading={isLoading}
             provider={provider}
             setProvider={setProvider}
             onGenerate={handleGenerate}
             showNotification={showNotification}
          />

          <div className="w-full mt-6 lg:mt-0">
             <PreviewPanel message={message} />
          </div>
        </div>
      </main>

      <Notification 
         notification={notification} 
         onClose={() => setNotification(null)} 
      />
    </div>
  )
}

export default App
