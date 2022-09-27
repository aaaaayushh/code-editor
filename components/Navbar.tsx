import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import Link from "next/link";
const Navbar = () => {
  const { status, data } = useSession();
  const [loggingOut, setLoggingOut] = useState<boolean>(false);

  return (
    <div className="flex w-full mt-2">
      {/* logo */}
      <div className="ml-auto flex">
        <Link href="/">
          <a
            className={`mx-4 border-2 border-black z-10 rounded-md shadow-[5px_5px_0px_0px_rgba(0,0,0)] px-4 py-2 hover:shadow transition duration-200 bg-white flex-shrink-0`}
          >
            Home
          </a>
        </Link>
        {status === "authenticated" && (
          <Link href="/dashboard">
            <a
              className={`mx-4 border-2 border-black z-10 rounded-md shadow-[5px_5px_0px_0px_rgba(0,0,0)] px-4 py-2 hover:shadow transition duration-200 bg-white flex-shrink-0 
`}
            >
              Dashboard
            </a>
          </Link>
        )}
        {status === "authenticated" ? (
          <button
            className="mx-4 border-2 border-black z-10 rounded-md shadow-[5px_5px_0px_0px_rgba(0,0,0)] px-4 py-2 hover:shadow transition duration-200 bg-white flex-shrink-0"
            onClick={() => {
              signOut();
            }}
          >
            Log Out
          </button>
        ) : (
          <Link href="/auth/login">
            <a
              className={`mx-4 border-2 border-black z-10 rounded-md shadow-[5px_5px_0px_0px_rgba(0,0,0)] px-4 py-2 hover:shadow transition duration-200 bg-white flex-shrink-0 
`}
            >
              Log In
            </a>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
