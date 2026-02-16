'use client';

import { LoaderIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

export function LoadSpinner({  spinnerText  }: { spinnerText?: string }) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    if (!isVisible) {
        return null;
    }

    return (
        <div className="flex items-center justify-center py-12">
            <LoaderIcon className="size-8 animate-spin text-primary" /> 
            <span className="ml-2">{spinnerText}</span>
        </div>
    );
}
