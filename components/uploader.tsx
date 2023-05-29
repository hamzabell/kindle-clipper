'use client'

import { useState, useCallback, useMemo, ChangeEvent, useEffect } from 'react'
import toast from 'react-hot-toast'
import LoadingDots from './loading-dots'
import GenerateHTML from '@/app/lib/generate-html'
import jsPDF from 'jspdf'

// @ts-ignore
import pdf from 'html-to-pdf-js';

export default function Uploader() {
  const [data, setData] = useState<{
    image: string | null
    fileName: string | null
  }>({
    image: null,
    fileName: null
  })

  const [response, setResponse]= useState<{
    title: string,
    highlights: string[]
  }[] | null >(null);

  const [selectedDocument, setSelectedDocument] = useState<{
    title: string,
    highlights: string[]
  } | null>(null);

  const [file, setFile] = useState<File | null>(null)

  const [dragActive, setDragActive] = useState(false)

  const onChangeText = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.currentTarget.files && event.currentTarget.files[0]
      if (file) {
        if (file.size / 1024 / 1024 > 50) {
          toast.error('File size too big (max 50MB)')
        } else {
          setFile(file)
          const reader = new FileReader()
          reader.onload = (e) => {
            setData((prev: any) => ({ ...prev, image: e.target?.result as string, fileName: file.name as string }))
          }
          reader.readAsDataURL(file)
        }
      }
    },
    [setData]
  )

  useEffect(() =>  {

    (async () => {
      if (!selectedDocument) {
        return;
      } 
      const { title, highlights } = selectedDocument; 
  
      const html = GenerateHTML(title, highlights);

      var opt = {
        margin:       1,
        filename:     `${title}.pdf`,
        image:        { type: 'jpeg', quality: 1 },
        html2canvas:  { scale: 1 },
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' },
        pagebreak: { mode: ['css', 'avoid-all'] }

      };

      await pdf().set(opt).from(html).save()
      
    })()

    setSelectedDocument(null);

  }, [selectedDocument])


  const [saving, setSaving] = useState(false)

  const saveDisabled = useMemo(() => {
    return !data.image || saving
  }, [data.image, saving])

  return (
    <>
    <form
      className="grid gap-6"
      onSubmit={async (e) => {
        e.preventDefault()
        setSaving(true)
        fetch('api/highlights', {
          method: 'POST',
          headers: { 'content-type': file?.type || 'application/octet-stream' },
          body: file,
        })
        .then(async res => {
          if (res.status == 200) {
            const allHighlights = await res.json();
  
            setResponse(allHighlights.data);
            toast.success("Highlights retreived successfully!")
          } else {
            const error = await res.text()
            toast.error(error)   
          }
          setSaving(false);
        })
      }}
    >
      <div>
        <div className="space-y-1 mb-4">
          <h2 className="text-xl font-semibold mb-0">Upload a file</h2>
          <p className="text-sm text-gray-500">
            Accepted formats: .txt
          </p>
        </div>
        <label
          htmlFor="image-upload"
          className="group relative mt-2 flex h-72 cursor-pointer flex-col items-center justify-center rounded-md border border-gray-300 bg-white shadow-sm transition-all hover:bg-gray-50"
        >
          <div
            className="absolute z-[5] h-full w-full rounded-md"
            onDragOver={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setDragActive(true)
            }}
            onDragEnter={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setDragActive(true)
            }}
            onDragLeave={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setDragActive(false)
            }}
            onDrop={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setDragActive(false)

              const file = e.dataTransfer.files && e.dataTransfer.files[0]
              if (file) {
                if (file.size / 1024 / 1024 > 50) {
                  toast.error('File size too big (max 50MB)')
                } else {
                  setFile(file)
                  const reader = new FileReader()
                  reader.onload = (e) => {
                    setData((prev: any) => ({
                      ...prev,
                      image: e.target?.result as string,
                    }))
                  }
                  reader.readAsDataURL(file)
                }
              }
            }}
          />
          <div
            className={`${
              dragActive ? 'border-2 border-black' : ''
            } absolute z-[3] flex h-full w-full flex-col items-center justify-center rounded-md px-10 transition-all ${
              data.image
                ? 'bg-white/80 opacity-0 hover:opacity-100 hover:backdrop-blur-md'
                : 'bg-white opacity-100 hover:bg-gray-50'
            }`}
          >
            <svg
              className={`${
                dragActive ? 'scale-110' : 'scale-100'
              } h-7 w-7 text-gray-500 transition-all duration-75 group-hover:scale-110 group-active:scale-95`}
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path>
              <path d="M12 12v9"></path>
              <path d="m16 16-4-4-4 4"></path>
            </svg>
            <p className="mt-2 text-center text-sm text-gray-500">
              Drag and drop or click to upload your exported kindle clippings
            </p>

            <span className="sr-only">Photo upload</span>
          </div>
          {data.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <p className='text-base font-normal'>{data.fileName}</p>
          )}
        </label>
        <div className="mt-1 flex rounded-md shadow-sm">
          <input
            id="image-upload"
            name="image"
            type="file"
            accept="text/plain"
            className="sr-only"
            onChange={onChangeText}
          />
        </div>
      </div>

      <button
        disabled={saveDisabled}
        className={`${
          saveDisabled
            ? 'cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400'
            : 'border-black bg-black text-white hover:bg-white hover:text-black'
        } flex h-10 w-full items-center justify-center rounded-md border text-sm transition-all focus:outline-none`}
      >
        {saving ? (
          <LoadingDots color="#808080" />
        ) : (
          <p className="text-sm">Confirm upload</p>
        )}
      </button>
    </form>

    {response && (
      <>
        <h5 className='mt-8 mb-2'>All Document(s)</h5>
        <ul role="list" className="divide-y divide-gray-100">

          {
            response.map((doc: any, i: any) => (
              <li className="flex justify-between gap-x-6 py-5" key={i} >
                <div className="flex gap-x-4">
                  <div className="w-64 flex-auto">
                    <p className="text-sm font-semibold leading-6 text-gray-900">{doc.title}</p>
                    <p className="mt-1 truncate text-xs leading-5 text-gray-500">{doc.highlights.length} Highlights</p>

                  </div>
                </div>
                <div className="hidden sm:flex sm:flex-col sm:items-end">
                <a  className="cursor-pointer rounded-md bg-red-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white" onClick={() => setSelectedDocument(doc)}>PDF</a>
                </div>
            </li>
            ))
          } 
        </ul>
      </>
    )}
    </>
  )
}
