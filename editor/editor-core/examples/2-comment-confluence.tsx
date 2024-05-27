/* eslint-disable no-console */
import React, { useEffect, useState } from 'react';

import { IntlProvider } from 'react-intl-next';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/new';
import { highlightPlugin } from '@atlaskit/editor-plugins/highlight';
import { extensionHandlers } from '@atlaskit/editor-test-helpers/extensions';
import { customInsertMenuItems } from '@atlaskit/editor-test-helpers/mock-insert-menu';
import LockCircleIcon from '@atlaskit/icon/glyph/lock-circle';
import { token } from '@atlaskit/tokens';

import { DevTools } from '../example-helpers/DevTools';
import ToolsDrawer from '../example-helpers/ToolsDrawer';
import { name, version } from '../package.json';
import type { EditorProps } from '../src';
import { ComposableEditor } from '../src/composable-editor';
import { useUniversalPreset } from '../src/preset-universal';
import CollapsedEditor from '../src/ui/CollapsedEditor';
import EditorContext from '../src/ui/EditorContext';
import ToolbarFeedback from '../src/ui/ToolbarFeedback';
import ToolbarHelp from '../src/ui/ToolbarHelp';
import WithEditorActions from '../src/ui/WithEditorActions';
import { usePreset } from '../src/use-preset';

const SAVE_ACTION = () => console.log('Save');
const CANCEL_ACTION = () => console.log('Cancel');
const EXPAND_ACTION = () => console.log('Expand');

const exampleDocument = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        { type: 'text', text: 'Some example document with emojis ' },
        {
          type: 'emoji',
          attrs: {
            shortName: ':catchemall:',
            id: 'atlassian-catchemall',
            text: ':catchemall:',
          },
        },
        { type: 'text', text: ' and mentions ' },
        {
          type: 'mention',
          attrs: { id: '0', text: '@Carolyn', accessLevel: '' },
        },
        { type: 'text', text: '. ' },
      ],
    },
  ],
};

type Props = {
  editorProps?: EditorProps;
  replacementDoc?: any;
};

const CommentEditorConfluence = ({ editorProps, replacementDoc }: Props) => {
  const [hasJquery, setHasJquery] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const universalPreset = useUniversalPreset({
    props: {
      appearance: 'comment',
      allowAnalyticsGASV3: true,
      shouldFocus: true,
      quickInsert: true,
      allowTextColor: true,
      allowRule: true,
      allowTables: {
        allowControls: true,
      },
      allowHelpDialog: true,
      allowExtension: true,
      ...editorProps,
    },
  });
  const { preset } = usePreset(() => universalPreset.add(highlightPlugin));

  useEffect(() => {
    delete window.jQuery;
    loadJquery();
  }, []);

  const loadJquery = () => {
    const scriptElem = document.createElement('script');
    scriptElem.type = 'text/javascript';
    scriptElem.src =
      'https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js';

    scriptElem.onload = () => {
      setHasJquery(true);
    };

    document.body.appendChild(scriptElem);
  };

  if (!hasJquery) {
    return <h3>Please wait, loading jQuery ...</h3>;
  }

  const onFocus = () => setIsExpanded(!isExpanded);

  return (
    <IntlProvider locale="en">
      <EditorContext>
        <WithEditorActions
          render={(actions) => (
            <ButtonGroup>
              <Button
                onClick={() =>
                  actions.replaceDocument(replacementDoc || exampleDocument)
                }
              >
                Load Document
              </Button>
              <Button onClick={() => actions.clear()}>Clear</Button>
            </ButtonGroup>
          )}
        />
        <ToolsDrawer
          renderEditor={({
            mentionProvider,
            emojiProvider,
            mediaProvider,
            activityProvider,
            taskDecisionProvider,
            contextIdentifierProvider,
            onChange,
            disabled,
          }: any) => (
            <div style={{ padding: token('space.250', '20px') }}>
              <CollapsedEditor
                placeholder="What do you want to say?"
                isExpanded={isExpanded}
                onFocus={onFocus}
                onExpand={EXPAND_ACTION}
              >
                <ComposableEditor
                  preset={preset}
                  appearance="comment"
                  placeholder="What do you want to say?"
                  allowAnalyticsGASV3={true}
                  shouldFocus={true}
                  quickInsert={true}
                  allowTextColor
                  allowRule={true}
                  allowTables={{
                    allowControls: true,
                  }}
                  allowHelpDialog={true}
                  disabled={disabled}
                  activityProvider={activityProvider}
                  mentionProvider={mentionProvider}
                  emojiProvider={emojiProvider}
                  media={{
                    provider: mediaProvider,
                    allowMediaSingle: true,
                    allowResizing: true,
                    allowResizingInTables: false,
                  }}
                  taskDecisionProvider={taskDecisionProvider}
                  contextIdentifierProvider={contextIdentifierProvider}
                  onChange={onChange}
                  onSave={SAVE_ACTION}
                  onCancel={CANCEL_ACTION}
                  feedbackInfo={{
                    product: 'bitbucket',
                    packageVersion: version,
                    packageName: name,
                    labels: ['atlaskit-comment'],
                  }}
                  primaryToolbarComponents={
                    <>
                      <ToolbarFeedback
                        product="bitbucket"
                        key="toolbar-feedback"
                      />
                      <ToolbarHelp key="toolbar-help" />
                    </>
                  }
                  allowExtension={true}
                  insertMenuItems={customInsertMenuItems}
                  extensionHandlers={extensionHandlers}
                  secondaryToolbarComponents={[
                    <LockCircleIcon
                      key="permission"
                      size="large"
                      label="Permissions"
                    />,
                  ]}
                  {...editorProps}
                />
              </CollapsedEditor>
            </div>
          )}
        />
        <DevTools />
      </EditorContext>
    </IntlProvider>
  );
};

export default CommentEditorConfluence;
