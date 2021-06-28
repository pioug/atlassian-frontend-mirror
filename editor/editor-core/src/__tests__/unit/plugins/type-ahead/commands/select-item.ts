import { Fragment } from 'prosemirror-model';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import {
  doc,
  p,
  blockquote,
  typeAheadQuery,
  date,
  bodiedExtension,
  extension,
} from '@atlaskit/editor-test-helpers/doc-builder';
import {
  selectCurrentItem,
  selectSingleItemOrDismiss,
  selectByIndex,
  selectItem,
} from '../../../../../plugins/type-ahead/commands/select-item';
import { datePlugin } from '../../../../../plugins';
import { TypeAheadSelectItem } from '../../../../../plugins/type-ahead/types';

jest.mock('@atlaskit/adf-schema', () => ({
  ...jest.requireActual<Object>('@atlaskit/adf-schema'),
  uuid: {
    generate: () => 'testId',
  },
}));

const createTypeAheadPlugin = ({
  getItems,
  selectItem,
}: {
  getItems?: Function;
  selectItem?: TypeAheadSelectItem;
} = {}) => {
  return {
    pluginsOptions: {
      typeAhead: {
        trigger: '/',
        getItems:
          getItems !== undefined
            ? getItems
            : () => [{ title: '1' }, { title: '2' }, { title: '3' }],
        selectItem:
          selectItem !== undefined
            ? selectItem
            : (((state, item, insert) =>
                insert(
                  state.schema.text(`${item.title} selected`),
                )) as TypeAheadSelectItem),
      },
    },
  };
};

