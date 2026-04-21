'use client'
import { useSession } from 'next-auth/react'
import useGetme from './hooks/useGetme';

const InitUser = () => {
const {status} = useSession();
useGetme(status == "authenticated")
return null
}

export default InitUser
