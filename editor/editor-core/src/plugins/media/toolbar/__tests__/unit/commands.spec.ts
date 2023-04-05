import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import {
  media,
  mediaGroup,
  DocBuilder,
  mediaInline,
  mediaSingle,
  doc,
  p,
  border,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { MediaAttributes } from '@atlaskit/adf-schema';
import { MediaOptions } from '../../../../../plugins/media/types';
import {
  temporaryFileId,
  testCollectionName,
} from '../../../../../__tests__/unit/plugins/media/_utils';
import {
  changeInlineToMediaCard,
  changeMediaCardToInline,
  DEFAULT_BORDER_COLOR,
  DEFAULT_BORDER_SIZE,
  removeInlineCard,
  setBorderMark,
  toggleBorderMark,
} from '../../commands';
import * as analyticsUtils from '../../../../analytics/utils';

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

describe('commands', () => {
  const createEditor = createEditorFactory();

  const editor = (doc: DocBuilder, mediaPropsOverride: MediaOptions = {}) => {
    const wrapper = createEditor({
      doc,
      editorProps: {
        UNSAFE_allowBorderMark: true,
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
      changeInlineToMediaCard(editorView.state, editorView.dispatch);
      expect(editorView.state).toEqualDocumentAndSelection(
        doc(p('{<>}'), mediaGroup(media(attrs)())),
      );
    });

    it('creates a changed type analytic', async () => {
      const addAnalyticsSpy = jest.spyOn(analyticsUtils, 'addAnalytics');
      const { editorView } = await setup(createMediaInlineDoc());
      changeInlineToMediaCard(editorView.state, editorView.dispatch);
      expect(addAnalyticsSpy).toBeCalled();
      expect(addAnalyticsSpy.mock.calls[0][2]).toMatchObject({
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
      changeMediaCardToInline(editorView.state, editorView.dispatch);
      expect(editorView.state).toEqualDocumentAndSelection(
        doc(p(mediaInline(attrs)(), ' '), p()),
      );
    });

    it('creates a changed type analytic', async () => {
      const addAnalyticsSpy = jest.spyOn(analyticsUtils, 'addAnalytics');
      const { editorView } = await setup(createMediaGroupDoc());
      changeMediaCardToInline(editorView.state, editorView.dispatch);
      expect(addAnalyticsSpy).toBeCalled();
      expect(addAnalyticsSpy.mock.calls[0][2]).toMatchObject({
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
    it('should add border mark', async () => {
      const addAnalyticsSpy = jest.spyOn(analyticsUtils, 'addAnalytics');
      const { editorView } = await setup(createMediaNodeDoc());
      toggleBorderMark(editorView.state, editorView.dispatch);
      expect(editorView.state).toEqualDocumentAndSelection(
        doc(mediaNodeWithBorder),
      );
      expect(addAnalyticsSpy).toBeCalled();
      expect(addAnalyticsSpy.mock.calls[0][2]).toMatchObject({
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
      const addAnalyticsSpy = jest.spyOn(analyticsUtils, 'addAnalytics');
      const { editorView } = await setup(createMediaNodeWithBorderDoc());
      toggleBorderMark(editorView.state, editorView.dispatch);
      expect(editorView.state).toEqualDocumentAndSelection(doc(mediaNode));
      expect(addAnalyticsSpy).toBeCalled();
      expect(addAnalyticsSpy.mock.calls[0][2]).toMatchObject({
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
  });

  describe('setBorderMark', () => {
    it('should set border mark with selected color and default width', async () => {
      const addAnalyticsSpy = jest.spyOn(analyticsUtils, 'addAnalytics');
      const { editorView } = await setup(createMediaNodeDoc());
      setBorderMark({ color: '#758195' })(
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
      expect(addAnalyticsSpy).toBeCalled();
      expect(addAnalyticsSpy.mock.calls[0][2]).toMatchObject({
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

    it('should set border mark with selected width and default color', async () => {
      const addAnalyticsSpy = jest.spyOn(analyticsUtils, 'addAnalytics');
      const { editorView } = await setup(createMediaNodeDoc());
      setBorderMark({ size: 1 })(editorView.state, editorView.dispatch);
      expect(editorView.state).toEqualDocumentAndSelection(
        doc(
          mediaSingle({ layout: 'center' })(
            border({ color: DEFAULT_BORDER_COLOR, size: 1 })(
              media({ ...attrs })(),
            ),
          ),
        ),
      );

      expect(addAnalyticsSpy).toBeCalled();
      expect(addAnalyticsSpy.mock.calls[0][2]).toMatchObject({
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

    it('should set border mark with selected width and selected color', async () => {
      const addAnalyticsSpy = jest.spyOn(analyticsUtils, 'addAnalytics');
      const { editorView } = await setup(createMediaNodeDoc());
      setBorderMark({ color: '#758195', size: 1 })(
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

      expect(addAnalyticsSpy).toBeCalled();
      expect(addAnalyticsSpy.mock.calls[0][2]).toMatchObject({
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
  });
});
