/** @jsx jsx */
import { jsx } from '@emotion/react';

import Button, { ButtonGroup } from '@atlaskit/button';
import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import type {
  ExtractPublicEditorAPI,
  PublicPluginAPI,
} from '@atlaskit/editor-common/types';
import { EditorContext } from '@atlaskit/editor-core';
import { ComposableEditor } from '@atlaskit/editor-core/composable-editor';
import { createDefaultPreset } from '@atlaskit/editor-core/preset-default';
import { usePreset } from '@atlaskit/editor-core/use-preset';
import { cardPlugin } from '@atlaskit/editor-plugins/card';
import { decorationsPlugin } from '@atlaskit/editor-plugins/decorations';
import { floatingToolbarPlugin } from '@atlaskit/editor-plugins/floating-toolbar';
import { gridPlugin } from '@atlaskit/editor-plugins/grid';
import { hyperlinkPlugin } from '@atlaskit/editor-plugins/hyperlink';
import type { ListPlugin } from '@atlaskit/editor-plugins/list';
import { listPlugin } from '@atlaskit/editor-plugins/list';
import { widthPlugin } from '@atlaskit/editor-plugins/width';
import { cardProviderStaging } from '@atlaskit/editor-test-helpers/card-provider';
import { ConfluenceCardClient } from '@atlaskit/editor-test-helpers/confluence-card-client';
import { SmartCardProvider } from '@atlaskit/link-provider';
import { Box, xcss } from '@atlaskit/primitives';

import { DevTools } from '../example-helpers/DevTools';

const editorStyles = xcss({
  margin: 'space.100',
});

const smartCardClient = new ConfluenceCardClient('stg');

const createPreset = () =>
  createDefaultPreset({ featureFlags: {}, paste: {} })
    .add(widthPlugin)
    .add(decorationsPlugin)
    .add(floatingToolbarPlugin)
    .add(hyperlinkPlugin)
    .add(gridPlugin)
    .add([cardPlugin, { platform: 'web' }])
    .add(listPlugin);

interface ListToolbarProps {
  editorApi: PublicPluginAPI<[ListPlugin]> | undefined;
}

function ListToolbar({ editorApi }: ListToolbarProps) {
  const { listState } = useSharedPluginState(editorApi, ['list']);
  const toggleOrderedList = editorApi?.list?.commands.toggleOrderedList(
    INPUT_METHOD.TOOLBAR,
  );

  const toggleBulletList = editorApi?.list?.commands.toggleBulletList(
    INPUT_METHOD.TOOLBAR,
  );

  return (
    <ButtonGroup>
      <Button
        isDisabled={listState?.bulletListDisabled}
        onClick={() => {
          editorApi?.core?.actions.execute(toggleBulletList);
        }}
        isSelected={listState?.bulletListActive}
      >
        Bullet List
      </Button>
      <Button
        isDisabled={listState?.orderedListDisabled}
        onClick={() => {
          editorApi?.core?.actions.execute(toggleOrderedList);
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
  const toggleStrong = editorApi?.textFormatting?.commands.toggleStrong(
    INPUT_METHOD.TOOLBAR,
  );

  return (
    <Button
      isDisabled={textFormattingState?.strongDisabled}
      onClick={() => {
        editorApi?.core?.actions.execute(toggleStrong);
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

  const showLinkToolbarAction = editorApi?.hyperlink?.commands.showLinkToolbar(
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
          editorApi?.core?.actions.execute(showLinkToolbarAction);
        }}
      >
        {hyperlinkState?.activeLinkMark ? 'Active Link' : 'Insert Link'}
      </Button>

      <Button
        appearance="primary"
        onClick={() => {
          editorApi?.core?.actions.execute(({ tr }) => {
            return tr.insertText('*Knowing where ones towel is.*');
          });
        }}
      >
        Insert Text
      </Button>

      <Button
        appearance="primary"
        onClick={() => {
          editorApi?.core?.actions.blur();
        }}
      >
        Blur
      </Button>

      <Button
        appearance="primary"
        onClick={() => {
          editorApi?.core?.actions.focus();
        }}
      >
        Focus
      </Button>
    </ButtonGroup>
  );
}

export function ComposableEditorWithToolbar() {
  const { preset, editorApi } = usePreset(createPreset);

  return (
    <Box xcss={editorStyles}>
      <Toolbar editorApi={editorApi} />
      <ComposableEditor
        appearance="chromeless"
        preset={preset}
        linking={{
          smartLinks: { provider: Promise.resolve(cardProviderStaging) },
        }}
      />
    </Box>
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
