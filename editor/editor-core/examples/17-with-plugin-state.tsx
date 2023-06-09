/* eslint-disable no-console */

import React from 'react';
import Lozenge from '@atlaskit/lozenge';
import ToolsDrawer from '../example-helpers/ToolsDrawer';
import { Editor, EditorContext, mediaPluginKey } from '../src';
import WithPluginState from '../src/ui/WithPluginState';
import { pluginKey as typeAheadPluginKey } from '../src/plugins/type-ahead/pm-plugins/key';

const SAVE_ACTION = () => console.log('Save');

export default function Example() {
  return (
    <EditorContext>
      <div>
        <WithPluginState
          plugins={{
            media: mediaPluginKey,
            typeAhead: typeAheadPluginKey,
          }}
          render={({ media, typeAhead }) => (
            <div
              style={{
                background: 'rgb(235, 236, 240)',
                padding: 8,
                borderRadius: 5,
                marginBottom: 8,
              }}
            >
              <h4 style={{ marginBottom: 8 }}>Plugin States:</h4>
              <div>
                Media uploads:{' '}
                {media && media.allUploadsFinished ? (
                  <Lozenge appearance="success">finished</Lozenge>
                ) : (
                  <Lozenge appearance="inprogress">in progress</Lozenge>
                )}
              </div>
              <div>
                Mention query:{' '}
                {typeAhead && typeAhead.query ? (
                  <Lozenge appearance="inprogress">{typeAhead.query}</Lozenge>
                ) : (
                  <Lozenge appearance="default">Not in progress</Lozenge>
                )}
              </div>
            </div>
          )}
        />
        <ToolsDrawer
          renderEditor={({
            disabled,
            mentionProvider,
            mediaProvider,
            onChange,
          }: any) => (
            <Editor
              disabled={disabled}
              media={{ provider: mediaProvider }}
              mentionProvider={mentionProvider}
              onChange={onChange}
              onSave={SAVE_ACTION}
              quickInsert={true}
            />
          )}
        />
      </div>
    </EditorContext>
  );
}
