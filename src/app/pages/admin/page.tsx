'use client'

import React, { useState } from "react";
import { useRouter } from 'next/navigation';

export default function Home() {
    const [redraw, forceRedraw] = React.useState(0)

    function andRefreshDisplay() {
      forceRedraw(redraw + 1)
    }

    
    const router = useRouter();

    const handleSignout = () => {
        router.push("/..")
    };

    return (
        <div>
            <button className="button">{"Delete Restaurant(s)"}</button>
            <button className="button">{"List Restaurant(s)"}</button>
            <button className="button" onClick={handleSignout}>Sign Out</button>
        </div>
    );
}