import React from 'react';

import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/dom';
import { fireEvent } from '@testing-library/react';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import { renderWithIntl as render } from '@atlaskit/media-test-helpers/renderWithIntl';
import { pluginKey as cardPluginKey } from '../../../../card/pm-plugins/plugin-key';
import {
  LinkAction,
  stateKey as hyperlinkPluginKey,
} from '../../../pm-plugins/main';

import { EditorLinkPicker } from '..';

describe('EditorLinkPicker', () => {
  const createEditor = createEditorFactory();
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
  });

  it('dispatches to hide the link picker when escape is pressed', async () => {
    const { editorView } = createEditor({});
    const dispatch = jest.spyOn(editorView, 'dispatch');

    render(
      <EditorLinkPicker
        view={editorView}
        displayText="My favourite search engine"
        url="google.com"
        onSubmit={jest.fn()}
      />,
    );

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(dispatch).toHaveBeenCalledTimes(2);
    expect(dispatch.mock.calls[0][0].getMeta(hyperlinkPluginKey).type).toBe(
      LinkAction.HIDE_TOOLBAR,
    );
    expect(dispatch.mock.calls[1][0].getMeta(cardPluginKey).type).toBe(
      'HIDE_LINK_TOOLBAR',
    );
  });

  it('dispatches to hide the link picker when the user clicks outside the picker', async () => {
    const { editorView } = createEditor({});
    const dispatch = jest.spyOn(editorView, 'dispatch');

    render(
      <div>
        <div data-testid="outside-link-picker">Element outside link picker</div>
        <EditorLinkPicker view={editorView} onSubmit={jest.fn()} />
      </div>,
    );

    await user.click(await screen.findByTestId('outside-link-picker'));

    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch.mock.calls[0][0].getMeta(hyperlinkPluginKey)).toStrictEqual(
      {
        type: LinkAction.HIDE_TOOLBAR,
      },
    );
  });

  it('dispatches to hide the link picker when the cancel button is pressed', async () => {
    const { editorView } = createEditor({});
    const dispatch = jest.spyOn(editorView, 'dispatch');

    render(
      <EditorLinkPicker
        view={editorView}
        displayText="My favourite search engine"
        url="google.com"
        onSubmit={jest.fn()}
      />,
    );

    await user.click(await screen.findByRole('button', { name: /cancel/i }));

    expect(dispatch).toHaveBeenCalledTimes(2);
    expect(dispatch.mock.calls[0][0].getMeta(hyperlinkPluginKey).type).toBe(
      LinkAction.HIDE_TOOLBAR,
    );
    expect(dispatch.mock.calls[1][0].getMeta(cardPluginKey).type).toBe(
      'HIDE_LINK_TOOLBAR',
    );
  });

  it('calls onSubmit on link picker insert', async () => {
    const { editorView } = createEditor({});
    const onSubmit = jest.fn();

    render(
      <EditorLinkPicker
        view={editorView}
        displayText="My favourite search engine"
        url="google.com"
        onSubmit={onSubmit}
      />,
    );

    await user.click(await screen.findByTestId('link-picker-insert-button'));

    expect(onSubmit).toHaveBeenCalledTimes(1);
  });
});
