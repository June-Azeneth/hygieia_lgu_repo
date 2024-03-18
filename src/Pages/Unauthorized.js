import React from 'react'
import UnauthorizedImage from '../Assets/unauthorized.svg'

export default function Unauthorized() {
    return (
        <div className='flex items-center justify-center mt-20 max-w-screen-sm flex-col mx-auto'>
            You have no permission to access this page.
            <img src={UnauthorizedImage} alt='' className=' mt-8 w-72 h-72'/>
        </div>
    )
}
