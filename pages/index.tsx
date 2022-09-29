import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import CodeEditor from "../components/CodeEditor";
import { languageOptions } from "../constants/languageOptions";
import useKeyPress from "../hooks/useKeyPress";
import { defineTheme } from "../lib/defineTheme";
import LanguageDropdown from "../components/LanguageDropdown";
import ThemeDropdown from "../components/ThemeDropdown";
import OutputWindow from "../components/OutputWindow";
import CustomInput from "../components/CustomInput";
import OutputDetails from "../components/OutputDetails";
import Navbar from "../components/Navbar";
import { showErrorToast, showSuccessToast } from "../lib/toast";

interface theme {
  value: string;
  label: string;
  key?: string;
}

const Landing = () => {
  const { status, data } = useSession();
  const [code, setCode] = useState<string>("//Write your code here");
  const [customInput, setCustomInput] = useState<string>("");
  const [outputDetails, setOutputDetails] = useState(null);
  const [processing, setProcessing] = useState(null);
  const [showSaveCode, setShowSaveCode] = useState<boolean>(false);
  const [codeTitle, setCodeTitle] = useState<string>("");

  const [theme, setTheme] = useState<theme>({
    value: "cobalt",
    label: "Cobalt",
  });
  const [language, setLanguage] = useState(languageOptions[0]);

  const enterPress = useKeyPress("Enter");
  const ctrlPress = useKeyPress("Control");

  const handleThemeChange = (th) => {
    if (["light", "vs-dark"].includes(th.value)) {
      setTheme(th);
    } else {
      defineTheme(th.value).then((_) => setTheme(th));
    }
  };
  //set language
  const handleLanguageChange = (option) => {
    setLanguage(option);
  };

  const handleCompile = () => {
    setProcessing(true);
    const formData = {
      language_id: language.id,
      source_code: btoa(code),
      stdin: btoa(customInput),
    };
    const options = {
      method: "POST",
      url: process.env.NEXT_PUBLIC_RAPID_API_URL,
      params: { base64_encoded: "true", fields: "*" },
      headers: {
        "content-type": "application/json",
        "Content-Type": "application/json",
        "X-RapidAPI-Host": process.env.NEXT_PUBLIC_RAPID_API_HOST,
        "X-RapidAPI-Key": process.env.NEXT_PUBLIC_RAPID_API_KEY,
      },
      data: formData,
    };
    axios
      .request(options)
      .then(function (response) {
        console.log("response data:", response.data);
        const token = response.data.token;
        checkStatus(token);
      })
      .catch((err) => {
        let error = err.response ? err.response.data : err;
        setProcessing(false);
        console.log(error);
      });
  };

  const checkStatus = async (token) => {
    const options = {
      method: "GET",
      url: process.env.NEXT_PUBLIC_RAPID_API_URL + "/" + token,
      params: { base64_encoded: "true", fields: "*" },
      headers: {
        "X-RapidAPI-Host": process.env.NEXT_PUBLIC_RAPID_API_HOST,
        "X-RapidAPI-Key": process.env.NEXT_PUBLIC_RAPID_API_KEY,
      },
    };
    try {
      let response = await axios.request(options);
      let statusId = response.data.status?.id;

      /*
      status id = 1 => in queue
      status id = 2 => processing
      */
      if (statusId === 1 || statusId === 2) {
        setTimeout(() => {
          checkStatus(token);
        }, 2000);
        return;
      } else {
        //TO DO: HANDLE ALL STATUS IDS
        setProcessing(false);
        setOutputDetails(response.data);
        showSuccessToast("Compiled Successfully");
        console.log("response data", response.data);
        return;
      }
    } catch (err) {
      console.log("check status error", err);
      setProcessing(false);
      showErrorToast("Something went wrong! Please try again later.");
    }
  };

  //set initial theme for the editor
  useEffect(() => {
    defineTheme("oceanic-next").then((_) => {
      setTheme({
        value: "oceanic-next",
        label: "Oceanic Next",
      });
    });
  }, []);

  //keyboard shortcut for compiling editor code
  // useEffect(() => {
  //   //compile code
  //   if (enterPress && ctrlPress) {
  //     handleCompile();
  //   }
  // }, [ctrlPress, enterPress]);

  const onCodeChange = (action, data) => {
    switch (action) {
      case "code": {
        setCode(data);
        break;
      }
      default: {
        console.warn("case not handled", action, data);
      }
    }
  };

  const handleSaveCode = async () => {
    const res = await fetch("/api/saveCode", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: data.user.email,
        code: code,
      }),
    });
    const ret = await res.json();
    console.log(ret);
  };
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={1500}
        hideProgressBar={true}
        newestOnTop={true}
        closeOnClick
        rtl={false}
      />
      <Navbar />
      <div className="flex flex-row">
        <div className="px-4 py-2">
          <LanguageDropdown onSelectChange={handleLanguageChange} />
        </div>
        <div className="px-4 py-2">
          <ThemeDropdown handleThemeChange={handleThemeChange} theme={theme} />
        </div>
      </div>
      <div className="flex flex-row w-full justify-start px-4 mt-4">
        {/* code editor window */}
        <div className="flex flex-col w-8/12 h-full justify-start items-end">
          <CodeEditor
            onChange={onCodeChange}
            language={language.value}
            theme={theme.value}
            code={code}
          />
        </div>
        <div className="w-4/12 p-4 ml-auto">
          <OutputWindow outputDetails={outputDetails} />
          <div className="flex flex-col items-end">
            <CustomInput
              customInput={customInput}
              setCustomInput={setCustomInput}
            />
            <div className="flex w-full justify-between">
              {status === "authenticated" && (
                <button
                  className={`mt-4 font-black border-2 border-black z-10 rounded-md shadow-[5px_5px_0px_0px_rgba(0,0,0)] px-4 py-2 hover:shadow transition duration-200 bg-white flex-shrink-0`}
                  onClick={() => setShowSaveCode(true)}
                >
                  Save code
                </button>
              )}
              <button
                onClick={handleCompile}
                disabled={!code}
                className={`mt-4 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white font-black border-2 border-black z-10 rounded-md shadow-[5px_5px_0px_0px_rgba(0,0,0)] px-4 py-2 hover:shadow transition duration-200 bg-white flex-shrink-0 
              ${!code && "opacity-50"}`}
              >
                {processing ? "Compiling..." : "Compile"}
              </button>
            </div>
          </div>
          <Modal isOpen={showSaveCode} onClose={() => setShowSaveCode(false)}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Save your code snippet</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <label htmlFor="title" className="text-sm">
                  Code Title
                </label>
                <input
                  type="text"
                  value={codeTitle}
                  name="title"
                  onChange={(e) => setCodeTitle(e.target.value)}
                  className="w-full border-2 border-black border-solid focus:outline-none p-3"
                />
                <textarea
                  value={code}
                  className="w-full border-2 border-black border-solid focus:outline-none p-3 resize-none"
                  disabled
                />
              </ModalBody>
              <ModalFooter>
                <button
                  className="mr-4 font-black border-2 border-black z-10 rounded-md shadow-[5px_5px_0px_0px_rgba(0,0,0)] px-4 py-2 hover:shadow transition duration-200 bg-white flex-shrink-0"
                  onClick={() => setShowSaveCode(false)}
                >
                  Cancel
                </button>
                <button className="font-black border-2 border-black z-10 rounded-md shadow-[5px_5px_0px_0px_rgba(0,0,0)] px-4 py-2 hover:shadow transition duration-200 bg-white flex-shrink-0">
                  Save
                </button>
              </ModalFooter>
            </ModalContent>
          </Modal>
          <OutputDetails outputDetails={outputDetails} />
        </div>
      </div>
    </>
  );
};
export default Landing;
