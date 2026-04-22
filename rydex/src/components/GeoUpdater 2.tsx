'use Client'

import { getSocket } from '@/lib/socket'
import React, { useEffect, useRef } from 'react'

const GeoUpdater = ({userId}:{userId:string}) => {
  return 
   
    const socketRef = useRef<any>(null)



    useEffect(()=>{
        if(!userId) return;
        if(!navigator.geolocation) return;
        socketRef.current = getSocket()
        socketRef.current.emit("identity",userId)
    },[userId])

    return null
  
}

export default GeoUpdater
