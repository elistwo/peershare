
"use client";

import { createContext, useContext, ReactNode } from "react";
import { ArchiveProvider as ActualArchiveProvider, useArchive as useActualArchive } from "@/hooks/use-archive";
import { ThemeProvider } from "./theme-provider";

// This file is being deprecated in favor of individual providers and hooks.
// For now, it will re-export the new provider and hook.

const ArchiveContext = createContext<any | undefined>(undefined);

export const AppProviders = ({ children }: { children: ReactNode }) => {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <ActualArchiveProvider>
                {children}
            </ActualArchiveProvider>
        </ThemeProvider>
    );
};

export const useArchive = () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useActualArchive();
}
