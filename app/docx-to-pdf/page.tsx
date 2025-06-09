"use client"
import Navbar from "@/components/Navbar"
import React, { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { Upload, FileText, Download, CheckCircle, AlertCircle, Loader2, ArrowLeft, Sparkles } from 'lucide-react'
import mammoth from "mammoth"
import { jsPDF } from "jspdf"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"

const Page = () => {
  const [pdf, setPdf] = useState<jsPDF | null>(null)
  const [isConverted, setIsConverted] = useState(false)
  const [isConverting, setIsConverting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string>("")

  const convertOtherFiles = () => {
    setIsConverted(false)
    setPdf(null)
    setError(null)
    setFileName("")
    setIsConverting(false)
  }

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    setFileName(file.name)
    setIsConverting(true)
    setError(null)

    const reader = new FileReader()

    reader.onload = async (event: ProgressEvent<FileReader>) => {
      if (event.target?.result) {
        const arrayBuffer = event.target.result as ArrayBuffer

        try {
          const { value: plainText } = await mammoth.extractRawText({
            arrayBuffer,
          })

          const pdfInstance = new jsPDF()
          const splitText = pdfInstance.splitTextToSize(plainText, 190)
          
          let yPosition = 20
          splitText.forEach((line: string) => {
            if (yPosition > 280) {
              pdfInstance.addPage()
              yPosition = 20
            }
            pdfInstance.text(line, 10, yPosition)
            yPosition += 7
          })

          setPdf(pdfInstance)
          setIsConverted(true)
          setIsConverting(false)
        } catch (error) {
          console.error("Error converting .docx to PDF:", error)
          setError("Failed to convert document. Please try again.")
          setIsConverting(false)
        }
      }
    }

    reader.readAsArrayBuffer(file)
  }, [])

  const downloadPDF = () => {
    if (pdf) {
      const cleanFileName = fileName.replace(/\.[^/.]+$/, "")
      pdf.save(`${cleanFileName || "converted"}.pdf`)
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: {
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    },
  })

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-cyan-600/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        <Navbar />

        {/* Header Section */}
        <section className="pt-8 pb-12 px-4">
          <div className="max-w-4xl mx-auto">
            <Link href="/" className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Converter
            </Link>

            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 rounded-full px-4 py-2 mb-6">
                <FileText className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Document Converter
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent leading-tight mb-4">
                DOCX to PDF Converter
              </h1>

              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Transform your Word documents into professional PDFs instantly. 
                <span className="font-semibold text-blue-600 dark:text-blue-400"> Fast, secure, and completely free.</span>
              </p>
            </div>
          </div>
        </section>

        {/* Converter Section */}
        <section className="px-4 pb-16">
          <div className="max-w-3xl mx-auto">
            <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 shadow-2xl shadow-blue-500/10 dark:shadow-blue-500/20 p-8">
              {!isConverted && !isConverting ? (
                <div
                  {...getRootProps()}
                  className={`relative h-80 rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer group ${
                    isDragActive
                      ? "border-blue-400 bg-blue-50/50 dark:bg-blue-900/20 scale-105"
                      : "border-gray-300 dark:border-gray-600 bg-gray-50/50 dark:bg-gray-800/50 hover:border-blue-300 hover:bg-blue-50/30 dark:hover:bg-blue-900/10"
                  }`}
                >
                  <input {...getInputProps()} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                    <div className={`mb-6 transition-all duration-300 ${isDragActive ? "scale-110" : "group-hover:scale-105"}`}>
                      {isDragActive ? (
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                          <FileText className="w-10 h-10 text-white" />
                        </div>
                      ) : (
                        <div className="w-20 h-20 bg-gradient-to-br from-gray-400 to-gray-600 dark:from-gray-600 dark:to-gray-800 rounded-2xl flex items-center justify-center group-hover:from-blue-400 group-hover:to-indigo-600 transition-all duration-300">
                          <Upload className="w-10 h-10 text-white" />
                        </div>
                      )}
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                      {isDragActive ? "Drop your DOCX file here!" : "Upload your DOCX document"}
                    </h3>

                    <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md">
                      {isDragActive
                        ? "Release to start the conversion ✨"
                        : "Drag & drop your .docx file here, or click to browse. We'll convert it to PDF instantly."}
                    </p>

                    <Badge variant="secondary" className="bg-white/80 dark:bg-gray-700/80">
                      .DOCX files only
                    </Badge>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-6">
                  {isConverting && (
                    <div className="space-y-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto">
                        <Loader2 className="w-8 h-8 text-white animate-spin" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Converting your document...</h3>
                      <p className="text-gray-600 dark:text-gray-300">Please wait while we process your file</p>
                    </div>
                  )}

                  {isConverted && (
                    <div className="space-y-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
                        <CheckCircle className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Conversion Complete!</h3>
                        <p className="text-gray-600 dark:text-gray-300">Your document has been successfully converted to PDF</p>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                          onClick={downloadPDF}
                          size="lg"
                          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8"
                        >
                          <Download className="w-5 h-5 mr-2" />
                          Download PDF
                        </Button>
                        <Button
                          onClick={convertOtherFiles}
                          variant="outline"
                          size="lg"
                          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-white/20 dark:border-gray-700/50"
                        >
                          Convert Another File
                        </Button>
                      </div>
                    </div>
                  )}

                  {error && (
                    <div className="space-y-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto">
                        <AlertCircle className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">Conversion Failed</h3>
                        <p className="text-gray-600 dark:text-gray-300">{error}</p>
                      </div>
                      <Button
                        onClick={convertOtherFiles}
                        variant="outline"
                        size="lg"
                        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-white/20 dark:border-gray-700/50"
                      >
                        Try Again
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </Card>
          </div>
        </section>
      </div>
    </main>
  )
}

export default Page
