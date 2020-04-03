import createEditorFactory from '@atlaskit/editor-test-helpers/create-editor';
import {
  layoutSection,
  layoutColumn,
  doc,
  p,
} from '@atlaskit/editor-test-helpers/schema-builder';
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
import { INPUT_METHOD } from '../../../analytics';
import { PresetLayout } from '../../types';

describe('layout actions', () => {
  const createEditor = createEditorFactory();
  let createAnalyticsEvent: CreateUIAnalyticsEvent;
  let editorView: EditorView;
  const editor = (doc: any) => {
    createAnalyticsEvent = jest.fn(() => ({ fire() {} } as UIAnalyticsEvent));
    return createEditor({
      doc,
      editorProps: { allowLayouts: true, allowAnalyticsGASV3: true },
      createAnalyticsEvent,
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
      layouts.forEach(layout => {
        it(`should detect "${layout.name}" layout`, () => {
          expect(getLayoutForWidths(layout.widths)).toBe(layout.name);
        });
      });
    });
  });

  describe('#setPresetLayout', () => {
    layouts.forEach(currentLayout => {
      layouts.forEach(newLayout => {
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
});
