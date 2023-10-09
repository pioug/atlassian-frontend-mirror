import type { RichMediaLayout } from '@atlaskit/adf-schema';

import * as utils from '../../utils';

describe('utils', () => {
  describe('calcNewLayout', () => {
    it.each([
      [
        'remain center under no fullwidthMode',
        {
          args: {
            fullWidthMode: false,
            layout: 'center',
            width: 500,
            contentWidth: 760,
          },
          expected: 'center',
        },
      ],
      [
        'remain center when reach contentWidth under no fullwidthMode',
        {
          args: {
            fullWidthMode: false,
            layout: 'center',
            width: 760,
            contentWidth: 760,
          },
          expected: 'center',
        },
      ],
      [
        'center change to wide under no fullwidthMode',
        {
          args: {
            fullWidthMode: false,
            layout: 'center',
            width: 800,
            contentWidth: 760,
          },
          expected: 'wide',
        },
      ],
      [
        'center change to fullwidth under no fullwidthNode',
        {
          args: {
            fullWidthMode: false,
            layout: 'center',
            width: 1800,
            contentWidth: 760,
          },
          expected: 'full-width',
        },
      ],
      [
        'fullwidth change to wide under no fullwidthNode',
        {
          args: {
            fullWidthMode: false,
            layout: 'full-width',
            width: 1500,
            contentWidth: 760,
          },
          expected: 'wide',
        },
      ],
      [
        'fullwidth change to center under no fullwidthNode',
        {
          args: {
            fullWidthMode: false,
            layout: 'full-width',
            width: 400,
            contentWidth: 760,
          },
          expected: 'center',
        },
      ],
      [
        'fullwidth change to center when reach contentWidth under no fullwidthNode',
        {
          args: {
            fullWidthMode: false,
            layout: 'full-width',
            width: 760,
            contentWidth: 760,
          },
          expected: 'center',
        },
      ],
      [
        'align-start remains under no fullwidthNode',
        {
          args: {
            fullWidthMode: false,
            layout: 'align-start',
            width: 500,
            contentWidth: 760,
          },
          expected: 'align-start',
        },
      ],
      [
        'align-start change to center reaching contentWidth under no fullwidthNode',
        {
          args: {
            fullWidthMode: false,
            layout: 'align-start',
            width: 760,
            contentWidth: 760,
          },
          expected: 'center',
        },
      ],
      [
        'align-start change to wide under no fullwidthNode',
        {
          args: {
            fullWidthMode: false,
            layout: 'align-start',
            width: 800,
            contentWidth: 760,
          },
          expected: 'wide',
        },
      ],
      [
        'align-start change to full-width under no fullwidthNode',
        {
          args: {
            fullWidthMode: false,
            layout: 'align-start',
            width: 1800,
            contentWidth: 760,
          },
          expected: 'full-width',
        },
      ],
      [
        'center change to full-width under fullwidthNode',
        {
          args: {
            fullWidthMode: true,
            layout: 'center',
            width: 1800,
            contentWidth: 760,
          },
          expected: 'full-width',
        },
      ],
      [
        'wide change to center under fullwidthNode',
        {
          args: {
            fullWidthMode: true,
            layout: 'wide',
            width: 800,
            contentWidth: 760,
          },
          expected: 'center',
        },
      ],
      [
        'full-width change to center under fullwidthNode',
        {
          args: {
            fullWidthMode: true,
            layout: 'full-width',
            width: 900,
            contentWidth: 760,
          },
          expected: 'center',
        },
      ],
      [
        'align-start remains under fullwidthNode',
        {
          args: {
            fullWidthMode: true,
            layout: 'align-start',
            width: 500,
            contentWidth: 760,
          },
          expected: 'align-start',
        },
      ],
      [
        'align-start change to full-width under fullwidthNode',
        {
          args: {
            fullWidthMode: true,
            layout: 'align-start',
            width: 1700,
            contentWidth: 760,
          },
          expected: 'align-start',
        },
      ],
      [
        'align-start change to full-width under fullwidthNode',
        {
          args: {
            fullWidthMode: true,
            layout: 'align-start',
            width: 1800,
            contentWidth: 760,
          },
          expected: 'full-width',
        },
      ],
    ])('%s', (_name, { args, expected }) => {
      const { width, layout, contentWidth, fullWidthMode } = args;
      expect(
        utils.calcNewLayout(
          width,
          layout as RichMediaLayout,
          contentWidth,
          fullWidthMode,
        ),
      ).toBe(expected);
    });
  });
});
