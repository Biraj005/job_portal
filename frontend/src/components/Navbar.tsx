"use client";

import Link from "next/link"; // Correct Next.js Link
import {
  Briefcase,
  Home,
  Info,
  LogOut,
  Menu,
  Route,
  UserIcon,
  X,
} from "lucide-react"; // Use lucide icons like this
import { use, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { ModeToggle } from "./mode-toggle";
import { AppData } from "@/context/AppContext";
import { AvatarImage } from "@radix-ui/react-avatar";
import { useRouter } from "next/navigation";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { isAuth, user, isLoading, logout } = AppData();

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };
  
  const logoutHandler =() => {
    logout();
    router.push("/login");
  };
  return (
    <nav className="z-50 sticky top-0 bg-background/80 border-b backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-1 ml-5">
              <span className="text-2xl font-black tracking-tight flex gap-1">
                <span className="bg-linear-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                  Career
                </span>
                <span className="text-blue-800">Grind</span>
              </span>
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-1">
            <Link href={"/"}>
              <Button
                variant={"ghost"}
                className="flex items-center gap-2 font-medium"
              >
                <Home size={16} />
              </Button>
            </Link>
            <Link href={"/jobs"}>
              <Button
                variant={"ghost"}
                className="flex items-center gap-2 font-medium"
              >
                <Briefcase size={16} />
                Jobs
              </Button>
            </Link>

            <Link href={"/about"}>
              <Button
                variant={"ghost"}
                className="flex items-center gap-2 font-medium"
              >
                <Info size={16} />
                About
              </Button>
            </Link>
          </div>
          {/**right side actions */}
          <div className="hidden md:flex items-center gap-3 ">
            {!isLoading && (
              <>
                {isAuth ? (
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        className="flex items-center gap-2 hover:opacity-80 
                    transition-opacity"
                      >
                        <Avatar
                          className="h-9 w-9 ring-2 ring-offset-2 ring-offset-background
                        ring-blue-500 cursor-pointer hover:ring-blue-500/40 transition-all"
                        >
                          {/** avart image */}
                          <AvatarImage
                            src={user ? (user.profilePicture as string) : ""}
                            alt={user ? user.name : ""}
                          />
                          <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600">
                            {user?.name.charAt(0).toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-56 p-2" align="end">
                      <div className="px-3 py-2 mb-2 border-b">
                        <p className="text-sm font-semibold">{user?.name}</p>
                        <p className="text-xs opacity-60 truncate ">{user?.email}</p>
                      </div>
                      <Link href={"/"}>
                        <Button
                          className="w-full justify-start gap-2 "
                          variant={"ghost"}
                        >
                          <UserIcon size={16} />
                          My profile
                        </Button>
                        <Button
                          className="w-full justify-start gap-2 mt-1"
                          variant={"ghost"}
                          onClick={logoutHandler}
                        >
                          <LogOut size={16} />
                          Logout
                        </Button>
                      </Link>
                    </PopoverContent>
                  </Popover>
                ) : (
                  <Link href={"/login"}>
                    <Button className="gap-2">
                      <UserIcon size={16} />
                      Signin
                    </Button>
                  </Link>
                )}
              </>
            )}
          </div>
          {/**mobile menu */}
          <div className="md:hidden flex items-center gap-3 ">
            <ModeToggle />
            <button
              onClick={toggleMenu}
              className="p-2 rounded-lg hover:bg-accent 
               transition-colors"
              aria-label="Toggle-menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      <div
        className={`md:hidden border-t overflow-hidden transition-all duration-300 
        ease-in-out ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="px-3 py-3 space-y-1 bg-background/95 backdrop-blur-md">
          <Link href={"/"} onClick={toggleMenu}>
            <Button
              variant={"ghost"}
              className="w-full justify-start gap-3 h-11"
            >
              <Home size={18} />
              Home
            </Button>
          </Link>

          <Link href={"/job"} onClick={toggleMenu}>
            <Button
              variant={"ghost"}
              className="w-full justify-start gap-3 h-11"
            >
              <Briefcase size={18} />
              Jobs
            </Button>
          </Link>

          <Link href={"/about"} onClick={toggleMenu}>
            <Button
              variant={"ghost"}
              className="w-full justify-start gap-3 h-11"
            >
              <Info size={18} />
              About
            </Button>
          </Link>

          {isAuth ? (
            <>
              <Button
                variant={"ghost"}
                className="w-full justify-start gap-3 h-11"
              >
                <UserIcon size={18} />
                My Profile
              </Button>
              <Button
                variant={"destructive"}
                className="w-full justify-start gap-3 h-11"
                onClick={() => {
                  logoutHandler();
                  toggleMenu();
                }}
              >
                <LogOut size={18} />
                Logout
              </Button>
            </>
          ) : (
            <Link href={"/login"} onClick={toggleMenu}>
              <Button
                className="w-full justify-start gap-3 h-11 mt-2"
                onClick={() => {
                  logoutHandler();
                  toggleMenu();
                }}
              >
                <UserIcon size={18} />
                SignIn
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
