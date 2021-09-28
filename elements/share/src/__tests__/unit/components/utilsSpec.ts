import { createRef } from 'react';
import {
  generateSelectZIndex,
  zIndexAddition,
  getMenuPortalTargetCurrentHTML,
} from '../../../components/utils';
// AFP-2532 TODO: Fix automatic suppressions below
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { layers } from '@atlaskit/theme';

describe('utils functions', () => {
  describe('generateSelectZIndex', () => {
    it('should generate correct z-index for Select component', () => {
      expect(generateSelectZIndex()).toBe(layers.modal() + zIndexAddition);
      expect(generateSelectZIndex(100)).toBe(100 + zIndexAddition);
    });
  });

  describe('getMenuPortalTargetCurrentHTML', () => {
    it('shoulder return null or HTML element from ref', () => {
      const ref = createRef<HTMLDivElement>();
      let refWithElement = createRef<HTMLDivElement>();
      // @ts-ignore - cannot assign read-only property
      refWithElement.current = {};
      expect(getMenuPortalTargetCurrentHTML(null)).toBe(null);
      expect(getMenuPortalTargetCurrentHTML(ref)).toBe(null);
      expect(getMenuPortalTargetCurrentHTML(refWithElement)).toBe(
        refWithElement.current,
      );
    });
  });
});
