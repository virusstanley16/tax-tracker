import React from 'react'
import Image from 'next/image'

const FooterPage = () => {
  return (
    <footer className="mt-2 border-t  bg-gray-100 p-4 items-center">
      <Image item-align='center' src="/DGI-Cameroun.jpg" alt="Company Logo" width={100} height={50} />
      <p>© {new Date().getFullYear()} Harmony Fiscalis DGI Cameroon.</p>
    </footer>
  );
}

export default FooterPage