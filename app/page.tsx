import Image from 'next/image'
import Link from 'next/link'
import ExpandingArrow from '@/components/expanding-arrow'
import Uploader from '@/components/uploader'
import { Toaster } from '@/components/toaster'

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center mb-8">
      <Toaster />
      <h1 className="pt-4 pb-8 bg-gradient-to-br from-black via-[#171717] to-[#575757] bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl">
        The Kindle Clipper
      </h1>
      <div className="bg-white/30 p-12 shadow-xl ring-1 ring-gray-900/5 rounded-lg backdrop-blur-lg max-w-xl mx-auto w-full">
        <Uploader />
      </div>
    </main>
  )
}
