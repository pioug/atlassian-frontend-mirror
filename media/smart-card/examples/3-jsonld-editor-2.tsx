/** @jsx jsx */
import React, { useCallback, useState } from 'react';
import { JsonLd } from 'json-ld-types';
import { css, jsx } from '@emotion/core';
import 'brace';
import 'brace/mode/json';
import 'brace/theme/tomorrow';
import 'brace/theme/twilight';
import 'brace/ext/language_tools';
import AceEditor from 'react-ace';
import InlineMessage from '@atlaskit/inline-message';
import { useThemeObserver } from '@atlaskit/tokens';
import CardExample from './jsonld-editor/card-example';
import JsonldExample from './jsonld-editor/jsonld-example';
import LoadLinkForm from './jsonld-editor/load-link-form';
import { getDefaultResponse } from './jsonld-editor/utils';

const styles = css`
  display: flex;
  gap: 1rem;
  height: fit-content;
  padding: 2rem;

  > div {
    width: 50%;
  }
`;

const stringify = (obj: object) => JSON.stringify(obj, null, 2);

const initialJson = getDefaultResponse();
const initialText = stringify(initialJson);

const Example: React.FC = () => {
  const [json, setJson] = useState<JsonLd.Response>(initialJson);
  const [jsonError, setJsonError] = useState<string | undefined>();
  const [text, setText] = useState<string>(initialText);
  const [url, setUrl] = useState<string>();
  const [urlError, setUrlError] = useState<string | undefined>();

  const theme = useThemeObserver();
  const editorTheme = theme === 'dark' ? 'twilight' : 'tomorrow';

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
    <div css={styles}>
      <div>
        <CardExample
          json={json}
          onError={onUrlError}
          onResolve={onUrlResolve}
          url={url}
        />
      </div>
      <div>
        <h6>JSON-LD</h6>
        <LoadLinkForm onSubmit={onSubmitUrl} error={urlError} />
        <JsonldExample
          defaultValue={initialJson.data as JsonLd.Data.BaseData}
          onSelect={onJsonChange}
        />
        {jsonError && <InlineMessage appearance="error" title={jsonError} />}
        <AceEditor
          focus={true}
          mode="json"
          theme={editorTheme}
          value={text}
          defaultValue={text}
          onChange={onTextChange}
          editorProps={{ $blockScrolling: true }}
          setOptions={{ useSoftTabs: true }}
          minLines={20}
          tabSize={2}
          enableBasicAutocompletion={true}
          enableLiveAutocompletion={true}
          width="100%"
        />
      </div>
    </div>
  );
};

export default Example;
