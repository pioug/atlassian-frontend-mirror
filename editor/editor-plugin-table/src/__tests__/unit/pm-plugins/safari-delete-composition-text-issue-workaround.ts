import type { DocBuilder } from '@atlaskit/editor-common/types';
import selectionPlugin from '@atlaskit/editor-core/src/plugins/selection';
import { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import { contentInsertionPlugin } from '@atlaskit/editor-plugin-content-insertion';
import { featureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';
import { guidelinePlugin } from '@atlaskit/editor-plugin-guideline';
import { widthPlugin } from '@atlaskit/editor-plugin-width';
import type { LightEditorPlugin } from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import {
  createProsemirrorEditorFactory,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import {
  doc,
  p,
  table,
  td,
  tr,
} from '@atlaskit/editor-test-helpers/doc-builder';

import tablePlugin from '../../../plugins/table-plugin';
import { pluginKey } from '../../../plugins/table/pm-plugins/plugin-key';

describe('table/safari-delete-composition-text-issue-workaround', () => {
  let editor: any;
  beforeEach(() => {
    const createEditor = createProsemirrorEditorFactory();
    editor = (doc: DocBuilder) =>
      createEditor({
        doc,
        preset: new Preset<LightEditorPlugin>()
          .add([featureFlagsPlugin, {}])
          .add([analyticsPlugin, {}])
          .add(contentInsertionPlugin)
          .add(widthPlugin)
          .add(guidelinePlugin)
          .add(selectionPlugin)
          .add([tablePlugin, { tableOptions: { allowColumnResizing: true } }]),
        pluginKey,
      });
  });

  beforeAll(() => {
    const container = document.createTextNode('');
    //@ts-ignore
    jest.spyOn(window, 'getSelection').mockImplementation(() => ({
      type: 'Range',
      rangeCount: 1,
      getRangeAt: () => ({
        startContainer: container,
        endContainer: container,
        endOffset: 0,
        startOffset: 0,
      }),
    }));
  });

  afterAll(() => {
    (window.getSelection as jest.Mock).mockRestore();
  });

  it('should render empty span on beforeinput then remove it on input on safari', async () => {
    const { editorView: view } = editor(
      doc(table()(tr(td()(p('{<>}')), td()(p()), td()(p())))),
    );

    const beforeinputEvent = new InputEvent('beforeinput', {
      data: 'あああ',
      isComposing: true,
      inputType: 'deleteCompositionText',
    });

    view.dom.dispatchEvent(beforeinputEvent);

    const spanElement = view.dom.querySelector(
      'table tr td:nth-of-type(1) span',
    );

    expect(spanElement).toBeTruthy();
    expect(spanElement.tagName).toBe('SPAN');
    expect(spanElement.textContent).toBeFalsy();

    const inputEvent = new InputEvent('input', {
      data: 'あああ',
      isComposing: true,
      inputType: 'deleteCompositionText',
    });

    view.dom.dispatchEvent(inputEvent);

    const emptyElement = view.dom.querySelector(
      'table tr td:nth-of-type(1) span',
    );

    expect(emptyElement).toBeNull();
  });
});
