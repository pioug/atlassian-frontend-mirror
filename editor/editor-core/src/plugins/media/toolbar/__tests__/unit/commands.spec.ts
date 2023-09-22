// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import type { DocBuilder } from '@atlaskit/editor-common/types';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  media,
  mediaGroup,
  mediaInline,
  mediaSingle,
  doc,
  p,
  border,
} from '@atlaskit/editor-test-helpers/doc-builder';
import type { MediaAttributes } from '@atlaskit/adf-schema';
import type { MediaOptions } from '../../../types';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  temporaryFileId,
  testCollectionName,
} from '@atlaskit/editor-test-helpers/media-provider';
import {
  changeInlineToMediaCard,
  changeMediaCardToInline,
  DEFAULT_BORDER_COLOR,
  DEFAULT_BORDER_SIZE,
  removeInlineCard,
  setBorderMark,
  toggleBorderMark,
  updateMediaSingleWidth,
} from '../../commands';

import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';

const attrs: MediaAttributes = {
  id: temporaryFileId,
  type: 'file',
  collection: testCollectionName,
};
const createMediaInlineDoc = () =>
  doc(p('{<node>}', mediaInline({ ...attrs })()));
const createMediaGroupDoc = () =>
  doc(mediaGroup('{<node>}', media({ ...attrs })()));

const mediaNode = mediaSingle({ layout: 'center' })(media({ ...attrs })());
const mediaNodeWithBorder = mediaSingle({ layout: 'center' })(
  border({ color: DEFAULT_BORDER_COLOR, size: DEFAULT_BORDER_SIZE })(
    media({ ...attrs })(),
  ),
);

const createMediaNodeDoc = () => doc(mediaNode);
const createMediaNodeWithBorderDoc = () => doc(mediaNodeWithBorder);

const attachAnalyticsEvent = jest.fn().mockImplementation(() => () => {});
const mockEditorAnalyticsAPI: EditorAnalyticsAPI = {
  attachAnalyticsEvent,
};

