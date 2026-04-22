'use client'

import { getSocket } from '@/lib/socket'
import React, { useEffect, useRef } from 'react'

const GeoUpdater = ({ userId }: { userId: string }) => {
  const socketRef = useRef<any>(null)

  useEffect(() => {
    if (!userId) return
    if (!navigator.geolocation) return

    socketRef.current = getSocket()

    socketRef.current.emit("identity", userId)

    const watcher = navigator.geolocation.watchPosition(
      (position) => {
        socketRef.current.emit("update-location", {
          userId,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        })
      },
      (err) => {
        console.log(err)
      },
      {
        enableHighAccuracy: true,
        maximumAge: 5000
      }
    )

    return () => {
      navigator.geolocation.clearWatch(watcher)
    }
  }, [userId])

  return null
}

export default GeoUpdater