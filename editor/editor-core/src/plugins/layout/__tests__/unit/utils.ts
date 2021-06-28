import { Node, Fragment, Slice } from 'prosemirror-model';
import {
  p,
  layoutSection,
  layoutColumn,
  hr,
} from '@atlaskit/editor-test-helpers/doc-builder';
import defaultSchema from '@atlaskit/editor-test-helpers/schema';
import {
  unwrapContentFromLayout,
  removeLayoutFromFirstChild,
  removeLayoutFromLastChild,
  transformSliceToRemoveOpenLayoutNodes,
} from '../../utils';
import { flatmap } from '../../../../utils/slice';

const removeRef = (node: Node) => Node.fromJSON(defaultSchema, node.toJSON());
const array = (...args: any): Node[] =>
  args.map((i: any) => removeRef(i(defaultSchema)));
const fragment = (...args: any) =>
  Fragment.from(args.map((i: any) => removeRef(i(defaultSchema))));

describe('layout', () => {
  describe('#flatmap', () => {
    it('should return an equal fragment when the callback is an identity fn', () => {
      const content = fragment(p('hello'), p('world'), p('!'));
      expect(flatmap(content, (n) => n).eq(content)).toBe(true);
    });

    it('should invoke the callback fn with the node, index & original fragment', () => {
      const content = fragment(p('hello'), p('world'), p('!'));
      const callbackSpy = jest.fn((i) => i);

      flatmap(content, callbackSpy);
      expect(callbackSpy).toHaveBeenCalledTimes(3);
      callbackSpy.mock.calls.forEach((args: any) => {
        expect(args[0]).toBeInstanceOf(Node);
        expect(typeof args[1]).toBe('number');
        expect(args[2]).toEqual(content);
      });
    });

    it('should flatten any array returned from the callback fn', () => {
      const content = fragment(p('hello'), p('world'), p('!'));

      const actualFragment = flatmap(content, (n) => [n, n]);
      const expected = fragment(
        p('hello'),
        p('hello'),
        p('world'),
        p('world'),
        p('!'),
        p('!'),
      );
      expect(actualFragment.eq(expected)).toBe(true);
    });
  });

  describe('#unwrapContentFromLayout', () => {
    it('should ignore any node that is not a layoutSection', () => {
      const node = array(p('hello world!'))[0];
      expect(unwrapContentFromLayout(node)).toEqual([node]);
    });

    it('should unwrap any content inside a layoutSection', () => {
      const columnA = layoutColumn({ width: 33.33 })(p('Column A'), hr());
      const columnB = layoutColumn({ width: 33.33 })(p('Column B'));
      const columnC = layoutColumn({ width: 33.33 })(hr(), p('Column C'), hr());
      const layout = removeRef(
        layoutSection(columnA, columnB, columnC)(defaultSchema),
      );

      const expected = array(
        p('Column A'),
        hr(),
        p('Column B'),
        hr(),
        p('Column C'),
        hr(),
      );
      expect(unwrapContentFromLayout(layout)).toEqual(expected);
    });

    it('should ignore content not wrapped in layoutColumn inside a layoutSection', () => {
      const content = fragment(p('Column A'), hr(), p('Column B'));
      // The slice PM creates is not a valid node, so we can't use the builders
      const layout = defaultSchema.nodes.layoutSection.create({}, content);

      const expected = array(p('Column A'), hr(), p('Column B'));
      expect(unwrapContentFromLayout(layout)).toEqual(expected);
    });
  });

  describe('#removeLayoutFromFirstChild', () => {
    it('should unwrap the layout when it is the first child of a node', () => {
      const columnA = layoutColumn({ width: 50 })(p('Column A'));
      const columnB = layoutColumn({ width: 50 })(p('Column B'));
      const layout = removeRef(layoutSection(columnA, columnB)(defaultSchema));

      const expected = array(p('Column A'), p('Column B'));
      expect(removeLayoutFromFirstChild(layout, 0)).toEqual(expected);
    });

    it('should do nothing when the layout is not the first child of a node', () => {
      const columnA = layoutColumn({ width: 50 })(p('Column A'));
      const columnB = layoutColumn({ width: 50 })(p('Column B'));
      const layout = layoutSection(columnA, columnB)(defaultSchema);
      expect(removeLayoutFromFirstChild(layout, 1)).toEqual(layout);
    });
  });

  describe('#removeLayoutFromLastChild', () => {
    it('should unwrap the layout when it is the last child of a node', () => {
      const columnA = layoutColumn({ width: 50 })(p('Column A'));
      const columnB = layoutColumn({ width: 50 })(p('Column B'));
      const layout = layoutSection(columnA, columnB);
      const sliceFragment = fragment(p('Start'), layout);

      const expected = array(p('Column A'), p('Column B'));
      expect(
        removeLayoutFromLastChild(
          sliceFragment.lastChild!,
          sliceFragment.childCount - 1,
          sliceFragment,
        ),
      ).toEqual(expected);
    });

    it('should do nothing when the layout is not the last child of a node', () => {
      const columnA = layoutColumn({ width: 50 })(p('Column A'));
      const columnB = layoutColumn({ width: 50 })(p('Column B'));
      const layout = layoutSection(columnA, columnB);
      const sliceFragment = fragment(p('Start'), layout, p('End'));

      expect(
        removeLayoutFromLastChild(sliceFragment.child(1), 1, sliceFragment),
      ).toEqualDocument(layout);
    });
  });

  describe('#transformSliceToRemoveOpenLayoutNodes', () => {
    describe('when a slice contains only one layoutSection', () => {
      it('should ignore the layoutSection if the node is closed', () => {
        const slice = new Slice(
          fragment(
            layoutSection(
              layoutColumn({ width: 50 })(p('Column A')),
              layoutColumn({ width: 50 })(p('Column B')),
            ),
          ),
          0,
          0,
        );
        expect(
          transformSliceToRemoveOpenLayoutNodes(slice, defaultSchema),
        ).toBe(slice);
      });

      it('should unwrap the layoutSection if the node is open', () => {
        const slice = new Slice(
          fragment(
            layoutSection(
              layoutColumn({ width: 50 })(p('Column A')),
              layoutColumn({ width: 50 })(p('Column B')),
            ),
          ),
          3,
          3,
        );
        expect(
          transformSliceToRemoveOpenLayoutNodes(slice, defaultSchema),
        ).toEqual(new Slice(fragment(p('Column A'), p('Column B')), 1, 1));
      });
    });
    describe('when a slice begins with a layoutSection', () => {
      it('should ignore the layoutSection if the node is closed', () => {
        const slice = new Slice(
          fragment(
            layoutSection(
              layoutColumn({ width: 50 })(p('Column A')),
              layoutColumn({ width: 50 })(p('Column B')),
            ),
            p('End'),
          ),
          0,
          0,
        );
        expect(
          transformSliceToRemoveOpenLayoutNodes(slice, defaultSchema),
        ).toBe(slice);
      });

      it('should unwrap the layoutSection if the node is open', () => {
        const slice = new Slice(
          fragment(
            layoutSection(
              layoutColumn({ width: 50 })(p('Column A')),
              layoutColumn({ width: 50 })(p('Column B')),
            ),
            p('End'),
          ),
          3,
          0,
        );
        expect(
          transformSliceToRemoveOpenLayoutNodes(slice, defaultSchema),
        ).toEqual(
          new Slice(fragment(p('Column A'), p('Column B'), p('End')), 1, 0),
        );
      });
    });
    describe('when a slice ends with a layoutSection', () => {
      it('should ignore the layoutSection if the node is closed', () => {
        const slice = new Slice(
          fragment(
            p('Start'),
            layoutSection(
              layoutColumn({ width: 50 })(p('Column A')),
              layoutColumn({ width: 50 })(p('Column B')),
            ),
          ),
          0,
          0,
        );
        expect(
          transformSliceToRemoveOpenLayoutNodes(slice, defaultSchema),
        ).toBe(slice);
      });

      it('should unwrap the layoutSection if the node is open', () => {
        const slice = new Slice(
          fragment(
            p('Start'),
            layoutSection(
              layoutColumn({ width: 50 })(p('Column A')),
              layoutColumn({ width: 50 })(p('Column B')),
            ),
          ),
          0,
          3,
        );
        expect(
          transformSliceToRemoveOpenLayoutNodes(slice, defaultSchema),
        ).toEqual(
          new Slice(fragment(p('Start'), p('Column A'), p('Column B')), 0, 1),
        );
      });
    });

    describe('when a slice starts in one layoutSection and ends in another', () => {
      it('should ignore the layoutSection if the slice is closed', () => {
        const layout = layoutSection(
          layoutColumn({ width: 50 })(p('Column A')),
          layoutColumn({ width: 50 })(p('Column B')),
        );
        const slice = new Slice(fragment(layout, p('Middle'), layout), 0, 0);
        expect(
          transformSliceToRemoveOpenLayoutNodes(slice, defaultSchema),
        ).toBe(slice);
      });

      it('should unwrap the layoutSection if the slice is open', () => {
        const layout = layoutSection(
          layoutColumn({ width: 50 })(p('Column A')),
          layoutColumn({ width: 50 })(p('Column B')),
        );
        const slice = new Slice(fragment(layout, p('Middle'), layout), 3, 3);
        expect(
          transformSliceToRemoveOpenLayoutNodes(slice, defaultSchema),
        ).toEqual(
          new Slice(
            fragment(
              p('Column A'),
              p('Column B'),
              p('Middle'),
              p('Column A'),
              p('Column B'),
            ),
            1,
            1,
          ),
        );
      });
    });
  });
});
