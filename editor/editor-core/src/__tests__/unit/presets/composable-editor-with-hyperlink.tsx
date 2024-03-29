import React from 'react';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import Button from '@atlaskit/button';
import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import type { ExtractPublicEditorAPI } from '@atlaskit/editor-common/types';

import { ComposableEditor } from '../../../composable-editor';
import { EditorContext, INPUT_METHOD } from '../../../index';
import { createDefaultPreset } from '../../../labs-next';
import { usePreset } from '../../../use-preset';

describe('hyperlink lpLinkPicker flag behaviour in composable editor with default preset', () => {
  it('check that new link picker is used when lpLinkPicker is true', async () => {
    const { getByText } = render(
      <EditorContext>
        <ComposableEditorWithToolbar lpLinkPicker={true} />
      </EditorContext>,
    );

    const toolbarButton = getByText('Click me!');
    fireEvent.click(toolbarButton);
    // check that the link picker is rendered
    await waitFor(() =>
      expect(screen.getByTestId('link-picker')).toBeInTheDocument(),
    );
    expect(
      screen.queryByTestId('hyperlink-add-toolbar'),
    ).not.toBeInTheDocument();
  });

  it('check that new link picker is used when lpLinkPicker is undefined', async () => {
    const { getByText } = render(
      <EditorContext>
        <ComposableEditorWithToolbar />
      </EditorContext>,
    );

    const toolbarButton = getByText('Click me!');
    fireEvent.click(toolbarButton);
    // check that the link picker is rendered
    await waitFor(() =>
      expect(screen.getByTestId('link-picker')).toBeInTheDocument(),
    );
    expect(
      screen.queryByTestId('hyperlink-add-toolbar'),
    ).not.toBeInTheDocument();
  });

  it('check link picker not shown when lpLinkPicker is false', async () => {
    const { getByText } = render(
      <EditorContext>
        <ComposableEditorWithToolbar lpLinkPicker={false} />
      </EditorContext>,
    );

    const toolbarButton = getByText('Click me!');
    fireEvent.click(toolbarButton);
    // check that the old link picker is rendered
    await waitFor(() =>
      expect(screen.getByTestId('hyperlink-add-toolbar')).toBeInTheDocument(),
    );
    expect(screen.queryByTestId('link-picker')).not.toBeInTheDocument();
  });
});

const createPreset = (lpLinkPicker: boolean | undefined) =>
  createDefaultPreset({
    featureFlags: {},
    paste: {},
    hyperlinkOptions: { lpLinkPicker },
  });

interface ToolbarProps {
  editorApi:
    | ExtractPublicEditorAPI<ReturnType<typeof createPreset>>
    | undefined;
}

function Toolbar({ editorApi }: ToolbarProps) {
  const { hyperlinkState } = useSharedPluginState(editorApi, ['hyperlink']);
  const showLinkToolbarAction = editorApi?.hyperlink?.commands?.showLinkToolbar(
    INPUT_METHOD.TOOLBAR,
  );

  return (
    <Button
      appearance="link"
      onClick={() => {
        editorApi?.core?.actions.execute(showLinkToolbarAction);
      }}
    >
      {hyperlinkState?.activeLinkMark ? 'Active Link' : 'Click me!'}
    </Button>
  );
}

function ComposableEditorWithToolbar({
  lpLinkPicker,
}: {
  lpLinkPicker?: boolean;
}) {
  const { preset, editorApi } = usePreset(() => createPreset(lpLinkPicker), []);

  return (
    <div>
      <Toolbar editorApi={editorApi} />
      <ComposableEditor appearance="chromeless" preset={preset} />
    </div>
  );
}
