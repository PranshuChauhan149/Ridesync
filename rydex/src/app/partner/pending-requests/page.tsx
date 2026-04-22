'use client'

import axios from 'axios'
import React, { useEffect } from 'react'

const page = () => {

  const fetchPendingRequests = async()=>{
    try {
      const {data} =await axios.get("/api/partner/bookings/pending")
      console.log(data);
      
    } catch (error) {
      console.log(error);
      
    }
  }

  useEffect(()=>{
    fetchPendingRequests();
  },[])

  return (
    <div>
      dsfsdf
    </div>
  )
}

export default page
