/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { token } from '@atlaskit/tokens';
import { ComposableEditor } from '@atlaskit/editor-core/composable-editor';

import type { PublicPluginAPI } from '@atlaskit/editor-common/types';
import { usePreset } from '@atlaskit/editor-core/use-preset';
import { createDefaultPreset } from '@atlaskit/editor-core/labs-next';
import { cardPlugin } from '@atlaskit/editor-plugin-card';
import { gridPlugin } from '@atlaskit/editor-plugin-grid';

import Button from '@atlaskit/button';
import { cardProviderStaging } from '@atlaskit/editor-test-helpers/card-provider';

import { EditorContext } from '@atlaskit/editor-core';
import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import { DevTools } from '../example-helpers/DevTools';
import { SmartCardProvider } from '@atlaskit/link-provider';
import { ConfluenceCardClient } from '@atlaskit/editor-test-helpers/confluence-card-client';
import type { HyperlinkPlugin } from '@atlaskit/editor-plugin-hyperlink';

const editorStyles = css({
  margin: token('space.100', '8px'),
});

const smartCardClient = new ConfluenceCardClient('stg');

interface ToolbarProps {
  editorApi: PublicPluginAPI<[HyperlinkPlugin]> | undefined;
}

function Toolbar({ editorApi }: ToolbarProps) {
  const { hyperlinkState } = useSharedPluginState(editorApi, ['hyperlink']);

  const showLinkToolbarAction =
    editorApi?.dependencies.hyperlink.commands.showLinkToolbar(
      INPUT_METHOD.TOOLBAR,
    );

  return (
    <div>
      <Button
        isDisabled={hyperlinkState?.activeLinkMark !== undefined}
        onClick={() => {
          // Testing one potential approach to the "editorCommands" API
          if (showLinkToolbarAction) {
            editorApi?.executeCommand(showLinkToolbarAction);
          }
        }}
      >
        {hyperlinkState?.activeLinkMark ? 'Active Link' : 'Insert Link'}
      </Button>

      <Button
        appearance="primary"
        onClick={() => {
          editorApi?.executeCommand(({ tr }) => {
            return tr.insertText('*Knowing where ones towel is.*');
          });
        }}
      >
        Insert Text
      </Button>
    </div>
  );
}

const createPreset = () =>
  createDefaultPreset({ featureFlags: {}, paste: {} })
    .add(gridPlugin)
    .add([cardPlugin, { platform: 'web' }]);

export function ComposableEditorWithToolbar() {
  const { preset, editorApi } = usePreset(createPreset, []);

  return (
    <div css={editorStyles}>
      <Toolbar editorApi={editorApi} />
      <ComposableEditor
        appearance="chromeless"
        preset={preset}
        linking={{
          smartLinks: { provider: Promise.resolve(cardProviderStaging) },
        }}
      />
    </div>
  );
}

export default function ComposableEditorExample() {
  return (
    <EditorContext>
      <SmartCardProvider client={smartCardClient}>
        <DevTools />
        <ComposableEditorWithToolbar />
      </SmartCardProvider>
    </EditorContext>
  );
}
