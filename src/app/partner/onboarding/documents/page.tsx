"use client"

import React, { ChangeEvent, useId, useState } from 'react'
import { motion } from "framer-motion"
import { ArrowLeft, Upload } from 'lucide-react'
import { useRouter } from 'next/navigation'

type DocumentKey = 'aadhar' | 'license' | 'rc'

type DocumentState = Record<DocumentKey, File | null>

type UploadBoxProps = {
  title: string
  subtitle: string
  file: File | null
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
}

const UploadBox = ({ title, subtitle, file, onChange }: UploadBoxProps) => {
  const inputId = useId()

  return (
    <label
      htmlFor={inputId}
      className='flex cursor-pointer items-center justify-between rounded-2xl border border-dashed border-gray-300 px-4 py-4 transition hover:border-black hover:bg-gray-50'
    >
      <div>
        <p className='font-medium text-gray-900'>{title}</p>
        <p className='mt-1 text-xs text-gray-500'>{subtitle}</p>
        <p className='mt-2 text-xs font-medium text-gray-700'>
          {file ? file.name : 'Tap to upload'}
        </p>
      </div>

      <div className='flex h-11 w-11 items-center justify-center rounded-full bg-black text-white'>
        <Upload size={18} />
      </div>

      <input
        id={inputId}
        type='file'
        className='hidden'
        accept='.jpg,.jpeg,.png,.pdf'
        onChange={onChange}
      />
    </label>
  )
}

const Page = () => {
  const router = useRouter()

  const [files, setFiles] = useState<DocumentState>({
    aadhar: null,
    license: null,
    rc: null,
  })

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>, type: DocumentKey) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    setFiles((previous) => ({
      ...previous,
      [type]: file,
    }))
  }

  const isAllUploaded = Boolean(files.aadhar && files.license && files.rc)

  const handleContinue = () => {
    if (!isAllUploaded) {
      return
    }

    router.push('/')
  }

  return (
    <div className='flex min-h-screen items-center justify-center bg-white px-4'>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className='w-full max-w-md rounded-3xl border border-gray-200 bg-white p-6 shadow-xl'
      >
        <div className='relative mb-6 text-center'>
          <button
            type='button'
            onClick={() => router.back()}
            className='absolute left-0 top-0 flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 transition hover:bg-gray-100'
          >
            <ArrowLeft size={18} />
          </button>

          <p className='text-xs font-medium text-gray-500'>Step 3 of 3</p>

          <h1 className='mt-1 text-xl font-semibold'>Upload Documents</h1>

          <p className='text-sm text-gray-500'>Required for verification</p>
        </div>

        <div className='space-y-4'>
          <UploadBox
            title='Aadhar / ID Proof'
            subtitle='Government issued ID'
            file={files.aadhar}
            onChange={(event) => handleFileChange(event, 'aadhar')}
          />

          <UploadBox
            title='Driving License'
            subtitle='Valid driving license'
            file={files.license}
            onChange={(event) => handleFileChange(event, 'license')}
          />

          <UploadBox
            title='Vehicle RC'
            subtitle='Registration Certificate'
            file={files.rc}
            onChange={(event) => handleFileChange(event, 'rc')}
          />
        </div>

        <p className='mt-4 text-xs text-gray-400'>
          Documents are securely stored and manually verified by our team.
        </p>

        <button
          type='button'
          disabled={!isAllUploaded}
          onClick={handleContinue}
          className={`mt-5 w-full rounded-xl py-3 font-medium transition ${
            isAllUploaded
              ? 'bg-black text-white hover:opacity-90'
              : 'cursor-not-allowed bg-gray-200 text-gray-400'
          }`}
        >
          Continue
        </button>
      </motion.div>
    </div>
  )
}

export default Page