describe('commands', () => {
  const createEditor = createEditorFactory();

  const editor = (doc: DocBuilder, mediaPropsOverride: MediaOptions = {}) => {
    const wrapper = createEditor({
      doc,
      editorProps: {
        allowBorderMark: true,
        media: {
          allowMediaSingle: true,
          ...mediaPropsOverride,
        },
      },
    });
    return wrapper;
  };

  const setup = async (document: DocBuilder) => {
    const { editorView } = editor(document, {
      featureFlags: { mediaInline: true },
      allowLinking: true,
    });

    return {
      editorView,
    };
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('removeInlineCard', () => {
    it('should remove media inline item', async () => {
      const { editorView } = await setup(createMediaInlineDoc());
      removeInlineCard(editorView.state, editorView.dispatch);
      expect(editorView.state).toEqualDocumentAndSelection(doc(p('{<>}')));
    });
  });

  describe('changeInlineToMediaCard', () => {
    it('should change media inline item to media group', async () => {
      const { editorView } = await setup(createMediaInlineDoc());
      changeInlineToMediaCard(mockEditorAnalyticsAPI)(
        editorView.state,
        editorView.dispatch,
      );
      expect(editorView.state).toEqualDocumentAndSelection(
        doc(p('{<>}'), mediaGroup(media(attrs)())),
      );
    });

    it('creates a changed type analytic', async () => {
      const { editorView } = await setup(createMediaInlineDoc());
      changeInlineToMediaCard(mockEditorAnalyticsAPI)(
        editorView.state,
        editorView.dispatch,
      );
      expect(attachAnalyticsEvent).toHaveBeenCalledWith({
        action: 'changedType',
        actionSubject: 'media',
        eventType: 'track',
        attributes: {
          newType: 'mediaGroup',
          previousType: 'mediaInline',
        },
      });
    });
  });

  describe('changeMediaCardToInline', () => {
    it('should change media group item to media inline', async () => {
      const { editorView } = await setup(createMediaGroupDoc());
      changeMediaCardToInline(mockEditorAnalyticsAPI)(
        editorView.state,
        editorView.dispatch,
      );
      expect(editorView.state).toEqualDocumentAndSelection(
        doc(p(mediaInline(attrs)(), ' '), p()),
      );
    });

    it('creates a changed type analytic', async () => {
      const { editorView } = await setup(createMediaGroupDoc());
      changeMediaCardToInline(mockEditorAnalyticsAPI)(
        editorView.state,
        editorView.dispatch,
      );
      expect(attachAnalyticsEvent).toHaveBeenCalledWith({
        action: 'changedType',
        actionSubject: 'media',
        eventType: 'track',
        attributes: {
          newType: 'mediaInline',
          previousType: 'mediaGroup',
        },
      });
    });
  });

  describe('toggleBorderMark', () => {
    it('should add border mark with default color and size', async () => {
      const { editorView } = await setup(createMediaNodeDoc());
      toggleBorderMark(mockEditorAnalyticsAPI)(
        editorView.state,
        editorView.dispatch,
      );
      expect(editorView.state).toEqualDocumentAndSelection(
        doc(mediaNodeWithBorder),
      );
    });

    it('should trigger add border mark analytic event', async () => {
      const { editorView } = await setup(createMediaNodeDoc());
      toggleBorderMark(mockEditorAnalyticsAPI)(
        editorView.state,
        editorView.dispatch,
      );
      expect(attachAnalyticsEvent).toBeCalled();
      expect(attachAnalyticsEvent).toHaveBeenCalledWith({
        action: 'added',
        actionSubject: 'media',
        actionSubjectId: 'border',
        eventType: 'track',
        attributes: {
          color: DEFAULT_BORDER_COLOR,
          size: DEFAULT_BORDER_SIZE,
        },
      });
    });

    it('should remove border mark', async () => {
      const { editorView } = await setup(createMediaNodeWithBorderDoc());
      toggleBorderMark(mockEditorAnalyticsAPI)(
        editorView.state,
        editorView.dispatch,
      );
      expect(editorView.state).toEqualDocumentAndSelection(doc(mediaNode));
    });

    it('should trigger remove border mark analytic event', async () => {
      const { editorView } = await setup(createMediaNodeWithBorderDoc());
      toggleBorderMark(mockEditorAnalyticsAPI)(
        editorView.state,
        editorView.dispatch,
      );
      expect(attachAnalyticsEvent).toBeCalled();
      expect(attachAnalyticsEvent).toHaveBeenCalledWith({
        action: 'deleted',
        actionSubject: 'media',
        actionSubjectId: 'border',
        eventType: 'track',
        attributes: {
          previousColor: DEFAULT_BORDER_COLOR,
          previousSize: DEFAULT_BORDER_SIZE,
        },
      });
    });

    it('should have no effect when there is no media node', async () => {
      const { editorView } = await setup(doc(p('hello<> world')));
      toggleBorderMark(mockEditorAnalyticsAPI)(
        editorView.state,
        editorView.dispatch,
      );
      expect(editorView.state).toEqualDocumentAndSelection(
        doc(p('hello<> world')),
      );
    });

    it('should return false when there is no media node', async () => {
      const { editorView } = await setup(doc(p('hello<> world')));
      const result = toggleBorderMark(mockEditorAnalyticsAPI)(
        editorView.state,
        editorView.dispatch,
      );
      expect(result).toEqual(false);
    });
  });

  describe('setBorderMark', () => {
    it('should set border mark with the selected color', async () => {
      const { editorView } = await setup(createMediaNodeDoc());
      setBorderMark(mockEditorAnalyticsAPI)({ color: '#758195' })(
        editorView.state,
        editorView.dispatch,
      );
      expect(editorView.state).toEqualDocumentAndSelection(
        doc(
          mediaSingle({ layout: 'center' })(
            border({ color: '#758195', size: DEFAULT_BORDER_SIZE })(
              media({ ...attrs })(),
            ),
          ),
        ),
      );
    });

    it('should trigger updated analytics event when updating the border color', async () => {
      const { editorView } = await setup(createMediaNodeDoc());
      setBorderMark(mockEditorAnalyticsAPI)({ color: '#758195' })(
        editorView.state,
        editorView.dispatch,
      );
      expect(attachAnalyticsEvent).toBeCalled();
      expect(attachAnalyticsEvent).toHaveBeenCalledWith({
        action: 'updated',
        actionSubject: 'media',
        actionSubjectId: 'border',
        eventType: 'track',
        attributes: {
          previousColor: undefined,
          previousSize: undefined,
          newColor: '#758195',
          newSize: DEFAULT_BORDER_SIZE,
        },
      });
    });

    it('should set border mark with the selected width', async () => {
      const { editorView } = await setup(createMediaNodeDoc());
      setBorderMark(mockEditorAnalyticsAPI)({ size: 1 })(
        editorView.state,
        editorView.dispatch,
      );
      expect(editorView.state).toEqualDocumentAndSelection(
        doc(
          mediaSingle({ layout: 'center' })(
            border({ color: DEFAULT_BORDER_COLOR, size: 1 })(
              media({ ...attrs })(),
            ),
          ),
        ),
      );
    });

    it('should trigger updated analytics event when updating the border width', async () => {
      const { editorView } = await setup(createMediaNodeDoc());
      setBorderMark(mockEditorAnalyticsAPI)({ size: 1 })(
        editorView.state,
        editorView.dispatch,
      );
      expect(attachAnalyticsEvent).toBeCalled();
      expect(attachAnalyticsEvent).toHaveBeenCalledWith({
        action: 'updated',
        actionSubject: 'media',
        actionSubjectId: 'border',
        eventType: 'track',
        attributes: {
          previousColor: undefined,
          previousSize: undefined,
          newColor: DEFAULT_BORDER_COLOR,
          newSize: 1,
        },
      });
    });

    it('should set border mark with the selected width and selected color', async () => {
      const { editorView } = await setup(createMediaNodeDoc());
      setBorderMark(mockEditorAnalyticsAPI)({ color: '#758195', size: 1 })(
        editorView.state,
        editorView.dispatch,
      );
      expect(editorView.state).toEqualDocumentAndSelection(
        doc(
          mediaSingle({ layout: 'center' })(
            border({ color: '#758195', size: 1 })(media({ ...attrs })()),
          ),
        ),
      );
    });

    it('should trigger updated analytics event when updating the border width and color', async () => {
      const { editorView } = await setup(createMediaNodeDoc());
      setBorderMark(mockEditorAnalyticsAPI)({ color: '#758195', size: 1 })(
        editorView.state,
        editorView.dispatch,
      );
      expect(attachAnalyticsEvent).toHaveBeenCalledWith({
        action: 'updated',
        actionSubject: 'media',
        actionSubjectId: 'border',
        eventType: 'track',
        attributes: {
          previousColor: undefined,
          previousSize: undefined,
          newColor: '#758195',
          newSize: 1,
        },
      });
    });

    it('should have no effect when there is no media node', async () => {
      const { editorView } = await setup(doc(p('hello<> world')));
      setBorderMark(mockEditorAnalyticsAPI)({ color: '#758195', size: 1 })(
        editorView.state,
        editorView.dispatch,
      );
      expect(editorView.state).toEqualDocumentAndSelection(
        doc(p('hello<> world')),
      );
    });

    it('should return false when there is no media node', async () => {
      const { editorView } = await setup(doc(p('hello<> world')));
      const result = setBorderMark(mockEditorAnalyticsAPI)({
        color: '#758195',
        size: 1,
      })(editorView.state, editorView.dispatch);
      expect(result).toEqual(false);
    });
  });

  describe('updateMediaSingleWidth', () => {
    const mediaSingleNode = mediaSingle({
      layout: 'center',
      widthType: 'pixel',
      width: 600,
    })(media({ ...attrs })());

    it('should update media single node with the given width', async () => {
      const { editorView } = await setup(mediaSingleNode);

      const { state, dispatch } = editorView;

      updateMediaSingleWidth(mockEditorAnalyticsAPI)(800, 'valid', 'center')(
        state,
        dispatch,
      );

      expect(editorView.state).toEqualDocumentAndSelection(
        doc(
          mediaSingle({ layout: 'center', widthType: 'pixel', width: 800 })(
            media({ ...attrs })(),
          ),
        ),
      );
    });

    it('should trigger analytics event when updating media single width', async () => {
      const { editorView } = await setup(mediaSingleNode);

      const { state, dispatch } = editorView;

      updateMediaSingleWidth(mockEditorAnalyticsAPI)(1000, 'valid', 'center')(
        state,
        dispatch,
      );

      expect(attachAnalyticsEvent).toBeCalled();
      expect(attachAnalyticsEvent).toHaveBeenCalledWith({
        action: 'edited',
        actionSubject: 'mediaSingle',
        actionSubjectId: 'resized',
        eventType: 'ui',
        attributes: {
          width: 1000,
          layout: 'center',
          validation: 'valid',
          parentNode: 'doc',
        },
      });
    });
  });
});
