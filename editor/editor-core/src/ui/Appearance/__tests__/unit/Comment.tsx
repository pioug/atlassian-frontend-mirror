import React from 'react';
import {
  createEditorFactory,
  doc,
  p,
  mountWithIntl,
  sleep,
} from '@atlaskit/editor-test-helpers';
import Comment from '../../Comment';
import { getDefaultMediaClientConfig } from '@atlaskit/media-test-helpers/fakeMediaClient';
import { ProviderFactory } from '@atlaskit/editor-common';
import { getMediaPluginState } from '../../../../plugins/media/pm-plugins/main';
import { ReactWrapper } from 'enzyme';
import EditorContext from '../../../EditorContext';
import EditorActions from '../../../../actions';
import { MediaOptions } from '../../../../plugins/media/types';

describe('comment editor', () => {
  const createEditor = createEditorFactory();

  const editor = (doc: any) =>
    createEditor({
      doc,
      editorProps: { allowExtension: true },
    });
  it('should create empty terminal empty paragraph when clicked outside editor', () => {
    const { editorView } = editor(doc(p('Hello world'), p('Hello world')));
    const fullPage = mountWithIntl(
      <Comment
        editorView={editorView}
        providerFactory={{} as any}
        editorDOMElement={<div />}
      />,
    );
    fullPage
      .findWhere(elm => elm.name() === 'ClickWrapper')
      .simulate('click', { clientY: 200 });
    expect(editorView.state.doc).toEqualDocument(
      doc(p('Hello world'), p('Hello world'), p('')),
    );
  });

  it('should not create empty terminal empty paragraph if it is already present at end', () => {
    const { editorView } = editor(doc(p('Hello world'), p('')));
    const fullPage = mountWithIntl(
      <Comment
        editorView={editorView}
        providerFactory={{} as any}
        editorDOMElement={<div />}
      />,
    );
    fullPage
      .findWhere(elm => elm.name() === 'ClickWrapper')
      .simulate('click', { clientY: 200 })
      .simulate('click', { clientY: 200 });
    expect(editorView.state.doc).toEqualDocument(doc(p('Hello world'), p('')));
  });

  it('should not create empty terminal paragraph when clicked inside editor', () => {
    const { editorView } = editor(doc(p('Hello world')));
    const fullPage = mountWithIntl(
      <Comment
        editorView={editorView}
        providerFactory={{} as any}
        editorDOMElement={<div />}
      />,
    );
    fullPage
      .findWhere(elm => elm.name() === 'ContentArea')
      .childAt(0)
      .simulate('click');
    expect(editorView.state.doc).toEqualDocument(doc(p('Hello world')));
  });

  describe('with media', () => {
    const mediaProvider = Promise.resolve({
      viewMediaClientConfig: getDefaultMediaClientConfig(),
    });
    const providerFactory = ProviderFactory.create({
      mediaProvider,
    });

    function getSaveButton(wrapper: ReactWrapper<any, any>) {
      return wrapper.find('button[data-testid="comment-save-button"]');
    }

    it('should not be disabled when mediaPluginState.allowUploadFinished is false', async () => {
      const { editorView, eventDispatcher } = createEditor({
        doc: doc(p('')),
        providerFactory,
        editorProps: {
          allowExtension: true,
          media: { allowMediaSingle: true },
          appearance: 'comment',
        },
      });

      const comment = mountWithIntl(
        <EditorContext
          editorActions={EditorActions.from(editorView, eventDispatcher)}
        >
          <Comment
            onSave={jest.fn()}
            editorView={editorView}
            providerFactory={providerFactory}
            editorDOMElement={<div />}
          />
        </EditorContext>,
      );
      const mediaPluginState = getMediaPluginState(editorView.state);

      mediaPluginState.updateAndDispatch({
        allUploadsFinished: false,
      });

      await sleep(0);

      mediaPluginState.updateAndDispatch({
        allUploadsFinished: true,
      });
      await sleep(0);

      expect(getSaveButton(comment).prop('disabled')).toBe(false);
    });

    it('should set up required media options for Comment Editor', () => {
      const { editorView } = createEditor({
        doc: doc(p('')),
        providerFactory,
        editorProps: {
          allowExtension: true,
          media: { allowMediaSingle: true },
          appearance: 'comment',
        },
      });

      const mediaPluginState = getMediaPluginState(editorView.state);
      expect(mediaPluginState.mediaOptions).toBeDefined();

      const {
        allowAdvancedToolBarOptions,
        alignLeftOnInsert,
      } = mediaPluginState.mediaOptions as MediaOptions;
      expect(alignLeftOnInsert).toBe(true);
      expect(allowAdvancedToolBarOptions).toBe(true);
    });
  });
});
