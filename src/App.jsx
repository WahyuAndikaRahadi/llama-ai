import './App.css'
import { requestGroqAi } from "./utils/groq"
import { useState } from 'react'
import { Light as LightSyntax } from "react-syntax-highlighter"
import { darcula } from "react-syntax-highlighter/dist/cjs/styles/prism"
import Loading from 'react-loading'
import Swal from 'sweetalert2'
import { motion } from 'framer-motion'
import { useEffect } from 'react'

import llama from './assets/llama.jpg'

function App() {
  const [data, setData] = useState('')
  const [loading, setLoading] = useState(false)
  const [key, setKey] = useState(0)
  const [copied, setCopied] = useState(false)

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window)) {
      Swal.fire({
        title: 'Tidak Support',
        text: 'Browser Mu Tidak Support Merekam Suara',
        icon: 'error',
        confirmButtonText: 'OK'
      })
      return
    }

    const recognition = new window.webkitSpeechRecognition()
    recognition.lang = 'id-ID'
    recognition.onresult = (event) => {
      const voiceInput = event.results[0][0].transcript
      document.getElementById('content').value = voiceInput
    }
    recognition.start()
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const ai = await requestGroqAi(document.getElementById('content').value)
      setTimeout(() => {
        setData(ai)
        setKey(prevKey => prevKey + 1)
        setLoading(false)
        Swal.fire({
          position: "top-center",
          title: 'Sukses!',
          text: 'Saya Menemukan Hasilnya',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500
        })
      }, 2000)
    } catch (error) {
      setLoading(false)
      Swal.fire({
        position: "top-center",
        title: 'Error!',
        text: 'Maaf sepertinya Ada Kesalahan atau error saya tidak menemukan hasilnya',
        icon: 'error',
        showConfirmButton: false,
        timer: 1500
      })
    }
  }
  const handleCopyText = () => {
    setCopied(true)
    const textArea = document.createElement('textarea')
    textArea.value = data
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    Swal.fire({
      title: 'Copied!',
      text: 'Text Berhasil Dicopy.',
      showConfirmButton: false,
      timer: 1500
    })
  }
  useEffect(() => {
    setCopied(false);
  }, [data]);

  return (
    <main className='flex flex-col min-h-[80vh] justify-center items-center max-w-xl w-full mx-auto'>
      <div className='flex items-center mb-4'>
        <div className='w-24 h-24 rounded-full overflow-hidden mr-4'>
          <img src={llama} alt="Llama AI" className='w-full h-full object-cover' />
        </div>

      </div>
      <h1 className='text-center text-4xl text-white'>AI LLAMA APP</h1>
      <h3 className='text-center text-1xl text-indigo-500'>Halo Saya AI yang sudah terintergrasi oleh model LLAMA 3 yang sangat cepat</h3>
      <h3 className='text-center text-1xl text-indigo-500'>Jika Anda Membutuhkan masalah saya akan memberikan solusinya</h3>
      <div className='flex flex-col gap-4 py-4 w-full'>

        <div className="input-container">
          <input id='content' placeholder='Ketik Perintah Disini' className='input-with-icon py-2 px-4 text-md rounded-md' type="text" />
          <i className='fas fa-microphone input-icon' onClick={handleVoiceInput}></i>
        </div>

        <button onClick={handleSubmit} className='bg-indigo-500 py-2 px-4 font-bold text-white rounded-md flex items-center justify-center gap-2'>
          {loading ? <Loading type='spin' color='#fff' height={20} width={20} /> : <><i className='fas fa-paper-plane'></i> Kirim Pesanmu</>}
        </button>

      </div>
      <div className='max-w-xl w-full mx-auto'>
        {data ? (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 50, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.5 }}
            className="result-container"
          >
            <LightSyntax language='swift' style={darcula} wrapLongLines={true}>{data}</LightSyntax>
            <button onClick={handleCopyText} disabled={copied} className="copy-button bg-indigo-500 py-2 px-4 font-bold text-white rounded-md flex items-center justify-center gap-2"><i className="far fa-copy"></i> {copied ? 'Copied' : 'Copy'}</button>
          </motion.div>
        ) : null}
      </div>

    </main>
  )
}

export default App;