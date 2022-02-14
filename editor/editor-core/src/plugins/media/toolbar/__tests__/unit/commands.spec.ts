import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import {
  media,
  mediaGroup,
  DocBuilder,
  mediaInline,
  doc,
  p,
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
  removeInlineCard,
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

describe('commands', () => {
  const createEditor = createEditorFactory();

  const editor = (doc: DocBuilder, mediaPropsOverride: MediaOptions = {}) => {
    const wrapper = createEditor({
      doc,
      editorProps: {
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
});