describe('typeahead plugin -> commands -> select-item', () => {
  const createEditor = createEditorFactory();

  describe('selectCurrentItem', () => {
    it("should call handler's selectItem method", () => {
      const fn = jest.fn((state) => state.tr);
      const plugin = createTypeAheadPlugin({ selectItem: fn });
      const { editorView } = createEditor({
        doc: doc(p(typeAheadQuery({ trigger: '/' })('/query{<>}'))),
        editorPlugins: [plugin],
      });
      selectCurrentItem()(editorView.state, editorView.dispatch);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should update document when item is selected', () => {
      const plugin = createTypeAheadPlugin();
      const { editorView } = createEditor({
        doc: doc(p(typeAheadQuery({ trigger: '/' })('/query{<>}'))),
        editorPlugins: [plugin],
      });
      selectCurrentItem()(editorView.state, editorView.dispatch);
      expect(editorView.state.doc).toEqualDocument(doc(p('1 selected')));
    });

    it("should have a fallback behaviour in cases where selectItem doesn't exist on a handler", () => {
      const plugin = createTypeAheadPlugin({ selectItem: null } as any);
      const { editorView } = createEditor({
        doc: doc(p(typeAheadQuery({ trigger: '/' })('/query{<>}'))),
        editorPlugins: [plugin],
      });
      selectCurrentItem()(editorView.state, editorView.dispatch);
      expect(editorView.state.doc).toEqualDocument(doc(p('/query')));
    });

    it('should have a fallback behaviour in cases where selectItem returns false', () => {
      const plugin = createTypeAheadPlugin({ selectItem: () => false });
      const { editorView } = createEditor({
        doc: doc(p(typeAheadQuery({ trigger: '/' })('/query{<>}'))),
        editorPlugins: [plugin],
      });
      selectCurrentItem()(editorView.state, editorView.dispatch);
      expect(editorView.state.doc).toEqualDocument(doc(p('/query')));
    });
  });

  describe('selectSingleItemOrDismiss', () => {
    it('should select the only item', () => {
      const plugin = createTypeAheadPlugin({
        getItems: () => [{ title: 'only' }],
      });
      const { editorView } = createEditor({
        doc: doc(p(typeAheadQuery({ trigger: '/' })('/query{<>}'))),
        editorPlugins: [plugin],
      });
      selectSingleItemOrDismiss()(editorView.state, editorView.dispatch);
      expect(editorView.state.doc).toEqualDocument(doc(p('only selected')));
    });

    it('should dismiss typeAheadQuery if there is no items to select from', () => {
      const plugin = createTypeAheadPlugin({
        getItems: () => [],
      });
      const { editorView } = createEditor({
        doc: doc(p(typeAheadQuery({ trigger: '/' })('/query{<>}'))),
        editorPlugins: [plugin],
      });
      selectSingleItemOrDismiss()(editorView.state, editorView.dispatch);
      expect(editorView.state.doc).toEqualDocument(doc(p('/query')));
    });
  });

  describe('selectItemByIndex', () => {
    it('should select item by index', () => {
      const plugin = createTypeAheadPlugin();
      const { editorView } = createEditor({
        doc: doc(p(typeAheadQuery({ trigger: '/' })('/query{<>}'))),
        editorPlugins: [plugin],
      });
      selectByIndex(2)(editorView.state, editorView.dispatch);
      expect(editorView.state.doc).toEqualDocument(doc(p('3 selected')));
    });

    it("should return false if item with the provided index doesn't exist", () => {
      const plugin = createTypeAheadPlugin();
      const { editorView } = createEditor({
        doc: doc(p(typeAheadQuery({ trigger: '/' })('/query{<>}'))),
        editorPlugins: [plugin],
      });
      expect(selectByIndex(20)(editorView.state, editorView.dispatch)).toBe(
        false,
      );
    });
  });

  describe('selectItem', () => {
    it('should add a space when replacing a type ahead query with an inline node', () => {
      const plugin = createTypeAheadPlugin();
      const { editorView } = createEditor({
        doc: doc(p(typeAheadQuery({ trigger: '/' })('/query{<>}'))),
        editorPlugins: [plugin, datePlugin()],
      });
      selectItem(
        {
          trigger: '/',
          selectItem: (state, item, insert) =>
            insert(
              state.schema.nodes.date.createChecked({ timestamp: item.title }),
            ),
          getItems: () => [],
        },
        { title: '1' },
      )(editorView.state, editorView.dispatch);
      expect(editorView.state.doc).toEqualDocument(
        doc(p(date({ timestamp: '1' }), ' ')),
      );
    });

    it('should accept text', () => {
      const plugin = createTypeAheadPlugin();
      const { editorView } = createEditor({
        doc: doc(p(typeAheadQuery({ trigger: '/' })('/query{<>}'))),
        editorPlugins: [plugin, datePlugin()],
      });
      selectItem(
        {
          trigger: '/',
          selectItem: (_state, _item, insert) => insert('some text'),
          getItems: () => [],
        },
        { title: '1' },
      )(editorView.state, editorView.dispatch);
      expect(editorView.state.doc).toEqualDocument(doc(p('some text')));
    });

    it('should accept fragment', () => {
      const plugin = createTypeAheadPlugin();
      const { editorView } = createEditor({
        doc: doc(p(typeAheadQuery({ trigger: '/' })('/query{<>}'))),
        editorPlugins: [plugin, datePlugin()],
      });

      selectItem(
        {
          trigger: '/',
          selectItem: (state, _item, insert) => {
            const fragment = Fragment.fromArray([
              state.schema.text('text one'),
              state.schema.text('  '),
              state.schema.text('text two'),
            ]);
            return insert(fragment);
          },
          getItems: () => [],
        },
        { title: '1' },
      )(editorView.state, editorView.dispatch);

      expect(editorView.state.doc).toEqualDocument(
        doc(p('text one  text two')),
      );
    });

    it('should not add a space when replacing a type ahead query with a text node', () => {
      const plugin = createTypeAheadPlugin();
      const { editorView } = createEditor({
        doc: doc(p(typeAheadQuery({ trigger: '/' })('/query{<>}'))),
        editorPlugins: [plugin],
      });
      selectItem(
        {
          trigger: '/',
          selectItem: (state, item, replaceWith) =>
            replaceWith(state.schema.text(item.title)),
          getItems: () => [],
        },
        { title: '1' },
      )(editorView.state, editorView.dispatch);
      expect(editorView.state.doc).toEqualDocument(doc(p('1')));
    });

    it('should not remove any unrelated characters when replacing a type ahead query with an inline node', () => {
      const plugin = createTypeAheadPlugin();
      const { editorView } = createEditor({
        doc: doc(p(typeAheadQuery({ trigger: '/' })('/query{<>}'), 'content')),
        editorPlugins: [plugin],
      });
      selectItem(
        {
          trigger: '/',
          selectItem: (state, item, replaceWith) =>
            replaceWith(state.schema.text(`${item.title} `)),
          getItems: () => [],
        },
        { title: '1' },
      )(editorView.state, editorView.dispatch);
      expect(editorView.state.doc).toEqualDocument(doc(p('1 content')));
    });

    it('should replace an empty paragraph node with insert block node', () => {
      const plugin = createTypeAheadPlugin();
      const { editorView } = createEditor({
        doc: doc(p(typeAheadQuery({ trigger: '/' })('/query{<>}'))),
        editorPlugins: [plugin],
      });
      selectItem(
        {
          trigger: '/',
          selectItem: (state, _item, replaceWith) =>
            replaceWith(
              state.schema.nodes.blockquote.createChecked(
                {},
                state.schema.nodes.paragraph.createChecked(
                  {},
                  state.schema.text('quote'),
                ),
              ),
            ),
          getItems: () => [],
        },
        { title: '1' },
      )(editorView.state, editorView.dispatch);
      expect(editorView.state.doc).toEqualDocument(doc(blockquote(p('quote'))));
    });

    it('should insert a block node below non-empty node', () => {
      const plugin = createTypeAheadPlugin();
      const { editorView } = createEditor({
        doc: doc(
          p('some text ', typeAheadQuery({ trigger: '/' })('/query{<>}')),
        ),
        editorPlugins: [plugin],
      });
      selectItem(
        {
          trigger: '/',
          selectItem: (state, _item, replaceWith) =>
            replaceWith(
              state.schema.nodes.blockquote.createChecked(
                {},
                state.schema.nodes.paragraph.createChecked(
                  {},
                  state.schema.text('quote'),
                ),
              ),
            ),
          getItems: () => [],
        },
        { title: '1' },
      )(editorView.state, editorView.dispatch);

      expect(editorView.state.doc).toEqualDocument(
        doc(p('some text '), blockquote(p('quote'))),
      );
    });

    it('should select inserted inline node when selectInlineNode is specified', () => {
      const plugin = createTypeAheadPlugin();
      const { editorView } = createEditor({
        doc: doc(p(typeAheadQuery({ trigger: '/' })('/query{<>}'))),
        editorPlugins: [plugin, datePlugin()],
      });
      selectItem(
        {
          trigger: '/',
          selectItem: (state, item, insert) =>
            insert(
              state.schema.nodes.date.createChecked({ timestamp: item.title }),
              { selectInlineNode: true },
            ),
          getItems: () => [],
        },
        { title: '1' },
      )(editorView.state, editorView.dispatch);

      expect(editorView.state.selection.from).toEqual(1);
      expect(editorView.state.selection.to).toEqual(2);
    });

    it("should move cursor after inline node+space when selectInlineNode isn't specified", () => {
      const plugin = createTypeAheadPlugin();
      const { editorView } = createEditor({
        doc: doc(p(typeAheadQuery({ trigger: '/' })('/query{<>}'))),
        editorPlugins: [plugin, datePlugin()],
      });
      selectItem(
        {
          trigger: '/',
          selectItem: (state, item, insert) =>
            insert(
              state.schema.nodes.date.createChecked({ timestamp: item.title }),
            ),
          getItems: () => [],
        },
        { title: '1' },
      )(editorView.state, editorView.dispatch);

      expect(editorView.state.selection.from).toEqual(3);
      expect(editorView.state.selection.to).toEqual(3);
    });

    it("should normalise a nodes layout if it's being nested.", () => {
      const { editorView } = createEditor({
        doc: doc(
          bodiedExtension({
            extensionKey: 'fake.extension',
            extensionType: 'atlassian.com.editor',
          })(p(typeAheadQuery({ trigger: '/' })('/query{<>}'))),
        ),
        editorProps: {
          allowExtension: true,
        },
      });
      selectItem(
        {
          trigger: '/',
          selectItem: (state, _item, insert) =>
            insert(
              state.schema.nodes.extension.createChecked({
                layout: 'full-width',
                localId: 'testId',
              }),
            ),
          getItems: () => [],
        },
        { title: '1' },
      )(editorView.state, editorView.dispatch);
      expect(editorView.state.doc).toEqualDocument(
        doc(
          bodiedExtension({
            extensionKey: 'fake.extension',
            extensionType: 'atlassian.com.editor',
            localId: 'testId',
          })(
            extension({
              extensionKey: '',
              extensionType: '',
              layout: 'default',
              localId: 'testId',
            })(),
          ),
        ),
      );
    });

    it('should delete the query node if an invite teammate item is selected', () => {
      const plugin = createTypeAheadPlugin();
      const { editorView } = createEditor({
        doc: doc(p(typeAheadQuery({ trigger: '@' })('@query{<>}'), 'content')),
        editorPlugins: [plugin],
      });
      selectItem(
        {
          trigger: '@',
          selectItem: (state, item, replaceWith) =>
            replaceWith(state.schema.text(`${item.title} `)),
          getItems: () => [],
        },
        {
          title: 'invite-teammate',
          mention: {
            id: 'invite-teammate',
          },
        },
      )(editorView.state, editorView.dispatch);
      expect(editorView.state.doc).toEqualDocument(doc(p('content')));
    });

    it('should return false if an invite teammate item is selected by space', () => {
      const plugin = createTypeAheadPlugin();
      const { editorView } = createEditor({
        doc: doc(p(typeAheadQuery({ trigger: '@' })('@query{<>}'), 'content')),
        editorPlugins: [plugin],
      });
      expect(
        selectItem(
          {
            trigger: '@',
            selectItem: (state, item, replaceWith) =>
              replaceWith(state.schema.text(`${item.title} `)),
            getItems: () => [],
          },
          {
            title: 'invite-teammate',
            mention: {
              id: 'invite-teammate',
            },
          },
          'space',
        )(editorView.state, editorView.dispatch),
      ).toBe(false);
    });
  });
});
