"use client"
import Navbar from "@/components/Navbar"
import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { Upload, ImageIcon, Download, CheckCircle, AlertCircle, Loader2, ArrowLeft } from "lucide-react"
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

    reader.onload = async () => {
      try {
        const img = new Image()
        img.crossOrigin = "anonymous"
        img.src = reader.result as string

        img.onload = () => {
          try {
            const pdfInstance = new jsPDF()

            // Calculate dimensions to fit the image properly
            const imgWidth = img.width
            const imgHeight = img.height
            const pdfWidth = pdfInstance.internal.pageSize.getWidth()
            const pdfHeight = pdfInstance.internal.pageSize.getHeight()

            let finalWidth = pdfWidth - 20
            let finalHeight = (imgHeight * finalWidth) / imgWidth

            if (finalHeight > pdfHeight - 20) {
              finalHeight = pdfHeight - 20
              finalWidth = (imgWidth * finalHeight) / imgHeight
            }

            const x = (pdfWidth - finalWidth) / 2
            const y = (pdfHeight - finalHeight) / 2

            pdfInstance.addImage(img, "JPEG", x, y, finalWidth, finalHeight)
            setPdf(pdfInstance)
            setIsConverted(true)
            setIsConverting(false)
          } catch (error) {
            console.error("Error adding image to PDF:", error)
            setError("Failed to process image. Please try again.")
            setIsConverting(false)
          }
        }

        img.onerror = () => {
          setError("Failed to load image. Please try a different file.")
          setIsConverting(false)
        }
      } catch (error) {
        console.error("Error converting image to PDF:", error)
        setError("Failed to convert image. Please try again.")
        setIsConverting(false)
      }
    }

    reader.readAsDataURL(file)
  }, [])

  const downloadPDF = () => {
    if (pdf) {
      const cleanFileName = fileName.replace(/\.[^/.]+$/, "")
      pdf.save(`${cleanFileName || "converted-image"}.pdf`)
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: {
      "image/jpeg": [".jpeg", ".jpg"],
      "image/png": [".png"],
    },
  })

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-100 dark:from-gray-900 dark:via-purple-900 dark:to-pink-900 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-pink-400/20 to-purple-600/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        <Navbar />

        {/* Header Section */}
        <section className="pt-8 pb-12 px-4">
          <div className="max-w-4xl mx-auto">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Converter
            </Link>

            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 rounded-full px-4 py-2 mb-6">
                <ImageIcon className="w-4 h-4 text-purple-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Image Converter</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-purple-800 to-pink-900 dark:from-white dark:via-purple-200 dark:to-pink-200 bg-clip-text text-transparent leading-tight mb-4">
                Image to PDF Converter
              </h1>

              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Convert your images into professional PDF documents with perfect quality.
                <span className="font-semibold text-purple-600 dark:text-purple-400">
                  {" "}
                  Supports JPG and PNG formats.
                </span>
              </p>
            </div>
          </div>
        </section>

        {/* Converter Section */}
        <section className="px-4 pb-16">
          <div className="max-w-3xl mx-auto">
            <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 shadow-2xl shadow-purple-500/10 dark:shadow-purple-500/20 p-8">
              {!isConverted && !isConverting ? (
                <div
                  {...getRootProps()}
                  className={`relative h-80 rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer group ${
                    isDragActive
                      ? "border-purple-400 bg-purple-50/50 dark:bg-purple-900/20 scale-105"
                      : "border-gray-300 dark:border-gray-600 bg-gray-50/50 dark:bg-gray-800/50 hover:border-purple-300 hover:bg-purple-50/30 dark:hover:bg-purple-900/10"
                  }`}
                >
                  <input {...getInputProps()} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                    <div
                      className={`mb-6 transition-all duration-300 ${isDragActive ? "scale-110" : "group-hover:scale-105"}`}
                    >
                      {isDragActive ? (
                        <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center">
                          <ImageIcon className="w-10 h-10 text-white" />
                        </div>
                      ) : (
                        <div className="w-20 h-20 bg-gradient-to-br from-gray-400 to-gray-600 dark:from-gray-600 dark:to-gray-800 rounded-2xl flex items-center justify-center group-hover:from-purple-400 group-hover:to-pink-600 transition-all duration-300">
                          <Upload className="w-10 h-10 text-white" />
                        </div>
                      )}
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                      {isDragActive ? "Drop your image here!" : "Upload your image"}
                    </h3>

                    <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md">
                      {isDragActive
                        ? "Release to start the conversion ✨"
                        : "Drag & drop your JPG or PNG image here, or click to browse. We'll convert it to PDF instantly."}
                    </p>

                    <div className="flex gap-2">
                      <Badge variant="secondary" className="bg-white/80 dark:bg-gray-700/80">
                        JPG
                      </Badge>
                      <Badge variant="secondary" className="bg-white/80 dark:bg-gray-700/80">
                        PNG
                      </Badge>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-6">
                  {isConverting && (
                    <div className="space-y-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto">
                        <Loader2 className="w-8 h-8 text-white animate-spin" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Converting your image...</h3>
                      <p className="text-gray-600 dark:text-gray-300">Please wait while we process your file</p>
                    </div>
                  )}

                  {isConverted && (
                    <div className="space-y-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
                        <CheckCircle className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                          Conversion Complete!
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                          Your image has been successfully converted to PDF
                        </p>
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
                          Convert Another Image
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
