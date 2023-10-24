import type { LightEditorPlugin } from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  Preset,
  createProsemirrorEditorFactory,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { doc, p, expand } from '@atlaskit/editor-test-helpers/doc-builder';
import type { DocBuilder } from '@atlaskit/editor-common/types';
import { toggleExpandExpanded } from '../../commands';
import expandPlugin from '../../index';
import { featureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';
import { decorationsPlugin } from '@atlaskit/editor-plugin-decorations';
import { selectionPlugin } from '@atlaskit/editor-plugin-selection';
import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';

describe('Expand Commands', () => {
  const createEditor = createProsemirrorEditorFactory();

  const editor = (doc: DocBuilder) => {
    return createEditor({
      doc,
      preset: new Preset<LightEditorPlugin>()
        .add([featureFlagsPlugin, {}])
        .add(decorationsPlugin)
        .add(selectionPlugin)
        .add(expandPlugin),
    });
  };

  describe('toggleExpandExpanded()', () => {
    const mockAttach = jest.fn(() => () => {});
    const mockAnalytics = {
      attachAnalyticsEvent: mockAttach,
    } as unknown as EditorAnalyticsAPI;

    it('should move to right gap cursor if selection is inside the expand when collapsing', () => {
      const { editorView, refs } = editor(
        doc('{expandPos}', expand()(p('{<>}'))),
      );
      const { state, dispatch } = editorView;

      toggleExpandExpanded(mockAnalytics)(
        refs.expandPos,
        state.schema.nodes.expand,
      )(state, dispatch);

      expect(editorView.state).toEqualDocumentAndSelection(
        doc(expand({ __expanded: false })(p('')), '{<|gap>}'),
      );
      expect(mockAttach).toBeCalledWith({
        action: 'toggleExpand',
        actionSubject: 'expand',
        attributes: {
          expanded: false,
          mode: 'editor',
          platform: 'web',
        },
        eventType: 'track',
      });
    });

    it('should leave selection along if outside the expand when collapsing', () => {
      const { editorView, refs } = editor(
        doc(p('Hello!{<>}'), '{expandPos}', expand()(p())),
      );
      const { state, dispatch } = editorView;

      toggleExpandExpanded(mockAnalytics)(
        refs.expandPos,
        state.schema.nodes.expand,
      )(state, dispatch);

      expect(editorView.state).toEqualDocumentAndSelection(
        doc(p('Hello!{<>}'), expand({ __expanded: false })(p())),
      );
      expect(mockAttach).toBeCalledWith({
        action: 'toggleExpand',
        actionSubject: 'expand',
        attributes: {
          expanded: false,
          mode: 'editor',
          platform: 'web',
        },
        eventType: 'track',
      });
    });
  });
});
