import { EditorProvider } from "@/context/EditorContext";
import { FileProvider } from "@/context/FileContext";
import { ModelProvider } from "@/context/ModelContext";
import { WizardProvider } from "@/context/WizardContext";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Bimify",
  description: "Bimify",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ModelProvider>
        <WizardProvider>
        <EditorProvider>
        <FileProvider>
          {children}
        </FileProvider>
        </EditorProvider>
        </WizardProvider>
        </ModelProvider>
      </body>
    </html>
  );
}
