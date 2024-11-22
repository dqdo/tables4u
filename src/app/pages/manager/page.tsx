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
            <button className="button">Create Restaurant</button>
            <button className="button">Delete Restaurant</button>
            <button className="button">Edit Restaurant</button>
            <button className="button">Activate Restaurant</button>
            <button className="button" onClick={handleSignout}>Sign Out</button>
        </div>
    );
}