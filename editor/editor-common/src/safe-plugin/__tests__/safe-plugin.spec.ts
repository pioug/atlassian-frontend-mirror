import type { NodeView } from '@atlaskit/editor-prosemirror/view';

import { SafePlugin } from '../index';

describe('Safe Plugin', () => {
  const noop = {} as any;
  const toBlow = () => {
    throw new Error('Blow');
  };
  describe('when getPos throw an error', () => {
    let getPosInsideNodeView: () => number | undefined;
    beforeEach(() => {
      const plugin = new SafePlugin({
        props: {
          nodeViews: {
            fakeNodeView(_node, _view, getPos) {
              getPosInsideNodeView = getPos;

              return {} as NodeView;
            },
          },
        },
      });

      plugin.spec?.props?.nodeViews?.fakeNodeView(
        noop,
        noop,
        toBlow,
        noop,
        noop,
      );
    });

    it('should return undefined to the NodeView', () => {
      expect(getPosInsideNodeView()).toBeUndefined();
    });

    it('should not elevate to the NodeView', () => {
      expect(() => {
        getPosInsideNodeView();
      }).not.toThrowError();
    });
  });
});
