import { Fragment, Node } from 'prosemirror-model';
import { p, strong, clean } from '@atlaskit/editor-test-helpers/doc-builder';
import defaultSchema from '@atlaskit/editor-test-helpers/schema';
import { mapFragment } from '../../../utils/slice';

const fragment = (...args: any) =>
  Fragment.from(args.map((i: any) => clean(i)(defaultSchema)) as Node[]);

describe('@atlaskit/editor-core slice utils', () => {
  describe('mapFragment', () => {
    it('should return an equivalent node when given an identity function', () => {
      const content = fragment(p('start'), p('middle'), p('end'));
      expect(mapFragment(content, (i) => i).eq(content)).toBe(true);
    });

    it('should support mutating child nodes', () => {
      const content = fragment(p('start'), p('middle'), p('end'));
      const boldTextNodes = (node: Node) =>
        node.isText ? node.mark([defaultSchema.mark('strong')]) : node;
      const expected = fragment(
        p(strong('start')),
        p(strong('middle')),
        p(strong('end')),
      );
      expect(mapFragment(content, boldTextNodes).eq(expected)).toBe(true);
    });

    it('should call callback with (node, parent, offset)', () => {
      const content = fragment(p('content'));
      const spy = jest.fn((i) => i);
      mapFragment(content, spy);
      expect(spy).toHaveBeenCalledTimes(2);
      expect(spy.mock.calls[0]).toEqual([
        content.firstChild!.firstChild!,
        content.firstChild!,
        0,
      ]);
      expect(spy.mock.calls[1]).toEqual([content.firstChild!, null, 0]);
    });

    it('should allow replacing one node with multiple nodes', () => {
      const content = fragment(p('content'));
      const replaceMultiple = () =>
        [p('start'), p('end')].map((i) => clean(i)(defaultSchema)) as Node[];
      expect(mapFragment(content, replaceMultiple)).toEqual(
        fragment(p('start'), p('end')),
      );
    });
  });
});
