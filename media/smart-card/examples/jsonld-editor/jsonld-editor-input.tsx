import React from 'react';
import 'brace';
import 'brace/mode/json';
import 'brace/theme/tomorrow';
import 'brace/theme/twilight';
import 'brace/ext/language_tools';
import AceEditor from 'react-ace';
import InlineMessage from '@atlaskit/inline-message';
import { useThemeObserver } from '@atlaskit/tokens';

const JsonldEditorInput: React.FC<{
  error?: string;
  onChange: (str: string) => void;
  value?: string;
}> = ({ error, onChange, value }) => {
  const theme = useThemeObserver();
  const editorTheme = theme === 'dark' ? 'twilight' : 'tomorrow';

  return (
    <React.Fragment>
      {error && <InlineMessage appearance="error" title={error} />}
      <AceEditor
        editorProps={{ $blockScrolling: true }}
        enableBasicAutocompletion={true}
        enableLiveAutocompletion={true}
        focus={true}
        minLines={20}
        mode="json"
        onChange={onChange}
        tabSize={2}
        theme={editorTheme}
        setOptions={{ useSoftTabs: true }}
        value={value}
        width="100%"
      />
    </React.Fragment>
  );
};

export default JsonldEditorInput;
