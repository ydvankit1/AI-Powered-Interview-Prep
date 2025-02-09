import React from 'react';
import Header from './_components/Header';

// function DashboardLayout ({children}) {
//     return (
//         <div>
//             <Header/>
//             <div className='mx-5 md: mx-20 lg:mx-36'>
//             {children}
//             </div>
//         </div>
//     )
// }

// export default DashboardLayout  

export default function RootLayout({ children }) {
    return (
      <html lang="en">
        <body>
          <Header /> {/* ✅ Now the header appears on all pages */}
          <main className='mx-5 md:mx-20 lg:mx-36'>{children}</main>
        </body>
      </html>
    );
  }
