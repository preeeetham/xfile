"use client"
import { useTheme } from "next-themes"
import { Moon, Sun, Sparkles } from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

const Navbar = () => {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  const handleTheme = () => {
    if (theme === "light") setTheme("dark")
    else setTheme("light")
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <nav className="relative z-20 px-4 py-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div onClick={() => router.push("/")} className="flex items-center gap-3 cursor-pointer group">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            X-File 
          </span>
        </div>

        <Button
          onClick={handleTheme}
          variant="ghost"
          size="icon"
          className="w-12 h-12 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 hover:bg-white dark:hover:bg-gray-800 transition-all duration-300 hover:scale-110"
        >
          {theme === "light" ? <Moon className="w-5 h-5 text-gray-700" /> : <Sun className="w-5 h-5 text-yellow-500" />}
        </Button>
      </div>
    </nav>
  )
}

export default Navbar
