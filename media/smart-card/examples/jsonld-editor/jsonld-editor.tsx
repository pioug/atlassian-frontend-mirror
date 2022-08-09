import React, { useCallback, useState } from 'react';
import { JsonLd } from 'json-ld-types';
import { getDefaultResponse } from './utils';

const stringify = (obj: object) => JSON.stringify(obj, null, 2);

const initialJson = getDefaultResponse();
const initialText = stringify(initialJson);

type JsonldEditorOpts = {
  initialJson: JsonLd.Response;
  json: JsonLd.Response;
  jsonError?: string;
  onJsonChange: (json: JsonLd.Response) => void;
  onSubmitUrl: (url: string) => void;
  onTextChange: (str: string) => void;
  onUrlError: (error: Error) => void;
  onUrlResolve: (json: JsonLd.Response) => void;
  text: string;
  url?: string;
  urlError?: string;
};
const JsonldEditor: React.FC<{
  children: (opts: JsonldEditorOpts) => React.ReactNode;
}> = ({ children }) => {
  const [json, setJson] = useState<JsonLd.Response>(initialJson);
  const [jsonError, setJsonError] = useState<string | undefined>();
  const [text, setText] = useState<string>(initialText);
  const [url, setUrl] = useState<string>();
  const [urlError, setUrlError] = useState<string | undefined>();

  const onJsonChange = useCallback((json: JsonLd.Response) => {
    try {
      const str = stringify(json);
      setText(str);

      setJson(json);
      setJsonError(undefined);
    } catch (err) {
      setJsonError(err.message);
    }
  }, []);

  const onTextChange = useCallback((str: string) => {
    try {
      setText(str);

      const updatedJson = JSON.parse(str);
      setJson(updatedJson);
      setJsonError(undefined);
    } catch (err) {
      setJsonError(err.message);
    }
  }, []);

  const onSubmitUrl = useCallback((url: string) => {
    setUrl(url);
    setUrlError(undefined);
  }, []);

  const onUrlResolve = useCallback(
    (json: JsonLd.Response) => {
      setUrl(undefined);
      onJsonChange(json);
    },
    [onJsonChange],
  );

  const onUrlError = useCallback((error) => {
    setUrlError(
      `${error.message}. Revert to the last successful JSON-LD content.`,
    );
    setUrl(undefined);
  }, []);

  return (
    <React.Fragment>
      {children({
        initialJson,
        json,
        jsonError,
        onJsonChange,
        onSubmitUrl,
        onTextChange,
        onUrlError,
        onUrlResolve,
        text,
        url,
        urlError,
      })}
    </React.Fragment>
  );
};

export default JsonldEditor;
