// Footer.js
import React from 'react'
import Link from 'next/link'

const Footer = () => {
  return (
    <footer className="bg-transparent w-full flex items-center justify-center py-2">
      <div className="flex gap-4 text-white font-medium">
        <div>©2025</div>
        <Link href="/reportissue">
          <span>Report an Issue</span>
        </Link>
      </div>
    </footer>
  )
}

export default Footer
