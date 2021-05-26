import React, { useEffect, useState } from 'react';

import { CollapsedEditor, Editor, EditorContext } from '@atlaskit/editor-core';
import imageUploadHandler from '@atlaskit/editor-core/example-helpers/imageUpload';

import ToolsDrawer from '../example-helpers/ToolsDrawer';
import { SlackTransformer } from '../src';

const SAVE_ACTION = () => console.log('Save');
const CANCEL_ACTION = () => console.log('Cancel');
const EXPAND_ACTION = () => console.log('Expand');

export type Props = {};

export type State = {
  hasJquery?: boolean;
  isExpanded?: boolean;
};

export default function EditorWithFeedback(props: Props) {
  const [{ hasJquery, isExpanded }, setState] = useState<State>({
    hasJquery: false,
    isExpanded: false,
  });

  const loadJquery = () => {
    const scriptElem = document.createElement('script');
    scriptElem.type = 'text/javascript';
    scriptElem.src =
      'https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js';

    scriptElem.onload = () => {
      setState(prevState => ({
        ...prevState,
        hasJquery: true,
      }));
    };

    document.body.appendChild(scriptElem);
  };

  const handleFocus = () =>
    setState(prevState => ({
      ...prevState,
      isExpanded: !prevState.isExpanded,
    }));

  useEffect(() => {
    delete window.jQuery;

    loadJquery();
  }, []);

  if (!hasJquery) {
    return <h3>Please wait, loading jQuery ...</h3>;
  }

  return (
    <EditorContext>
      <div>
        <ToolsDrawer
          renderEditor={({
            mentionProvider,
            emojiProvider,
            onChange,
            disabled,
          }) => (
            <div style={{ padding: '20px' }}>
              <CollapsedEditor
                placeholder="What do you want to say?"
                isExpanded={isExpanded}
                onFocus={handleFocus}
                onExpand={EXPAND_ACTION}
              >
                <Editor
                  appearance="comment"
                  placeholder="What do you want to say?"
                  shouldFocus={true}
                  allowHelpDialog={true}
                  disabled={disabled}
                  mentionProvider={mentionProvider}
                  emojiProvider={emojiProvider}
                  legacyImageUploadProvider={Promise.resolve(
                    imageUploadHandler,
                  )}
                  onChange={onChange}
                  onSave={SAVE_ACTION}
                  onCancel={CANCEL_ACTION}
                  contentTransformerProvider={() => new SlackTransformer()}
                />
              </CollapsedEditor>
            </div>
          )}
        />
      </div>
    </EditorContext>
  );
}
