import React, { useState } from "react";

const Signup = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const onSubmit = async (e) => {
    e.preventDefault();

    if (!email || !email.includes("@") || !password) {
      alert("Invalid details");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords don't match");
      return;
    }
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });
    const data = await res.json();
    console.log(data);
  };

  return (
    <div className="bg-gray-200 h-screen flex items-center">
      <div className="m-auto p-12 border w-4/12 bg-white border-4 border-black border-solid rounded-xl">
        <p className="text-4xl text-center font-bold">Sign Up!</p>
        <div className="mt-12 mx-auto">
          <form className="flex flex-col" onSubmit={onSubmit}>
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
            <div className="flex flex-col mb-4">
              <label
                htmlFor="confirmPassword"
                className="text-sm w-10/12 mx-auto"
              >
                Confirm Password
              </label>
              <div className="flex w-10/12 border-2 border-black mx-auto">
                <input
                  className="p-3 w-10/12 rounded-lg focus:outline-none"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  name="confirmPassword"
                  required
                />
                <p
                  className="text-sm p-3 w-2/12 text-center border-0 border-l-2 my-auto cursor-pointer"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </p>
              </div>
            </div>
            <button
              type="submit"
              className="rounded-xl bg-blue-600 text-white w-3/12 p-4 mx-auto cursor-pointer "
            >
              Log In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Signup;
