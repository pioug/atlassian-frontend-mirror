const mockCloseMediaEditorCommand = jest.fn();
const mockUploadAnnotationCommand = jest.fn();

jest.mock('../../../../plugins/media/commands/media-editor', () => ({
  closeMediaEditor: jest.fn(() => mockCloseMediaEditorCommand),
  uploadAnnotation: jest.fn(() => mockUploadAnnotationCommand),
}));

import React from 'react';

import { mountWithIntl } from '@atlaskit/editor-test-helpers/enzyme';
import { FileIdentifier } from '@atlaskit/media-client';
import { SmartMediaEditor } from '@atlaskit/media-editor';
import { getDefaultMediaClientConfig } from '@atlaskit/media-test-helpers';

import { EditorView } from 'prosemirror-view';
import MediaEditor from '../../../../plugins/media/ui/MediaEditor';
import { MediaEditorState } from '../../../../plugins/media/types';
import { uploadAnnotation } from '../../../../plugins/media/commands/media-editor';

describe('media editor', () => {
  const mockView = jest.fn(
    () =>
      (({
        state: {},
        dispatch: jest.fn(),
      } as { state: {}; dispatch: Function }) as EditorView),
  );

  const identifier: FileIdentifier = {
    id: 'abc',
    mediaItemType: 'file',
    collectionName: 'xyz',
    occurrenceKey: '123',
  };

  it('renders nothing if no active editor', async () => {
    const state: MediaEditorState = {
      mediaClientConfig: getDefaultMediaClientConfig(),
    };

    const wrapper = mountWithIntl(
      <MediaEditor mediaEditorState={state} view={new mockView()} />,
    );

    expect(wrapper.isEmptyRender()).toBeTruthy();
    wrapper.unmount();
  });

  it('renders nothing if no mediaClientConfig', async () => {
    const state: MediaEditorState = {
      editor: {
        pos: 100,
        identifier,
      },
    };

    const wrapper = mountWithIntl(
      <MediaEditor mediaEditorState={state} view={new mockView()} />,
    );

    expect(wrapper.isEmptyRender()).toBeTruthy();
    wrapper.unmount();
  });

  it('passes the media identifier to the smart editor', async () => {
    const mediaClientConfig = getDefaultMediaClientConfig();
    const state: MediaEditorState = {
      mediaClientConfig,
      editor: { pos: 69, identifier },
    };

    const wrapper = mountWithIntl(
      <MediaEditor mediaEditorState={state} view={new mockView()} />,
    );

    const smartMediaEditor = wrapper.find(SmartMediaEditor);

    expect(smartMediaEditor.prop('identifier')).toEqual(identifier);
    expect(smartMediaEditor.prop('mediaClientConfig')).toEqual(
      mediaClientConfig,
    );

    wrapper.unmount();
  });

  it('dispatches closeMediaEditor when smart editor onClose is called', () => {
    const view = new mockView();
    const mediaClientConfig = getDefaultMediaClientConfig();
    const state: MediaEditorState = {
      mediaClientConfig,
      editor: { pos: 69, identifier },
    };

    const wrapper = mountWithIntl(
      <MediaEditor mediaEditorState={state} view={view} />,
    );

    const smartMediaEditor = wrapper.find(SmartMediaEditor);
    const onClose = smartMediaEditor.prop('onClose')!;

    onClose();
    expect(mockCloseMediaEditorCommand).toBeCalledWith(
      view.state,
      view.dispatch,
    );

    wrapper.unmount();
  });

  it('calls uploadAnnotation with the updated identifier and dimensions from smart editor', () => {
    const view = new mockView();
    const mediaClientConfig = getDefaultMediaClientConfig();
    const state: MediaEditorState = {
      mediaClientConfig,
      editor: { pos: 69, identifier },
    };

    const wrapper = mountWithIntl(
      <MediaEditor mediaEditorState={state} view={view} />,
    );

    const smartMediaEditor = wrapper.find(SmartMediaEditor);
    const onUploadStart = smartMediaEditor.prop('onUploadStart')!;

    const newIdentifier: FileIdentifier = {
      id: 'newId',
      mediaItemType: 'file',
      collectionName: 'newCollection',
      occurrenceKey: '999',
    };

    const newDimensions = { width: 128, height: 256 };

    onUploadStart(newIdentifier, newDimensions);
    expect(uploadAnnotation as jest.Mock).toBeCalledWith(
      newIdentifier,
      newDimensions,
    );

    wrapper.unmount();
  });

  it('dispatches uploadAnnotation when smart editor onUploadStart is called', () => {
    const view = new mockView();
    const mediaClientConfig = getDefaultMediaClientConfig();
    const state: MediaEditorState = {
      mediaClientConfig,
      editor: { pos: 69, identifier },
    };

    const wrapper = mountWithIntl(
      <MediaEditor mediaEditorState={state} view={view} />,
    );

    const smartMediaEditor = wrapper.find(SmartMediaEditor);
    const onUploadStart = smartMediaEditor.prop('onUploadStart')!;

    onUploadStart(
      {
        id: 'newId',
        mediaItemType: 'file',
        collectionName: 'newCollection',
        occurrenceKey: '999',
      },
      { width: 128, height: 256 },
    );
    expect(mockUploadAnnotationCommand).toBeCalledWith(
      view.state,
      view.dispatch,
    );

    wrapper.unmount();
  });
});
