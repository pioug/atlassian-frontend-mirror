// eslint-disable-next-line import/no-extraneous-dependencies
import type {
  CreateUIAnalyticsEvent,
  UIAnalyticsEvent,
} from '@atlaskit/analytics-next';
import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { selectNode } from '@atlaskit/editor-common/selection';
import type {
  DocBuilder,
  FeatureFlags,
  NextEditorPlugin,
  PublicPluginAPI,
} from '@atlaskit/editor-common/types';
import { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import { decorationsPlugin } from '@atlaskit/editor-plugin-decorations';
import {
  NodeSelection,
  TextSelection,
} from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
// eslint-disable-next-line import/no-extraneous-dependencies
import type { LightEditorPlugin } from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  createProsemirrorEditorFactory,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  doc,
  layoutColumn,
  layoutSection,
  p,
} from '@atlaskit/editor-test-helpers/doc-builder';

import {
  deleteActiveLayoutNode,
  getPresetLayout,
  insertLayoutColumnsWithAnalytics,
  setPresetLayout,
} from '../../actions';
import { layoutPlugin } from '../../index';
import type { PresetLayout } from '../../types';

import { buildLayoutForWidths, layouts } from './_utils';

// So we don't introduce another plugin dependency to this package
const mockFeatureFlagsPlugin: NextEditorPlugin<
  'featureFlags',
  {
    pluginConfiguration: FeatureFlags;
    sharedState: FeatureFlags;
  }
> = ({ config }) => ({
  name: 'featureFlags',
  getSharedState() {
    return config;
  },
});

describe('layout actions', () => {
  const createEditor = createProsemirrorEditorFactory();

  let createAnalyticsEvent: CreateUIAnalyticsEvent;
  let editorView: EditorView;
  let editorAPI: PublicPluginAPI<[AnalyticsPlugin]>;
  const editor = (doc: DocBuilder) => {
    createAnalyticsEvent = jest.fn(() => ({ fire() {} } as UIAnalyticsEvent));
    const preset = new Preset<LightEditorPlugin>()
      .add([mockFeatureFlagsPlugin, {}])
      .add(decorationsPlugin)
      .add(layoutPlugin)
      .add([analyticsPlugin, { createAnalyticsEvent }]);

    return createEditor({
      doc,
      preset,
    });
  };

  beforeEach(() => {
    ({ editorView, editorAPI } = editor(doc(p(''))));
  });

  describe('#getPresetLayout', () => {
    const getLayoutForWidths = (widths: number[]): PresetLayout | undefined => {
      const section = buildLayoutForWidths(widths);
      return getPresetLayout(section(editorView.state.schema));
    };

    describe('detecting exact layout', () => {
      layouts.forEach(layout => {
        it(`should detect "${layout.name}" layout`, () => {
          expect(getLayoutForWidths(layout.widths)).toBe(layout.name);
        });
      });
    });
  });

  describe('#setPresetLayout(undefined)', () => {
    layouts.forEach(currentLayout => {
      layouts.forEach(newLayout => {
        if (currentLayout.name !== newLayout.name) {
          it(`handles switching from "${currentLayout.name}" to "${newLayout.name}"`, () => {
            ({ editorView } = editor(
              doc(buildLayoutForWidths(currentLayout.widths, true)),
            ));
            setPresetLayout(undefined)(newLayout.name)(
              editorView.state,
              editorView.dispatch,
            );
            expect(editorView.state.doc).toEqualDocument(
              doc(buildLayoutForWidths(newLayout.widths)),
            );
          });
        }
      });
    });

    it('should do nothing if selection not in layout', () => {
      expect(
        setPresetLayout(undefined)('three_equal')(
          editorView.state,
          editorView.dispatch,
        ),
      ).toBe(false);
    });

    it('keeps TextSelection if previously had TextSelection', () => {
      ({ editorView } = editor(doc(buildLayoutForWidths([50, 50], true))));
      setPresetLayout(undefined)('three_equal')(
        editorView.state,
        editorView.dispatch,
      );

      expect(editorView.state.selection).toBeInstanceOf(TextSelection);
    });

    it('keeps NodeSelection if previously had NodeSelection', () => {
      ({ editorView } = editor(doc(buildLayoutForWidths([50, 50]))));
      editorView.dispatch(
        editorView.state.tr.setSelection(
          NodeSelection.create(editorView.state.doc, 1),
        ),
      );
      setPresetLayout(undefined)('three_equal')(
        editorView.state,
        editorView.dispatch,
      );
      expect(editorView.state.selection).toBeInstanceOf(NodeSelection);
    });
  });

  describe('#deleteActiveLayout', () => {
    it('should delete active layoutSection', () => {
      ({ editorView } = editor(
        doc(
          layoutSection(
            layoutColumn({ width: 50 })(p('{<>}')),
            layoutColumn({ width: 50 })(p('')),
          ),
        ),
      ));
      deleteActiveLayoutNode(undefined)(editorView.state, editorView.dispatch);
      expect(editorView.state.doc).toEqualDocument(doc(p('')));
    });

    it('should do nothing if selection not in layout', () => {
      expect(
        setPresetLayout(undefined)('three_equal')(
          editorView.state,
          editorView.dispatch,
        ),
      ).toBe(false);
    });
  });

  describe('#insertLayoutColumnsWithAnalytics', () => {
    beforeEach(() => {
      insertLayoutColumnsWithAnalytics(editorAPI?.analytics?.actions)(
        INPUT_METHOD.INSERT_MENU,
      )(editorView.state, editorView.dispatch);
    });

    it('inserts default layout (2 cols equal width)', () => {
      expect(editorView.state.doc).toEqualDocument(
        doc(
          layoutSection(
            layoutColumn({ width: 50 })(p()),
            layoutColumn({ width: 50 })(p()),
          ),
        ),
      );
    });

    it('fires analytics event', () => {
      expect(createAnalyticsEvent).toBeCalledWith({
        action: 'inserted',
        actionSubject: 'document',
        actionSubjectId: 'layout',
        eventType: 'track',
        attributes: expect.objectContaining({ inputMethod: 'insertMenu' }),
      });
    });
  });

  describe('#selectLayout', () => {
    it('should select node', () => {
      const { editorView, refs } = editor(
        doc(
          '{nodeStart}',
          layoutSection(
            layoutColumn({ width: 50 })(p('text{<>}')),
            layoutColumn({ width: 50 })(p('')),
          ),
        ),
      );
      selectNode(refs['nodeStart'])(editorView.state, editorView.dispatch);
      const expectedDoc = doc(
        '{<node>}',
        layoutSection(
          layoutColumn({ width: 50 })(p('text')),
          layoutColumn({ width: 50 })(p('')),
        ),
      );
      expect(editorView.state).toEqualDocumentAndSelection(expectedDoc);
    });
  });
});
