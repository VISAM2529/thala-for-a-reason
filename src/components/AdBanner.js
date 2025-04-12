// components/AdBanner.js
"use client"
import { useEffect } from 'react'

const AdBanner = () => {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch (e) {
      console.error('Adsense error:', e)
    }
  }, [])

  return (
    <ins
      className="adsbygoogle"
      style={{ display: 'block' }}
      data-ad-client="ca-pub-XXXXXXX"
      data-ad-slot="YYYYYY"
      data-ad-format="auto"
      data-full-width-responsive="true"
    ></ins>
  )
}

export default AdBanner
