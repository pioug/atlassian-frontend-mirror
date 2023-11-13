import type { CardOptions } from '@atlaskit/editor-common/card';
import type { DocBuilder } from '@atlaskit/editor-common/types';
import { isRichMediaInsideOfBlockNode } from '@atlaskit/editor-common/utils';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  blockCard,
  doc,
  embedCard,
  inlineCard,
  layoutColumn,
  layoutSection,
  li,
  p,
  ul,
} from '@atlaskit/editor-test-helpers/doc-builder';

import {
  isBlockSupportedAtPosition,
  isEmbedSupportedAtPosition,
} from '../../utils';

describe('Rich Media utils:', () => {
  const createEditor = createEditorFactory();
  const editor = (doc: DocBuilder, cardProps?: Partial<CardOptions>) => {
    return createEditor({
      doc,
      editorProps: {
        allowLayouts: { allowBreakout: true },
        smartLinks: {
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

  describe('isAppearanceSupportedInParent', () => {
    const getInlineNodeView = () =>
      editor(
        doc(
          p(
            '{<node>}',
            inlineCard({
              url: 'http://www.atlassian.com/',
            })(),
          ),
        ),
      );

    const getInlineNodeInBulletList = () =>
      editor(
        doc(
          ul(
            li(
              p(
                '{<node>}',
                inlineCard({
                  url: 'http://www.atlassian.com/',
                })(),
              ),
            ),
          ),
        ),
      );

    describe('isEmbedSupportedAtPosition', () => {
      it('should return true if the current appearance at position is embed', () => {
        const { editorView } = editor(
          doc(
            '{<node>}',
            embedCard({
              url: 'http://www.atlassian.com/',
              layout: 'center',
            })(),
          ),
        );

        expect(isEmbedSupportedAtPosition(1, editorView.state, 'embed')).toBe(
          true,
        );
      });

      it('should return true if the node at provided position can be upgraded to embed', () => {
        const { editorView } = getInlineNodeView();
        expect(isEmbedSupportedAtPosition(1, editorView.state, 'inline')).toBe(
          true,
        );
      });

      it('should return false if node at provided position cannot be upgraded to embed', () => {
        // inserting a bullet list which doesn't support embed with a link as the only list item
        // the position of the link will be 3: <ul> is 1, <li> is 2, <p> and the node contained inside of it is 3
        const { editorView } = getInlineNodeInBulletList();
        expect(isEmbedSupportedAtPosition(3, editorView.state, 'inline')).toBe(
          false,
        );
      });
    });

    describe('isBlockSupportedAtPosition', () => {
      it('should return true if the current appearance at the provided position is already block', () => {
        const { editorView } = editor(
          doc(
            '{<node>}',
            blockCard({
              url: 'http://www.atlassian.com/',
            })(),
          ),
        );

        expect(isBlockSupportedAtPosition(1, editorView.state, 'block')).toBe(
          true,
        );
      });

      it('should return true if the node at provided position can be upgraded to block', () => {
        const { editorView } = getInlineNodeView();
        expect(isBlockSupportedAtPosition(1, editorView.state, 'inline')).toBe(
          true,
        );
      });

      it('should return false if the node at provided position cannot be upgraded to block', () => {
        // inserting a bullet list which doesn't support embed with a link as the only list item
        // the position of the link will be 3: <ul> is 1, <li> is 2, <p> and the node contained inside of it is 3
        const { editorView } = getInlineNodeInBulletList();
        expect(isBlockSupportedAtPosition(3, editorView.state, 'inline')).toBe(
          false,
        );
      });
    });
  });
});
