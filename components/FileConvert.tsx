"use client"

import { Upload, FileText, X, Download, Loader2, CheckCircle, AlertCircle, Sparkles } from "lucide-react"
import ReactDropzone from "react-dropzone"
import bytesToSize from "@/utils/bytes-to-size"
import fileToIcon from "@/utils/file-to-icon"
import { useState, useEffect, useRef } from "react"
import { useToast } from "@/hooks/use-toast"
import compressFileName from "@/utils/compress-file-name"
import { Skeleton } from "@/components/ui/skeleton"
import convertFile from "@/utils/convert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import loadFfmpeg from "@/utils/load-ffmpeg"
import type { Action } from "@/Types/Actions"
import type { FFmpeg } from "@ffmpeg/ffmpeg"

const extensions = {
  image: ["jpg", "jpeg", "png", "gif", "bmp", "webp", "ico", "tif", "tiff", "svg", "raw", "tga"],
  video: [
    "mp4",
    "m4v",
    "mp4v",
    "3gp",
    "3g2",
    "avi",
    "mov",
    "wmv",
    "mkv",
    "flv",
    "ogv",
    "webm",
    "h264",
    "264",
    "hevc",
    "265",
  ],
  audio: ["mp3", "wav", "ogg", "aac", "wma", "flac", "m4a"],
}

