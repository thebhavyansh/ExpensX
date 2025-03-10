"use client";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { PenBox, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { useRouter, usePathname } from "next/navigation"; // Added usePathname

const Header = () => {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false); // Track if auth check is complete
  const router = useRouter();
  const pathname = usePathname(); // Get current path
  
  const handleLogout = async () => {
    try {
      const response = await axios.post('/api/Users/logout');
      if (response.data.success) {
        setUser(null);
        router.push(`/`);
      }
    } catch (error) {
      console.log("Error during logout:", error);
    }
  }
  
  useEffect(() => {
    // Skip user fetching on login/register pages to prevent unnecessary state changes
    const isAuthPage = pathname.includes('/authentication');
    
    const fetchUser = async () => {
      try {
        if (isAuthPage) {
          // On auth pages, just mark as checked without fetching
          setAuthChecked(true);
          return;
        }
        
        const response = await axios.post("/api/Users/details");
        console.log(response);
        if (!response.data.error) {
          setUser(response.data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.log("Error fetching user details:", error);
        setUser(null);
      } finally {
        setAuthChecked(true);
      }
    };
    
    fetchUser();
    
    // Listen for storage events to detect login/logout in other tabs
    const handleStorageChange = (e) => {
      if (e.key === 'auth' || e.key === 'logout') {
        fetchUser();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [pathname]); // Re-fetch when path changes
  
  // Determine if we should show unauthenticated content
  const showUnauthContent = !user && authChecked;
  
  // Determine if we should show authenticated content
  const showAuthContent = user && authChecked;
  
  return (
    <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/">
          <Image
            src={"/image.png"}
            alt="Welth Logo"
            width={200}
            height={60}
            className="h-12 w-auto object-contain"
          />
        </Link>
        
        {/* Navigation Links - Different for signed in/out users */}
        <div className="hidden md:flex items-center space-x-8">
          {showUnauthContent && (
            <>
              <a href="#features" className="text-gray-600 hover:text-blue-600">
                Features
              </a>
              <a
                href="#testimonials"
                className="text-gray-600 hover:text-blue-600"
              >
                Testimonials
              </a>
            </>
          )}
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center space-x-4">
          {showAuthContent ? (
            <>
              <Link
                href={`/dashboard`}
                className="text-gray-600 hover:text-blue-600 flex items-center gap-2"
              >
                <Button variant="outline">
                  <LayoutDashboard size={18} />
                  <span className="hidden md:inline">Dashboard</span>
                </Button>
              </Link>
              <Link href="/transaction/create">
                <Button className="flex items-center gap-2">
                  <PenBox size={18} />
                  <span className="hidden md:inline">Add Transaction</span>
                </Button>
              </Link>
              <Button onClick={handleLogout} className="flex items-center gap-2">Logout</Button>
            </>
          ) : (
            authChecked && !pathname.includes('/authentication/login') && (
              <Link href="/authentication/login">
                <Button variant="outline">Login</Button>
              </Link>
            )
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;