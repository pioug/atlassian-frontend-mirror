import type { IntlShape } from 'react-intl-next';
import { createIntl } from 'react-intl-next';

import type { Command, DropdownOptionT } from '@atlaskit/editor-common/types';
import type { LastContentPasted } from '@atlaskit/editor-plugin-paste';
import { Slice } from '@atlaskit/editor-prosemirror/model';
import { DecorationSet } from '@atlaskit/editor-prosemirror/view';
// eslint-disable-next-line import/no-extraneous-dependencies
import { createEditorState } from '@atlaskit/editor-test-helpers/create-editor-state';
// eslint-disable-next-line import/no-extraneous-dependencies
import { doc, p } from '@atlaskit/editor-test-helpers/doc-builder';
// eslint-disable-next-line import/no-extraneous-dependencies
import { ffTest } from '@atlassian/feature-flags-test-utils';

import { PASTE_TOOLBAR_ITEM_CLASS } from '../../pm-plugins/constants';
import { getToolbarMenuConfig, isToolbarVisible } from '../../toolbar';
import { ToolbarDropdownOption } from '../../types';

describe('Toolbar config', () => {
  let intl: IntlShape;
  intl = createIntl({
    locale: 'en',
  });

  const plainTextContent = 'plain text';
  let pasteOptionsPluginState = {
    showToolbar: true,
    pasteStartPos: 0,
    pasteEndPos: 15,
    richTextSlice: Slice.empty,
    plaintext: 'Type something',
    isPlainText: true,
    highlightContent: true,
    highlightDecorationSet: DecorationSet.empty,
    selectedOption: ToolbarDropdownOption.PlainText,
  };

  describe('getToolbarMenuConfig', () => {
    it('should return toolbar menu with rich text option hidden', () => {
      // When plain text is pasted, the paste options should have "use Rich text" option hidden.
      const menu = getToolbarMenuConfig(
        pasteOptionsPluginState,
        1,
        plainTextContent,
        intl,
        undefined,
      );
      const items = menu.options as Array<DropdownOptionT<Command>>;
      const hidden = items.find(option => option.hidden);

      expect(menu.id).toBe(PASTE_TOOLBAR_ITEM_CLASS);
      expect(hidden?.id).toBe('editor.paste.richText');
    });
  });

  describe('isToolbarVisible', () => {
    const pasteContent = doc(p('{<}Test{>}'));
    ffTest(
      'platform.editor.paste-options-toolbar',
      () => {
        // Run test case when FF platform.editor.paste-options-toolbar is true
        const state = createEditorState(doc(p('{<>}')));
        const pastedSlice = new Slice(pasteContent(state.schema).content, 0, 0);

        const toolbar = isToolbarVisible(state, {
          pastedSlice,
          isPlainText: true,
          text: 'pasteSlice',
          isShiftPressed: false,
          pasteStartPos: 0,
          pasteEndPos: 2,
          pastedAt: Date.now(),
          pasteSource: 'uncategorized',
        } as LastContentPasted);
        expect(toolbar).toBe(true);
      },
      () => {
        // Run test case when FF platform.editor.paste-options-toolbar is false
        const state = createEditorState(doc(p('{<>}')));
        const pastedSlice = new Slice(pasteContent(state.schema).content, 0, 0);
        const toolbar = isToolbarVisible(state, {
          pastedSlice,
          isPlainText: true,
          text: 'pasteSlice',
          isShiftPressed: false,
          pasteStartPos: 0,
          pasteEndPos: 2,
          pastedAt: Date.now(),
          pasteSource: 'uncategorized',
        } as LastContentPasted);
        expect(toolbar).toBe(false);
      },
    );
  });
});
