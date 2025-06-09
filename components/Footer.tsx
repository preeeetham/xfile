"use client"
import Link from "next/link"
import { Heart, Mail } from "lucide-react"

const Footer = () => {
  return (
    <footer className="relative z-10 mt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 rounded-2xl p-8">
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Convert</h3>
              <div className="space-y-2">
                <Link
                  href="/images-to-pdf"
                  className="block text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Convert Images to PDF
                </Link>
                <Link
                  href="/docx-to-pdf"
                  className="block text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Convert Documents to PDF
                </Link>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">About FileFlow Pro</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                The most advanced file converter on the web. Fast, secure, and completely free. All processing happens
                locally on your device for maximum privacy.
              </p>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-6 text-center">
            <p className="text-gray-600 dark:text-gray-300 flex items-center justify-center gap-2">
              Made with <Heart className="w-4 h-4 text-red-500 fill-current" /> by{" "}
              <a
                className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                href="mailto:spreethamkumar5@gmail.com"
              >
                <Mail className="w-4 h-4" />
                preeetham
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
