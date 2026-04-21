'use client'

import React, { useState } from 'react'
import HeroSection from './HeroSection'
import VehicleSlider from './VehicleSlider'
import AuthModal from './AuthModal'

const PublicHome = () => {
const [authOpen,setAuthOpen] = useState(false);
  return (
    <div>
    <HeroSection onAuthRequired={()=>setAuthOpen(true)} />
    <VehicleSlider/>
    <AuthModal open={authOpen} onClose={()=>setAuthOpen(false)}/>
    </div>
  )
}

export default PublicHome
