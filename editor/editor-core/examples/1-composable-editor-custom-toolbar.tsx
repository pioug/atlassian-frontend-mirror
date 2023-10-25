/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { token } from '@atlaskit/tokens';
import { ComposableEditor } from '@atlaskit/editor-core/composable-editor';

import type {
  ExtractPublicEditorAPI,
  PublicPluginAPI,
} from '@atlaskit/editor-common/types';
import { usePreset } from '@atlaskit/editor-core/use-preset';
import { createDefaultPreset } from '@atlaskit/editor-core/labs-next';
import { cardPlugin } from '@atlaskit/editor-plugin-card';
import { gridPlugin } from '@atlaskit/editor-plugin-grid';
import type { ListPlugin } from '@atlaskit/editor-plugin-list';
import { listPlugin } from '@atlaskit/editor-plugin-list';

import Button, { ButtonGroup } from '@atlaskit/button';
import { cardProviderStaging } from '@atlaskit/editor-test-helpers/card-provider';

import { EditorContext } from '@atlaskit/editor-core';
import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import { DevTools } from '../example-helpers/DevTools';
import { SmartCardProvider } from '@atlaskit/link-provider';
import { ConfluenceCardClient } from '@atlaskit/editor-test-helpers/confluence-card-client';

const editorStyles = css({
  margin: token('space.100', '8px'),
});

const smartCardClient = new ConfluenceCardClient('stg');

const createPreset = () =>
  createDefaultPreset({ featureFlags: {}, paste: {} })
    .add(gridPlugin)
    .add([cardPlugin, { platform: 'web' }])
    .add(listPlugin);

interface ListToolbarProps {
  editorApi: PublicPluginAPI<[ListPlugin]> | undefined;
}

function ListToolbar({ editorApi }: ListToolbarProps) {
  const { listState } = useSharedPluginState(editorApi, ['list']);
  const toggleOrderedList = editorApi?.list.commands.toggleOrderedList(
    INPUT_METHOD.TOOLBAR,
  );

  const toggleBulletList = editorApi?.list.commands.toggleBulletList(
    INPUT_METHOD.TOOLBAR,
  );

  return (
    <ButtonGroup>
      <Button
        isDisabled={listState?.bulletListDisabled}
        onClick={() => {
          editorApi?.core.actions.execute(toggleBulletList);
        }}
        isSelected={listState?.bulletListActive}
      >
        Bullet List
      </Button>
      <Button
        isDisabled={listState?.orderedListDisabled}
        onClick={() => {
          editorApi?.core.actions.execute(toggleOrderedList);
        }}
        isSelected={listState?.orderedListActive}
      >
        Ordered List
      </Button>
    </ButtonGroup>
  );
}

function FormattingToolbar({ editorApi }: ToolbarProps) {
  const { textFormattingState } = useSharedPluginState(editorApi, [
    'textFormatting',
  ]);
  const toggleStrong = editorApi?.textFormatting.commands.toggleStrong(
    INPUT_METHOD.TOOLBAR,
  );

  return (
    <Button
      isDisabled={textFormattingState?.strongDisabled}
      onClick={() => {
        editorApi?.core.actions.execute(toggleStrong);
      }}
      isSelected={textFormattingState?.strongActive}
    >
      Bold
    </Button>
  );
}

interface ToolbarProps {
  editorApi:
    | ExtractPublicEditorAPI<ReturnType<typeof createPreset>>
    | undefined;
}

function Toolbar({ editorApi }: ToolbarProps) {
  const { hyperlinkState } = useSharedPluginState(editorApi, ['hyperlink']);

  const showLinkToolbarAction = editorApi?.hyperlink.commands.showLinkToolbar(
    INPUT_METHOD.TOOLBAR,
  );

  return (
    <ButtonGroup>
      <FormattingToolbar editorApi={editorApi} />
      <ListToolbar editorApi={editorApi} />

      <Button
        appearance="link"
        isDisabled={hyperlinkState?.activeLinkMark !== undefined}
        onClick={() => {
          editorApi?.core.actions.execute(showLinkToolbarAction);
        }}
      >
        {hyperlinkState?.activeLinkMark ? 'Active Link' : 'Insert Link'}
      </Button>

      <Button
        appearance="primary"
        onClick={() => {
          editorApi?.core.actions.execute(({ tr }) => {
            return tr.insertText('*Knowing where ones towel is.*');
          });
        }}
      >
        Insert Text
      </Button>

      <Button
        appearance="primary"
        onClick={() => {
          editorApi?.core.actions.blur();
        }}
      >
        Blur
      </Button>

      <Button
        appearance="primary"
        onClick={() => {
          editorApi?.core.actions.focus();
        }}
      >
        Focus
      </Button>
    </ButtonGroup>
  );
}

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
