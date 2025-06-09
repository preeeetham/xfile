"use client"
import FileConvert from "@/components/FileConvert"
import Footer from "@/components/Footer"
import Navbar from "@/components/Navbar"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Zap, Globe, Star } from "lucide-react"

const HomePage = () => {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-cyan-600/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-pink-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        <Navbar />

        {/* Hero Section */}
        <section className="pt-16 pb-8 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 rounded-full px-4 py-2 mb-6">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Trusted by 100K+ users worldwide
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent leading-tight mb-6">
              Advanced File Converter
            </h1>

            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
              Transform your files with our cutting-edge converter. Support for 200+ formats with
              <span className="font-semibold text-blue-600 dark:text-blue-400"> lightning-fast processing</span> and
              <span className="font-semibold text-green-600 dark:text-green-400"> military-grade security</span> - all
              processed locally on your device.
            </p>

            {/* Feature badges */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              <Badge
                variant="secondary"
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 text-gray-700 dark:text-gray-300 px-4 py-2"
              >
                <Shield className="w-4 h-4 mr-2" />
                100% Private
              </Badge>
              <Badge
                variant="secondary"
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 text-gray-700 dark:text-gray-300 px-4 py-2"
              >
                <Zap className="w-4 h-4 mr-2" />
                Lightning Fast
              </Badge>
              <Badge
                variant="secondary"
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 text-gray-700 dark:text-gray-300 px-4 py-2"
              >
                <Globe className="w-4 h-4 mr-2" />
                No Limits
              </Badge>
            </div>
          </div>
        </section>

        {/* Main Converter Section */}
        <section className="px-4 pb-16">
          <div className="max-w-5xl mx-auto">
            <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 shadow-2xl shadow-blue-500/10 dark:shadow-blue-500/20 p-8 md:p-12">
              <FileConvert />
            </Card>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-4 pb-16">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Why Choose Our Converter?
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 p-6 text-center hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-300 hover:scale-105 hover:shadow-xl">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">100% Secure</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  All processing happens locally on your device. Your files never leave your computer.
                </p>
              </Card>

              <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 p-6 text-center hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-300 hover:scale-105 hover:shadow-xl">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Lightning Fast</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Advanced algorithms ensure rapid conversion without compromising quality.
                </p>
              </Card>

              <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 p-6 text-center hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-300 hover:scale-105 hover:shadow-xl">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Universal Support</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Support for 200+ file formats including images, videos, audio, and documents.
                </p>
              </Card>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </main>
  )
}

export default HomePage
