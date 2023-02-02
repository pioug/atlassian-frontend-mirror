import sampleSchema from '@atlaskit/editor-test-helpers/schema';
import { TextSelection } from 'prosemirror-state';
import {
  doc,
  p,
  panel,
  layoutSection,
  layoutColumn,
  table,
  tr,
  td,
  tdEmpty,
  extension,
  code_block,
  li,
  ul,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { onCreateSelectionBetween } from '../../create-selection-between';

describe('#onCreateSelectionBetween', () => {
  describe('when head and anchor are targetting the same position', () => {
    it('should return null', () => {
      const fakeDoc = doc(p('Hello{anchor}{head}'))(sampleSchema);
      const fakeView: any = { state: { doc: fakeDoc } };
      const $anchor = fakeDoc.resolve(fakeDoc.refs.anchor);
      const $head = fakeDoc.resolve(fakeDoc.refs.head);

      const result = onCreateSelectionBetween(fakeView, $anchor, $head);
      expect(result).toBeNull();
    });
  });

  describe('when head and anchor are targetting the same parent node', () => {
    describe('at depth one', () => {
      it('should return null', () => {
        const fakeDoc = doc(
          // prettier-disable
          p('Hello'),
          panel()(p('')),
          p('{head}same parent do nothing{anchor}'),
        )(sampleSchema);
        const fakeView: any = { state: { doc: fakeDoc } };
        const $anchor = fakeDoc.resolve(fakeDoc.refs.anchor);
        const $head = fakeDoc.resolve(fakeDoc.refs.head);

        const result = onCreateSelectionBetween(fakeView, $anchor, $head);
        expect(result).toBeNull();
      });
    });

    describe('at depth three', () => {
      it('should return null', () => {
        const fakeDoc = doc(
          // prettier-disable
          p('Hello'),
          panel()(p('{head}same parent do nothing{anchor}')),
          p(''),
        )(sampleSchema);
        const fakeView: any = { state: { doc: fakeDoc } };
        const $anchor = fakeDoc.resolve(fakeDoc.refs.anchor);
        const $head = fakeDoc.resolve(fakeDoc.refs.head);

        const result = onCreateSelectionBetween(fakeView, $anchor, $head);
        expect(result).toBeNull();
      });
    });
  });

  describe('when head is targetting an non-selectable empty node', () => {
    const cases = [
      {
        description: 'from a paragraph to list item',
        docBuilder: doc(
          // prettier-ignore
          p('Hello'),
          ul(li(p('{head}'))),
          p('{anchor}'),
        ),
      },
      {
        description: 'from a paragraph to a nested list item',
        docBuilder: doc(
          // prettier-ignore
          p('Hello'),
          ul(li(p(''), ul(li(p('{head}'))))),
          p('{anchor}'),
        ),
      },
    ];

    describe.each(cases)('', ({ description, docBuilder }) => {
      describe(description, () => {
        const fakeDoc = docBuilder(sampleSchema);

        const fakeView: any = { state: { doc: fakeDoc } };
        const $anchor = fakeDoc.resolve(fakeDoc.refs.anchor);
        const $head = fakeDoc.resolve(fakeDoc.refs.head);

        it('should return null', () => {
          const result = onCreateSelectionBetween(fakeView, $anchor, $head);
          expect(result).toBeNull();
        });
      });
    });
  });

  describe('when head is targetting an empty code block node', () => {
    const cases = [
      {
        description: 'from a paragraph to code block',
        docBuilder: doc(
          // prettier-ignore
          p('Hello'),
          '{nextHeadNodePosition}',
          code_block({})('{head}'),
          p('{anchor}'),
        ),
      },
    ];

    describe.each(cases)('', ({ description, docBuilder }) => {
      describe(description, () => {
        const fakeDoc = docBuilder(sampleSchema);

        const fakeView: any = { state: { doc: fakeDoc } };
        const $anchor = fakeDoc.resolve(fakeDoc.refs.anchor);
        const $head = fakeDoc.resolve(fakeDoc.refs.head);

        describe('and when head is targeting a simple empty block node', () => {
          describe('then the TextSelection', () => {
            it('should select the empty node', () => {
              const { anchor, nextHeadNodePosition } = fakeDoc.refs;
              const result = onCreateSelectionBetween(fakeView, $anchor, $head);
              expect(result!.toJSON()).toEqual(
                expect.objectContaining({
                  type: 'text',
                  anchor: anchor,
                  head: nextHeadNodePosition,
                }),
              );
            });
          });
        });
      });
    });
  });

  describe('when head is targetting an atom node', () => {
    const cases = [
      {
        description: 'from a paragraph to an extension',
        docBuilder: doc(
          // prettier-ignore
          p('Hello'),
          '{head}{nextHeadNodePosition}',
          extension({
            localId: 'extension-local-id',
            extensionKey: 'key-1',
            extensionType: 'type-1',
          })(),
          p('{anchor}'),
        ),
      },
    ];

    describe.each(cases)('', ({ description, docBuilder }) => {
      describe(description, () => {
        const fakeDoc = docBuilder(sampleSchema);

        const fakeView: any = { state: { doc: fakeDoc } };
        const $anchor = fakeDoc.resolve(fakeDoc.refs.anchor);
        const $head = fakeDoc.resolve(fakeDoc.refs.head);

        describe('and when head is targeting a simple empty block node', () => {
          describe('then the TextSelection', () => {
            it('should select the empty node', () => {
              const { anchor, nextHeadNodePosition } = fakeDoc.refs;
              const result = onCreateSelectionBetween(fakeView, $anchor, $head);
              expect(result!.toJSON()).toEqual(
                expect.objectContaining({
                  type: 'text',
                  anchor: anchor,
                  head: nextHeadNodePosition,
                }),
              );
            });
          });
        });
      });
    });
  });

  describe('when head is targetting a non-empty block node', () => {
    const cases = [
      {
        description: 'from a paragraph to another paragraph',
        docBuilder: doc(
          // prettier-ignore
          p('Hello{head}'),
          p('{anchor}'),
        ),
      },
      {
        description: 'from a paragraph to a panel',
        docBuilder: doc(
          // prettier-ignore
          panel()(
          p('Hello{head}'),
        ),
          p('{anchor}'),
        ),
      },
      {
        description: 'from a paragraph to a empty paragraph inside a panel',
        docBuilder: doc(
          // prettier-ignore
          panel()(
          p('Hello'),
          p('{head}'),
        ),
          p('{anchor}'),
        ),
      },
    ];

    describe.each(cases)('', ({ description, docBuilder }) => {
      describe(description, () => {
        const fakeDoc = docBuilder(sampleSchema);

        const fakeView: any = { state: { doc: fakeDoc } };
        const $anchor = fakeDoc.resolve(fakeDoc.refs.anchor);
        const $head = fakeDoc.resolve(fakeDoc.refs.head);

        it('should return null', () => {
          const result = onCreateSelectionBetween(fakeView, $anchor, $head);
          expect(result).toBeNull();
        });
      });
    });
  });

  describe('when head is targetting another an empty node', () => {
    const cases = [
      {
        description: 'from depth 1 to 3',
        docBuilder: doc(
          // prettier-disable
          p('Hello'),
          '{nextHeadNodePosition}',
          panel()(p('{head}')),
          p('{anchor}'),
        ),
      },
      {
        description: 'from depth 3 to 4',
        docBuilder: doc(
          // prettier-disable
          p('Hello'),
          layoutSection(
            layoutColumn({ width: 100 })(
              '{nextHeadNodePosition}',
              panel()(p('{head}')),
              p('{anchor}'),
            ),
          ),
        ),
      },
      {
        description: 'from depth 1 to 3',
        docBuilder: doc(
          // prettier-disable
          p('Hello{anchor}'),
          panel()(p('{head}')),
          '{nextHeadNodePosition}',
          p(''),
        ),
      },
      {
        description: 'from depth 1 to 4',
        docBuilder: doc(
          // prettier-disable
          p('Hello{anchor}'),
          layoutSection(
            layoutColumn({ width: 100 })(
              panel()(p('{head}')),
              '{nextHeadNodePosition}',
              p(''),
            ),
          ),
        ),
      },
      {
        description: 'from depth 3 to 4 (jumping an empty node)',
        docBuilder: doc(
          // prettier-disable
          p('Hello'),
          layoutSection(
            layoutColumn({ width: 100 })(
              '{nextHeadNodePosition}',
              panel()(p('{head}')),
              panel()(p('')),
              p('{anchor}'),
            ),
          ),
        ),
      },
      {
        description: 'from depth 1 to empty table (table is the first node)',
        docBuilder: doc(
          '{nextHeadNodePosition}',
          table()(
            tr(
              // prettier-disable
              tdEmpty,
              tdEmpty,
              td()(p('{head}')),
            ),
          ),
          p('{anchor}'),
        ),
      },
      {
        description: 'from depth 1 to empty table (table is the second node)',
        docBuilder: doc(
          p('Hello'),
          '{nextHeadNodePosition}',
          table()(
            tr(
              // prettier-disable
              tdEmpty,
              tdEmpty,
              td()(p('{head}')),
            ),
          ),
          p('{anchor}'),
        ),
      },
      {
        description: 'from rght before the empty table to inside it ',
        docBuilder: doc(
          p('Hello{anchor}'),
          table()(
            tr(
              // prettier-disable
              td()(p('{head}')),
              tdEmpty,
              tdEmpty,
            ),
          ),
          '{nextHeadNodePosition}',
          p(''),
        ),
      },
    ];
    describe.each(cases)('', ({ description, docBuilder }) => {
      describe(description, () => {
        const fakeDoc = docBuilder(sampleSchema);

        const fakeView: any = { state: { doc: fakeDoc } };
        const $anchor = fakeDoc.resolve(fakeDoc.refs.anchor);
        const $head = fakeDoc.resolve(fakeDoc.refs.head);

        describe('and when head is targeting a simple empty block node', () => {
          it('should not return null', () => {
            const result = onCreateSelectionBetween(fakeView, $anchor, $head);
            expect(result).not.toBeNull();
          });

          it('should return a TextSelection', () => {
            const result = onCreateSelectionBetween(fakeView, $anchor, $head);
            expect(result).toBeInstanceOf(TextSelection);
          });

          describe('then the TextSelection', () => {
            it('should select the empty node', () => {
              const { anchor, nextHeadNodePosition } = fakeDoc.refs;
              const result = onCreateSelectionBetween(fakeView, $anchor, $head);
              expect(result!.toJSON()).toEqual(
                expect.objectContaining({
                  type: 'text',
                  anchor: anchor,
                  head: nextHeadNodePosition,
                }),
              );
            });
          });
        });
      });
    });
  });
});
