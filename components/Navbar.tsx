import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import Link from "next/link";
const Navbar = () => {
  const { status, data } = useSession();
  const [loggingOut, setLoggingOut] = useState<boolean>(false);

  const handleSignout = async () => {
    setLoggingOut(true);
    await signOut();
    setLoggingOut(false);
  };
  return (
    <div className="flex w-full p-4 py-2 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500">
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
            className={`mx-4 border-2 border-black z-10 rounded-md shadow-[5px_5px_0px_0px_rgba(0,0,0)] px-4 py-2 hover:shadow transition duration-200 bg-white flex-shrink-0
            ${loggingOut && "opacity-50"}`}
            onClick={handleSignout}
            disabled={loggingOut}
          >
            {loggingOut ? (
              <div className="flex justify-center">
                <svg className="h-6 mr-2 w-6 animate-spin" viewBox="3 3 18 18">
                  <path
                    className="fill-gray-800"
                    d="M12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5ZM3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z"
                  ></path>
                  <path
                    className="fill-gray-100"
                    d="M16.9497 7.05015C14.2161 4.31648 9.78392 4.31648 7.05025 7.05015C6.65973 7.44067 6.02656 7.44067 5.63604 7.05015C5.24551 6.65962 5.24551 6.02646 5.63604 5.63593C9.15076 2.12121 14.8492 2.12121 18.364 5.63593C18.7545 6.02646 18.7545 6.65962 18.364 7.05015C17.9734 7.44067 17.3403 7.44067 16.9497 7.05015Z"
                  ></path>
                </svg>
                <p className="text-md">Logging Out...</p>
              </div>
            ) : (
              "Log Out"
            )}
          </button>
        ) : (
          <>
            <Link href="/auth/login">
              <a
                className={`mx-4 border-2 border-black z-10 rounded-md shadow-[5px_5px_0px_0px_rgba(0,0,0)] px-4 py-2 hover:shadow transition duration-200 bg-white flex-shrink-0 
              `}
              >
                Log In
              </a>
            </Link>
            <Link href="/auth/signup">
              <a
                className={`mx-4 border-2 border-black z-10 rounded-md shadow-[5px_5px_0px_0px_rgba(0,0,0)] px-4 py-2 hover:shadow transition duration-200 bg-white flex-shrink-0 
              `}
              >
                Sign Up
              </a>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
