import React, { useEffect, useState } from "react";
import { Controlled as CodeMirror } from "react-codemirror2";
import io from "socket.io-client";
import "codemirror/lib/codemirror.css";
import "codemirror/mode/javascript/javascript";

const socket = io("http://localhost:5000"); // Connect to backend

function App() {
    const [code, setCode] = useState("// Start coding...");

    useEffect(() => {
        // Listen for updates from the server
        socket.on("codeUpdate", (newCode) => {
            setCode(newCode);
        });

        return () => {
            socket.off("codeUpdate");
        };
    }, []);

    const handleChange = (editor, data, value) => {
        setCode(value);
        socket.emit("codeUpdate", value); // Send code changes to server
    };

    return (
        <div>
            <h2>Collaborative Code Editor</h2>
            <CodeMirror
                value={code}
                options={{
                    mode: "javascript",
                    theme: "default",
                    lineNumbers: true,
                }}
                onBeforeChange={handleChange}
            />
        </div>
    );
}

export default App;
