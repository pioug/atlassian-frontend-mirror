import {
  embedCard,
  doc,
  layoutSection,
  layoutColumn,
  p,
} from '@atlaskit/editor-test-helpers/schema-builder';
import createEditorFactory from '@atlaskit/editor-test-helpers/create-editor';
import { isRichMediaInsideOfBlockNode } from '../../../../utils/rich-media-utils';
import { CardOptions } from '../../../../plugins/card';

describe('Rich Media utils:', () => {
  const createEditor = createEditorFactory();
  const editor = (doc: any, cardProps?: Partial<CardOptions>) => {
    return createEditor({
      doc,
      editorProps: {
        allowLayouts: { allowBreakout: true },
        UNSAFE_cards: {
          allowEmbeds: true,
          ...cardProps,
        },
      },
    });
  };

  it('isRichMediaInsideOfBlockNode: should return true when embed card is inside other block nodes', () => {
    const mockEmbedNode = embedCard({
      url: 'https://some/url',
      layout: 'center',
    })();
    const { editorView } = editor(
      doc(
        layoutSection(
          layoutColumn({ width: 50 })('{<node>}', mockEmbedNode),
          layoutColumn({ width: 50 })(p()),
        ),
      ),
    );
    const isInsideBlockNode = isRichMediaInsideOfBlockNode(
      editorView,
      editorView.state.selection.from,
    );
    expect(isInsideBlockNode).toBe(true);
  });
});
