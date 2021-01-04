import { Schema } from 'prosemirror-model';
import {
  p,
  ul,
  ol,
  li,
  doc,
  h1,
  RefsNode,
} from '@atlaskit/editor-test-helpers/schema-builder';
import { createEditorState } from '@atlaskit/editor-test-helpers/create-editor-state';
import { ListsPluginState } from '../../../types';
import { pluginKey, createPlugin } from '../../../pm-plugins/main';
import { DecorationSet } from 'prosemirror-view';

type DocumentType = (schema: Schema) => RefsNode;

describe('outdent-list-items-selected', () => {
  const eventDispatch = jest.fn();
  const predictableListsPlugin = createPlugin(eventDispatch);
  const case0: [string, DocumentType, ListsPluginState] = [
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
  const case1: [string, DocumentType, ListsPluginState] = [
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

  const case2: [string, DocumentType, ListsPluginState] = [
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

  const case3: [string, DocumentType, ListsPluginState] = [
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

  it.each<[string, DocumentType, ListsPluginState]>([
    // prettier-ignore
    case0,
    case1,
    case2,
    case3,
  ])('[case%#] %s', (_scenario, previousDocument, expectedState) => {
    const myState = createEditorState(previousDocument, predictableListsPlugin);
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
