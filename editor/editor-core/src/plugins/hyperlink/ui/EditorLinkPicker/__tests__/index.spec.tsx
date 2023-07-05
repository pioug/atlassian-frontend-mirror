import React from 'react';
import { Selection } from 'prosemirror-state';
import { replaceRaf } from 'raf-stub';

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

replaceRaf();
const requestAnimationFrame = window.requestAnimationFrame as any;

describe('EditorLinkPicker', () => {
  const createEditor = createEditorFactory();
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
  });

  it('dispatches to hide the link picker when escape is pressed', async () => {
    const { editorView } = createEditor({
      editorProps: {
        linking: { smartLinks: { provider: Promise.resolve({}) as any } },
      },
    });
    const onCancel = jest.fn();
    requestAnimationFrame.step();
    const dispatch = jest.spyOn(editorView, 'dispatch');

    render(
      <EditorLinkPicker
        view={editorView}
        displayText="My favourite search engine"
        url="google.com"
        onSubmit={jest.fn()}
        onCancel={onCancel}
      />,
    );

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch.mock.calls[0][0].getMeta(hyperlinkPluginKey).type).toBe(
      LinkAction.HIDE_TOOLBAR,
    );
    expect(dispatch.mock.calls[0][0].getMeta(cardPluginKey).type).toBe(
      'HIDE_LINK_TOOLBAR',
    );
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('dispatches to hide the link picker when the user clicks outside the picker', async () => {
    const { editorView } = createEditor({});
    const dispatch = jest.spyOn(editorView, 'dispatch');
    const onCancel = jest.fn();

    render(
      <div>
        <div data-testid="outside-link-picker">Element outside link picker</div>
        <EditorLinkPicker
          view={editorView}
          onSubmit={jest.fn()}
          onCancel={onCancel}
        />
      </div>,
    );

    await user.click(await screen.findByTestId('outside-link-picker'));

    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch.mock.calls[0][0].getMeta(hyperlinkPluginKey)).toStrictEqual(
      {
        type: LinkAction.HIDE_TOOLBAR,
      },
    );
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('dispatches to hide the link picker when the cancel button is pressed and card is available', async () => {
    const { editorView } = createEditor({
      editorProps: {
        linking: { smartLinks: { provider: Promise.resolve({}) as any } },
      },
    });
    const onCancel = jest.fn();
    requestAnimationFrame.step();
    const dispatch = jest.spyOn(editorView, 'dispatch');

    render(
      <EditorLinkPicker
        view={editorView}
        displayText="My favourite search engine"
        url="google.com"
        onSubmit={jest.fn()}
        onCancel={onCancel}
      />,
    );

    await user.click(await screen.findByRole('button', { name: /cancel/i }));

    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch.mock.calls[0][0].getMeta(hyperlinkPluginKey).type).toBe(
      LinkAction.HIDE_TOOLBAR,
    );
    expect(dispatch.mock.calls[0][0].getMeta(cardPluginKey).type).toBe(
      'HIDE_LINK_TOOLBAR',
    );
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('dispatches to hide the link picker (except for card) when the cancel button is pressed and card is unavailable', async () => {
    const { editorView } = createEditor({});
    const onCancel = jest.fn();

    // We need an initial dispatch to trigger the "prepend toolbar"
    // This would usually be some sort of action by the user.
    // In a real editor this isn't a problem
    editorView.dispatch(
      editorView.state.tr.setSelection(
        Selection.near(editorView.state.tr.doc.resolve(1)),
      ),
    );
    const dispatch = jest.spyOn(editorView, 'dispatch');

    render(
      <EditorLinkPicker
        view={editorView}
        displayText="My favourite search engine"
        url="google.com"
        onSubmit={jest.fn()}
        onCancel={onCancel}
      />,
    );

    await user.click(await screen.findByRole('button', { name: /cancel/i }));

    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch.mock.calls[0][0].getMeta(hyperlinkPluginKey).type).toBe(
      LinkAction.HIDE_TOOLBAR,
    );
    expect(dispatch.mock.calls[0][0].getMeta(cardPluginKey)).toBe(undefined);
    expect(onCancel).toHaveBeenCalledTimes(1);
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
