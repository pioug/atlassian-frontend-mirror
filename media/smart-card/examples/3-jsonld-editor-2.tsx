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
import { response1 } from './content/example-responses';
import CardExample from './jsonld-editor/card-example';
import JsonldExample from './jsonld-editor/jsonld-example';

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

const initialJson = response1 as JsonLd.Response;
const initialText = stringify(initialJson);

const Example: React.FC = () => {
  const [json, setJson] = useState<JsonLd.Response>(initialJson);
  const [text, setText] = useState<string>(initialText);
  const [error, setError] = useState<string | undefined>();

  const theme = useThemeObserver();
  const editorTheme = theme === 'dark' ? 'twilight' : 'tomorrow';

  const onJsonChange = useCallback((json: JsonLd.Response) => {
    try {
      const str = stringify(json);
      setText(str);

      setJson(json);
      setError(undefined);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  const onTextChange = useCallback((str: string) => {
    try {
      setText(str);

      const updatedJson = JSON.parse(str);
      setJson(updatedJson);
      setError(undefined);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  return (
    <div css={styles}>
      <div>
        <CardExample response={json} />
      </div>
      <div>
        <h6>JSON-LD</h6>
        <JsonldExample
          defaultValue={initialJson.data as JsonLd.Data.BaseData}
          onSelect={onJsonChange}
        />
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
        {error && <InlineMessage type="error" title={error} />}
      </div>
    </div>
  );
};

export default Example;
