import React from 'react';
import { doc, p, DocBuilder } from '@atlaskit/editor-test-helpers/doc-builder';
import { sleep } from '@atlaskit/editor-test-helpers/sleep';
import { mountWithIntl } from '@atlaskit/editor-test-helpers/enzyme';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
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

  const editor = (doc: DocBuilder) =>
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
      .findWhere((elm) => elm.name() === 'ClickWrapper')
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
      .findWhere((elm) => elm.name() === 'ClickWrapper')
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
      .findWhere((elm) => elm.name() === 'ContentArea')
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
  describe('secondary toolbar', () => {
    it('should render the secondary toolbar if there is a save button', () => {
      const { editorView } = editor(doc(p('Hello world')));
      const fullPage = mountWithIntl(
        <Comment
          editorView={editorView}
          onSave={true as any}
          providerFactory={{} as any}
          editorDOMElement={<div />}
        />,
      );
      fullPage
        .findWhere((elm) => elm.name() === 'ContentArea')
        .childAt(0)
        .simulate('click');
      expect(
        fullPage.findWhere((elm) => elm.name() === 'SecondaryToolbar').exists(),
      ).toBe(true);
    });
    it('should render the secondary toolbar if there is a cancel button', () => {
      const { editorView } = editor(doc(p('Hello world')));
      const fullPage = mountWithIntl(
        <Comment
          editorView={editorView}
          onCancel={true as any}
          providerFactory={{} as any}
          editorDOMElement={<div />}
        />,
      );
      fullPage
        .findWhere((elm) => elm.name() === 'ContentArea')
        .childAt(0)
        .simulate('click');
      expect(
        fullPage.findWhere((elm) => elm.name() === 'SecondaryToolbar').exists(),
      ).toBe(true);
    });
    it('should render the secondary toolbar if there is a custom secondary toolbar button', () => {
      const { editorView } = editor(doc(p('Hello world')));
      const fullPage = mountWithIntl(
        <Comment
          editorView={editorView}
          customSecondaryToolbarComponents={true as any}
          providerFactory={{} as any}
          editorDOMElement={<div />}
        />,
      );
      fullPage
        .findWhere((elm) => elm.name() === 'ContentArea')
        .childAt(0)
        .simulate('click');
      expect(
        fullPage.findWhere((elm) => elm.name() === 'SecondaryToolbar').exists(),
      ).toBe(true);
    });
    it('should not render the secondary toolbar if there is no save, cancel or custom button', () => {
      const { editorView } = editor(doc(p('Hello world')));
      const fullPage = mountWithIntl(
        <Comment
          editorView={editorView}
          providerFactory={{} as any}
          editorDOMElement={<div />}
        />,
      );
      fullPage
        .findWhere((elm) => elm.name() === 'ContentArea')
        .childAt(0)
        .simulate('click');
      expect(
        fullPage.findWhere((elm) => elm.name() === 'SecondaryToolbar').exists(),
      ).toBe(false);
    });
  });
});
