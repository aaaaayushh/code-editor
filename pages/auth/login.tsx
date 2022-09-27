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

  useEffect(() => {
    if (status === "authenticated") {
      Router.push("/");
    }
  }, [status]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signIn("credentials", {
      email,
      password,
      callbackUrl: "http://localhost:3000",
      redirect: false,
    }).then(function (result) {
      console.log(result);
      if (result.error !== null) {
        if (result.status === 401) {
          // setLoginError("Your username/password combination was incorrect. Please try again");
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
  };

  return (
    <div className="bg-gray-200 h-screen flex items-center">
      <div className="m-auto p-12 border w-4/12 bg-white border-4 border-black border-solid rounded-xl">
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
              className="mx-4 w-4/12 ml-auto mr-auto border-2 border-black z-10 rounded-md shadow-[5px_5px_0px_0px_rgba(0,0,0)] px-4 py-2 hover:shadow transition duration-200 bg-white flex-shrink-0"
            >
              Log In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Login;
