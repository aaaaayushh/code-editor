import React, { useEffect, useState } from "react";
import CodeEditor from "../components/CodeEditor";
import axios from "axios";
import { languageOptions } from "../constants/languageOptions";
import useKeyPress from "../hooks/useKeyPress";
import { defineTheme } from "../lib/defineTheme";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LanguageDropdown from "../components/LanguageDropdown";
import ThemeDropdown from "../components/ThemeDropdown";
import OutputWindow from "../components/OutputWindow";

interface theme {
  value: string;
  label: string;
  key?: string;
}

const Landing = () => {
  const [code, setCode] = useState<string>("//Write your code here");
  const [customInput, setCustomInput] = useState<string>("");
  const [outputDetails, setOutputDetails] = useState(null);
  const [processing, setProcessing] = useState(null);

  const [theme, setTheme] = useState<theme>({
    value: "cobalt",
    label: "Cobalt",
  });
  const [language, setLanguage] = useState(languageOptions[0]);

  const enterPress = useKeyPress("Enter");
  const ctrlPress = useKeyPress("Control");

  const handleThemeChange = (th) => {
    console.log(th);
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
      url: process.env.REACT_APP_RAPID_API_URL,
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
      url: process.env.REACT_APP_RAPID_API_URL + "/" + token,
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
      showErrorToast();
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
  useEffect(() => {
    //compile code
    if (enterPress && ctrlPress) {
      handleCompile();
    }
  }, [ctrlPress, enterPress]);

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
  const showSuccessToast = (msg) => {
    toast.success(msg || `Compiled Successfully!`, {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };
  const showErrorToast = (msg?) => {
    toast.error(msg || `Something went wrong! Please try again.`, {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
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
      <div className="h-4 w-full bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500" />
      <div className="flex flex-row">
        <div className="px-4 py-2">
          <LanguageDropdown onSelectChange={handleLanguageChange} />
        </div>
        <div className="px-4 py-2">
          <ThemeDropdown handleThemeChange={handleThemeChange} theme={theme} />
        </div>
      </div>
      <div className="flex flex-row w-full justify-between px-4">
        {/* code editor window */}
        <div className="flex flex-col w-8/12 h-full justify-start items-end">
          <CodeEditor
            onChange={onCodeChange}
            language={language}
            theme={theme.value}
            code={code}
          />
        </div>
        <div className="w-3/12">
          <OutputWindow outputDetails={outputDetails} />
        </div>
        {/* output window */}
      </div>
    </>
  );
};
export default Landing;