import { signIn, useSession } from "next-auth/react";
import Router from "next/router";
import React, { useEffect, useState } from "react";
import { showErrorToast } from "../../lib/toast";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const { status, data } = useSession();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [processing, setProcessing] = useState<boolean>(false);

  useEffect(() => {
    if (status === "authenticated") {
      Router.push("/");
    }
  }, [status]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    await signIn("credentials", {
      email,
      password,
      callbackUrl: "http://localhost:3000",
      redirect: false,
    }).then(function (result) {
      console.log(result);
      if (result.error !== null) {
        if (result.status === 401) {
          console.log("Invalid creds");
          showErrorToast("Incorrect Email or Password");
        } else {
          showErrorToast("An unexpected error occured!");
          console.log(result.error);
        }
      } else {
        Router.push(result.url);
      }
    });
    setProcessing(false);
  };

  return (
    <div className="bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 h-screen flex items-center ">
      <div className="m-auto p-12 border w-4/12 bg-white shadow-[10px_10px_0px_0px_rgba(0,0,0)] rounded-xl">
        <p className="text-4xl text-center font-bold">Log In</p>
        <div className="mt-12 mx-auto">
          <form className="flex flex-col" onSubmit={handleSubmit}>
            <div className="flex flex-col mb-4">
              <label htmlFor="email" className="text-sm w-10/12 mx-auto">
                Email
              </label>
              <input
                className="p-3 w-10/12 mx-auto border-2 border-black focus:outline-none"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                name="email"
                required
              />
            </div>
            <div className="flex flex-col mb-4">
              <label htmlFor="password" className="text-sm w-10/12 mx-auto">
                Password
              </label>
              <div className="flex w-10/12 border-2 border-black mx-auto">
                <input
                  className="p-3 w-10/12 rounded-lg focus:outline-none"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  name="password"
                  required
                />
                <p
                  className="text-sm p-3 w-2/12 text-center border-0 border-l-2 my-auto cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </p>
              </div>
            </div>
            <button
              type="submit"
              className={`mx-4 cursor-pointer w-4/12 ml-auto mr-auto border-2 border-black z-10 rounded-md shadow-[5px_5px_0px_0px_rgba(0,0,0)] px-4 py-2 hover:shadow transition duration-200 bg-white flex-shrink-0
              ${processing && "opacity-50"}`}
              disabled={processing}
            >
              {processing ? (
                <div className="flex justify-center">
                  <svg
                    className="h-6 mr-2 w-6 animate-spin"
                    viewBox="3 3 18 18"
                  >
                    <path
                      className="fill-gray-800"
                      d="M12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5ZM3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z"
                    ></path>
                    <path
                      className="fill-gray-100"
                      d="M16.9497 7.05015C14.2161 4.31648 9.78392 4.31648 7.05025 7.05015C6.65973 7.44067 6.02656 7.44067 5.63604 7.05015C5.24551 6.65962 5.24551 6.02646 5.63604 5.63593C9.15076 2.12121 14.8492 2.12121 18.364 5.63593C18.7545 6.02646 18.7545 6.65962 18.364 7.05015C17.9734 7.44067 17.3403 7.44067 16.9497 7.05015Z"
                    ></path>
                  </svg>
                  <p className="text-md">Logging In...</p>
                </div>
              ) : (
                "Log In"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Login;
