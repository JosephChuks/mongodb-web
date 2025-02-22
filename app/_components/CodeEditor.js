"use client";
import React, { useEffect, useRef } from "react";
import AceEditor from "react-ace";

import "brace/mode/json";
import "brace/theme/twilight";

const CodeEditor = ({ onChange, value }) => {
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.editor.getSession().setUseWrapMode(true);
    }
  }, []);

  return (
    <AceEditor
      mode="json"
      theme="twilight"
      onChange={onChange}
      value={value}
      name="brace-editor"
      wrapEnabled={true}
      focus={true}
      showGutter={false}
      editorProps={{ $blockScrolling: true }}
      width="100%"
      height="500px"
      fontSize={13}
      ref={editorRef}
    />
  );
};

export default CodeEditor;
