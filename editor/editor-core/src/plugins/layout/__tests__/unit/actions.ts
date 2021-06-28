import {
  createProsemirrorEditorFactory,
  Preset,
  LightEditorPlugin,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import {
  layoutSection,
  layoutColumn,
  doc,
  p,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import {
  CreateUIAnalyticsEvent,
  UIAnalyticsEvent,
} from '@atlaskit/analytics-next';
import { EditorView } from 'prosemirror-view';
import {
  deleteActiveLayoutNode,
  setPresetLayout,
  getPresetLayout,
  insertLayoutColumnsWithAnalytics,
} from '../../actions';
import { layouts, buildLayoutForWidths } from './_utils';
import analyticsPlugin, { INPUT_METHOD } from '../../../analytics';
import { PresetLayout } from '../../types';
import layoutPlugin from '../..';
import { TextSelection, NodeSelection } from 'prosemirror-state';
import { selectNode } from '../../../../utils/commands';

describe('layout actions', () => {
  const createEditor = createProsemirrorEditorFactory();

  let createAnalyticsEvent: CreateUIAnalyticsEvent;
  let editorView: EditorView;
  const editor = (doc: DocBuilder) => {
    createAnalyticsEvent = jest.fn(() => ({ fire() {} } as UIAnalyticsEvent));
    const preset = new Preset<LightEditorPlugin>()
      .add(layoutPlugin)
      .add([analyticsPlugin, { createAnalyticsEvent }]);

    return createEditor({
      doc,
      preset,
    });
  };

  beforeEach(() => {
    ({ editorView } = editor(doc(p(''))));
  });

  describe('#getPresetLayout', () => {
    const getLayoutForWidths = (widths: number[]): PresetLayout | undefined => {
      const section = buildLayoutForWidths(widths);
      return getPresetLayout(section(editorView.state.schema));
    };

    describe('detecting exact layout', () => {
      layouts.forEach((layout) => {
        it(`should detect "${layout.name}" layout`, () => {
          expect(getLayoutForWidths(layout.widths)).toBe(layout.name);
        });
      });
    });
  });

  describe('#setPresetLayout', () => {
    layouts.forEach((currentLayout) => {
      layouts.forEach((newLayout) => {
        if (currentLayout.name !== newLayout.name) {
          it(`handles switching from "${currentLayout.name}" to "${newLayout.name}"`, () => {
            ({ editorView } = editor(
              doc(buildLayoutForWidths(currentLayout.widths, true)),
            ));
            setPresetLayout(newLayout.name)(
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
        setPresetLayout('three_equal')(editorView.state, editorView.dispatch),
      ).toBe(false);
    });

    it('keeps TextSelection if previously had TextSelection', () => {
      ({ editorView } = editor(doc(buildLayoutForWidths([50, 50], true))));
      setPresetLayout('three_equal')(editorView.state, editorView.dispatch);

      expect(editorView.state.selection).toBeInstanceOf(TextSelection);
    });

    it('keeps NodeSelection if previously had NodeSelection', () => {
      ({ editorView } = editor(doc(buildLayoutForWidths([50, 50]))));
      editorView.dispatch(
        editorView.state.tr.setSelection(
          NodeSelection.create(editorView.state.doc, 1),
        ),
      );
      setPresetLayout('three_equal')(editorView.state, editorView.dispatch);
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
      deleteActiveLayoutNode(editorView.state, editorView.dispatch);
      expect(editorView.state.doc).toEqualDocument(doc(p('')));
    });

    it('should do nothing if selection not in layout', () => {
      expect(
        setPresetLayout('three_equal')(editorView.state, editorView.dispatch),
      ).toBe(false);
    });
  });

  describe('#insertLayoutColumnsWithAnalytics', () => {
    beforeEach(() => {
      insertLayoutColumnsWithAnalytics(INPUT_METHOD.INSERT_MENU)(
        editorView.state,
        editorView.dispatch,
      );
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
