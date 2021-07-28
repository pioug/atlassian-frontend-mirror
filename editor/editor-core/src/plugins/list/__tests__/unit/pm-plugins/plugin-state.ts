import {
  p,
  ul,
  ol,
  li,
  doc,
  h1,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { createEditorState } from '@atlaskit/editor-test-helpers/create-editor-state';
import { ListState } from '../../../types';
import { pluginKey, createPlugin } from '../../../pm-plugins/main';
import { DecorationSet } from 'prosemirror-view';

describe('outdent-list-items-selected', () => {
  const eventDispatch = jest.fn();
  const listsPlugin = createPlugin(eventDispatch);
  const case0: [string, DocBuilder, ListState] = [
    'should enable the orderedList options when ordered list is selected',
    // Scenario
    // prettier-ignore
    doc(
      ol(
        li(p('A')),
        li(p('B{<>}')),
        li(p('C')),
      ),
    ),
    {
      bulletListActive: false,
      bulletListDisabled: false,
      orderedListActive: true,
      orderedListDisabled: false,
      decorationSet: DecorationSet.empty,
    },
  ];
  const case1: [string, DocBuilder, ListState] = [
    'should enable the bulletList options when bullet list is selected',
    // Scenario
    // prettier-ignore
    doc(
      ul(
        li(p('A')),
        li(p('B{<>}')),
        li(p('C')),
      ),
    ),
    {
      bulletListActive: true,
      bulletListDisabled: false,
      orderedListActive: false,
      orderedListDisabled: false,
      decorationSet: DecorationSet.empty,
    },
  ];

  const case2: [string, DocBuilder, ListState] = [
    'should set any list active option as false when there is no list selected',
    // Scenario
    // prettier-ignore
    doc(
      ol(
        li(p('A')),
        li(p('B')),
        li(p('C')),
      ),
      p('LO{<>}L'),
    ),
    {
      bulletListActive: false,
      bulletListDisabled: false,
      orderedListActive: false,
      orderedListDisabled: false,
      decorationSet: DecorationSet.empty,
    },
  ];

  const case3: [string, DocBuilder, ListState] = [
    'should disable any list options when is not allowed to add a list in that position',
    // Scenario
    // prettier-ignore
    doc(
      ol(
        li(p('A')),
        li(p('B')),
        li(p('C')),
      ),
      h1('te{<>}xt'),
    ),
    {
      bulletListActive: false,
      bulletListDisabled: true,
      orderedListActive: false,
      orderedListDisabled: true,
      decorationSet: DecorationSet.empty,
    },
  ];

  it.each<[string, DocBuilder, ListState]>([
    // prettier-ignore
    case0,
    case1,
    case2,
    case3,
  ])('[case%#] %s', (_scenario, previousDocument, expectedState) => {
    const myState = createEditorState(previousDocument, listsPlugin);
    const newPluginState = pluginKey.getState(myState);

    expect(newPluginState).toEqual(
      expect.objectContaining({
        bulletListActive: expectedState.bulletListActive,
        bulletListDisabled: expectedState.bulletListDisabled,
        orderedListActive: expectedState.orderedListActive,
        orderedListDisabled: expectedState.orderedListDisabled,
        decorationSet: expect.any(DecorationSet),
      }),
    );
  });
});
