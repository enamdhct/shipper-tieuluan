
'use client'
import { Inter } from "next/font/google";
import Link from "next/link";
import "./taiwind.css";
import './globals.css'
import { Providers } from "./providers";


import TabMenu from "@/components/TabMenu/TabMenu";
import { useEffect, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({children}) {
  const [selectedTab, setSelectedTab] = useState('dashboard');
    return (
        <html lang="en">
            <body className={inter.className}>
                <div className="flex flex-row grow min-h-screen overflow-hidden">
                    <div className=" bg-white shadow-inner flex flex-col" style={{ width: "12%"}}>
                        <div className="flex justify-center w-full">
                            <img src="https://firebasestorage.googleapis.com/v0/b/argishop-cab9c.appspot.com/o/images%2FArgiShop.png?alt=media&token=7bf18b21-7d03-4775-9f5b-f2d906dd321f" alt="" width={80} height={80}/>
                        </div>
                        <div className="text-white p-4">
                            <div className={`p-2 ${selectedTab === "dashboard" ? "bg-green-400 text-white font-bold" : "hover:bg-slate-100 text-slate-500"} my-2 rounded flex items-center`}>
                                <TabMenu url={'/admin/dashboard/'} iconName={'home'} text={'Giao hàng'}  className={`${selectedTab === "dashboard" ? " text-white font-bold" : "text-slate-500"}`}></TabMenu>
                            </div>
                        </div>
                    </div>
                    <div style={{backgroundColor: '#f5f5f5', width: "88%"}}>
                        <div className="flex justify-end p-3 bg-white shadow-inner">
                            <div className="mr-8">
                            </div>
                        </div>
                        <Providers>{children}</Providers>
                    </div>
                </div>
            </body>
        </html>
    );
}
