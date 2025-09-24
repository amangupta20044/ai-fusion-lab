"use client"
import React, { use, useEffect } from 'react';
import { AppSidebar } from './_components/AppSidebar';
import { SidebarTrigger, SidebarProvider } from '@/components/ui/sidebar';
import { ThemeProvider as NextThemesProvider } from "next-themes";
import AppHeader from './_components/AppHeader';
import { useUser } from '@clerk/nextjs';
import { db } from '@/config/FirebaseConfig';
import { getDoc, doc, setDoc } from 'firebase/firestore';


function Provider({ children, ...props }) {
  
  const {user}=useUser();

  useEffect(()=>{
    if(user){
      CreateNewuser();
    }
  },[user])
  const CreateNewuser = async () => {
    // if user exist?
    const userRef = doc(db, "users", user?.primaryEmailAddress?.emailAddress);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      console.log("Existing user");
      return;
    } else {
      const userData = {
        name: user?.fullName,
        email: user?.primaryEmailAddress?.emailAddress,
        createdAt: new Date(),
        remainingMsg: 5, // only for free users
        plan: "free",
        credits: 1000 // paid users
      };
      await setDoc(userRef, userData);
      console.log('New user data saved');
    }
    // if not then insert
  };

  return (
    <NextThemesProvider {...props}
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SidebarProvider>
        <AppSidebar />
        <div className='w-full'>
          <AppHeader />{children}
        </div>
      </SidebarProvider>
    </NextThemesProvider>
  );
}

export default Provider;