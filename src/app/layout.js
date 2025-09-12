import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import RouterManager from "../components/Layout/RouterManager";
import { AuthProvider } from "../context/AuthContext";
import { ServiceProvider } from "../context/ServiceContext";
import { TestimonialProvider } from "../context/TestimonialContext";
import { PortfolioProvider } from "../context/PortfolioContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Developer Tag - Admin Panel",
  description: "Developer Tag admin panel for managing site content",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <RouterManager>
            <ServiceProvider>
              <TestimonialProvider>
                <PortfolioProvider>
                  {children}
                </PortfolioProvider>
              </TestimonialProvider>
            </ServiceProvider>
          </RouterManager>
        </AuthProvider>
      </body>
    </html>
  );
}