export default function FileConvert() {
  const { toast } = useToast()
  const [is_hover, setIsHover] = useState<boolean>(false)
  const [actions, setActions] = useState<Action[]>([])
  const [is_ready, setIsReady] = useState<boolean>(false)
  const [files, setFiles] = useState<any[]>([])
  const [is_loaded, setIsLoaded] = useState<boolean>(false)
  const [is_converting, setIsConverting] = useState<boolean>(false)
  const [is_done, setIsDone] = useState<boolean>(false)
  const ffmpegRef = useRef<any | null>(null)
  const [defaultValues, setDefaultValues] = useState<string>("video")
  const [selected, setSelected] = useState<string>("...")

  const accepted_files = {
    "image/*": [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp", ".ico", ".tif", ".tiff", ".raw", ".tga"],
    "audio/*": [],
    "video/*": [],
  }

  const reset = () => {
    setIsDone(false)
    setActions([])
    setFiles([])
    setIsReady(false)
    setIsConverting(false)
  }

  const downloadAll = (): void => {
    for (const action of actions) {
      !action.is_error && download(action)
    }
  }

  const download = (action: Action) => {
    const a = document.createElement("a")
    a.style.display = "none"
    a.href = action.url
    a.download = action.output
    document.body.appendChild(a)
    a.click()
    URL.revokeObjectURL(action.url)
    document.body.removeChild(a)
  }

  const convert = async (): Promise<any> => {
    let tmp_actions = actions.map((elt) => ({
      ...elt,
      is_converting: true,
    }))
    setActions(tmp_actions)
    setIsConverting(true)

    for (const action of tmp_actions) {
      try {
        const { url, output } = await convertFile(ffmpegRef.current, action)
        tmp_actions = tmp_actions.map((elt) =>
          elt === action
            ? {
                ...elt,
                is_converted: true,
                is_converting: false,
                url,
                output,
              }
            : elt,
        )
        setActions(tmp_actions)
      } catch (err) {
        tmp_actions = tmp_actions.map((elt) =>
          elt === action
            ? {
                ...elt,
                is_converted: false,
                is_converting: false,
                is_error: true,
              }
            : elt,
        )
        setActions(tmp_actions)
      }
    }
    setIsDone(true)
    setIsConverting(false)
  }

  const handleUpload = (data: any[]): void => {
    handleExitHover()
    setFiles(data)
    const tmp: Action[] = []
    data.forEach((file: any) => {
      tmp.push({
        file_name: file.name,
        file_size: file.size,
        from: file.name.slice(((file.name.lastIndexOf(".") - 1) >>> 0) + 2),
        to: null,
        file_type: file.type,
        file,
        is_converted: false,
        is_converting: false,
        is_error: false,
      })
    })
    setActions(tmp)
  }

  const handleHover = (): void => setIsHover(true)
  const handleExitHover = (): void => setIsHover(false)

  const updateAction = (file_name: string, to: string) => {
    setActions(
      actions.map((action): Action => {
        if (action.file_name === file_name) {
          return { ...action, to }
        }
        return action
      }),
    )
  }

  const checkIsReady = (): void => {
    let tmp_is_ready = true
    actions.forEach((action: Action) => {
      if (!action.to) tmp_is_ready = false
    })
    setIsReady(tmp_is_ready)
  }

  const deleteAction = (action: Action): void => {
    setActions(actions.filter((elt) => elt !== action))
    setFiles(files.filter((elt) => elt.name !== action.file_name))
  }

  useEffect(() => {
    if (!actions.length) {
      setIsDone(false)
      setFiles([])
      setIsReady(false)
      setIsConverting(false)
    } else {
      checkIsReady()
    }
  }, [actions])

  useEffect(() => {
    load()
  }, [])

  const load = async () => {
    const ffmpeg_response: FFmpeg = await loadFfmpeg()
    ffmpegRef.current = ffmpeg_response
    setIsLoaded(true)
  }

  if (actions.length) {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Your Files</h2>
          <p className="text-gray-600 dark:text-gray-300">Configure your conversion settings below</p>
        </div>

        {actions.map((action: Action, i: any) => (
          <Card
            key={i}
            className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 p-6 hover:bg-white/90 dark:hover:bg-gray-800/90 transition-all duration-300"
          >
            {!is_loaded && <Skeleton className="absolute inset-0 rounded-lg" />}

            <div className="flex flex-col lg:flex-row lg:items-center gap-6">
              <div className="flex items-center gap-4 flex-1">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white text-xl">
                  {fileToIcon(action.file_type)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                    {compressFileName(action.file_name)}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{bytesToSize(action.file_size)}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {action.is_error ? (
                  <Badge variant="destructive" className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Error Converting
                  </Badge>
                ) : action.is_converted ? (
                  <Badge className="bg-green-500 hover:bg-green-600 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Completed
                  </Badge>
                ) : action.is_converting ? (
                  <Badge variant="secondary" className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Converting...
                  </Badge>
                ) : (
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Convert to:</span>
                    <Select
                      onValueChange={(value: any) => {
                        if (extensions.audio.includes(value)) {
                          setDefaultValues("audio")
                        } else if (extensions.video.includes(value)) {
                          setDefaultValues("video")
                        }
                        setSelected(value)
                        updateAction(action.file_name, value)
                      }}
                      value={selected}
                    >
                      <SelectTrigger className="w-32 bg-white/80 dark:bg-gray-700/80 border-white/20 dark:border-gray-600/50">
                        <SelectValue placeholder="Format" />
                      </SelectTrigger>
                      <SelectContent className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm">
                        {action.file_type.includes("image") && (
                          <div className="grid grid-cols-2 gap-1 p-2">
                            {extensions.image.map((elt, i) => (
                              <SelectItem key={i} value={elt} className="text-center">
                                {elt.toUpperCase()}
                              </SelectItem>
                            ))}
                          </div>
                        )}
                        {action.file_type.includes("video") && (
                          <Tabs defaultValue={defaultValues} className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                              <TabsTrigger value="video">Video</TabsTrigger>
                              <TabsTrigger value="audio">Audio</TabsTrigger>
                            </TabsList>
                            <TabsContent value="video" className="p-2">
                              <div className="grid grid-cols-3 gap-1">
                                {extensions.video.map((elt, i) => (
                                  <SelectItem key={i} value={elt} className="text-center">
                                    {elt.toUpperCase()}
                                  </SelectItem>
                                ))}
                              </div>
                            </TabsContent>
                            <TabsContent value="audio" className="p-2">
                              <div className="grid grid-cols-3 gap-1">
                                {extensions.audio.map((elt, i) => (
                                  <SelectItem key={i} value={elt} className="text-center">
                                    {elt.toUpperCase()}
                                  </SelectItem>
                                ))}
                              </div>
                            </TabsContent>
                          </Tabs>
                        )}
                        {action.file_type.includes("audio") && (
                          <div className="grid grid-cols-2 gap-1 p-2">
                            {extensions.audio.map((elt, i) => (
                              <SelectItem key={i} value={elt} className="text-center">
                                {elt.toUpperCase()}
                              </SelectItem>
                            ))}
                          </div>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {action.is_converted ? (
                  <Button
                    onClick={() => download(action)}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteAction(action)}
                    className="hover:bg-red-100 dark:hover:bg-red-900/20 hover:text-red-600"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
          {is_done ? (
            <>
              <Button
                onClick={downloadAll}
                size="lg"
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8"
              >
                <Download className="w-5 h-5 mr-2" />
                {actions.length > 1 ? "Download All" : "Download"}
              </Button>
              <Button
                onClick={reset}
                variant="outline"
                size="lg"
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-white/20 dark:border-gray-700/50"
              >
                Convert More Files
              </Button>
            </>
          ) : (
            <Button
              disabled={!is_ready || is_converting}
              onClick={convert}
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 disabled:opacity-50"
            >
              {is_converting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Converting...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Convert Now
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    )
  }

  return (
    <ReactDropzone
      onDrop={handleUpload}
      onDragEnter={handleHover}
      onDragLeave={handleExitHover}
      accept={accepted_files}
      onDropRejected={() => {
        handleExitHover()
        toast({
          variant: "destructive",
          title: "Error uploading your file(s)",
          description: "Allowed Files: Audio, Video and Images.",
          duration: 5000,
        })
      }}
      onError={() => {
        handleExitHover()
        toast({
          variant: "destructive",
          title: "Error uploading your file(s)",
          description: "Allowed Files: Audio, Video and Images.",
          duration: 5000,
        })
      }}
    >
      {({ getRootProps, getInputProps }) => (
        <div
          {...getRootProps()}
          className={`relative h-80 lg:h-96 rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer group ${
            is_hover
              ? "border-blue-400 bg-blue-50/50 dark:bg-blue-900/20 scale-105"
              : "border-gray-300 dark:border-gray-600 bg-gray-50/50 dark:bg-gray-800/50 hover:border-blue-300 hover:bg-blue-50/30 dark:hover:bg-blue-900/10"
          }`}
        >
          <input {...getInputProps()} />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
            <div className={`mb-6 transition-all duration-300 ${is_hover ? "scale-110" : "group-hover:scale-105"}`}>
              {is_hover ? (
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
              {is_hover ? "Drop your files here!" : "Upload your files"}
            </h3>

            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md">
              {is_hover
                ? "Release to start the magic ✨"
                : "Drag & drop your files here, or click to browse. We support images, videos, and audio files."}
            </p>

            <div className="flex flex-wrap justify-center gap-2">
              <Badge variant="secondary" className="bg-white/80 dark:bg-gray-700/80">
                Images
              </Badge>
              <Badge variant="secondary" className="bg-white/80 dark:bg-gray-700/80">
                Videos
              </Badge>
              <Badge variant="secondary" className="bg-white/80 dark:bg-gray-700/80">
                Audio
              </Badge>
            </div>
          </div>
        </div>
      )}
    </ReactDropzone>
  )
}
