import type { RichMediaLayout } from '@atlaskit/adf-schema';
import { akEditorFullWidthLayoutWidth } from '@atlaskit/editor-shared-styles';

import * as utils from '../../utils';

describe('utils', () => {
  describe('calcNewLayout', () => {
    it.each([
      [
        'center remains under no fullwidthMode and width < contentWidth and nested',
        {
          args: {
            fullWidthMode: false,
            layout: 'center',
            width: 500,
            contentWidth: 760,
            isNested: true,
          },
          expected: 'center',
        },
      ],
      [
        'center remains when reach contentWidth under no fullwidthMode and nested',
        {
          args: {
            fullWidthMode: false,
            layout: 'center',
            width: 760,
            contentWidth: 760,
            isNested: true,
          },
          expected: 'center',
        },
      ],
      [
        'center remains when >contentWidth under no fullwidthMode and nested',
        {
          args: {
            fullWidthMode: false,
            layout: 'center',
            width: 800,
            contentWidth: 760,
            isNested: true,
          },
          expected: 'center',
        },
      ],
      [
        'center change to fullwidth under no fullwidthMode when >= akEditorFullWidthLayoutWidth and nested',
        {
          args: {
            fullWidthMode: false,
            layout: 'center',
            width: akEditorFullWidthLayoutWidth,
            contentWidth: 760,
            isNested: true,
          },
          expected: 'full-width',
        },
      ],
      [
        'center change to wide >contentWidth under no fullwidthMode and not nested',
        {
          args: {
            fullWidthMode: false,
            layout: 'center',
            width: 800,
            contentWidth: 760,
            isNested: false,
          },
          expected: 'wide',
        },
      ],
      [
        'center change to fullwidth under no fullwidthMode when >= akEditorFullWidthLayoutWidth and not nested',
        {
          args: {
            fullWidthMode: false,
            layout: 'center',
            width: akEditorFullWidthLayoutWidth,
            contentWidth: 760,
            isNested: false,
          },
          expected: 'full-width',
        },
      ],
      [
        'fullwidth change to wide when width > contentWidth and < akEditorFullWidthLayoutWidth under no fullwidthMode and not nested',
        {
          args: {
            fullWidthMode: false,
            layout: 'full-width',
            width: 1500,
            contentWidth: 760,
            isNested: false,
          },
          expected: 'wide',
        },
      ],
      [
        'fullwidth change to center under no fullwidthMode and not nested',
        {
          args: {
            fullWidthMode: false,
            layout: 'full-width',
            width: 400,
            contentWidth: 760,
            isNested: false,
          },
          expected: 'center',
        },
      ],
      [
        'fullwidth change to center when set to contentWidth under no fullwidthMode and not nested',
        {
          args: {
            fullWidthMode: false,
            layout: 'full-width',
            width: 760,
            contentWidth: 760,
            isNested: false,
          },
          expected: 'center',
        },
      ],
      [
        'full-width change to center under fullwidthMode and not nested',
        {
          args: {
            fullWidthMode: true,
            layout: 'full-width',
            width: 900,
            contentWidth: 760,
            isNested: false,
          },
          expected: 'center',
        },
      ],
      [
        'wide change to center under fullwidthMode and not nested',
        {
          args: {
            fullWidthMode: true,
            layout: 'wide',
            width: 800,
            contentWidth: 760,
            isNested: false,
          },
          expected: 'center',
        },
      ],
      [
        'align-start remains under no fullwidthMode and nested',
        {
          args: {
            fullWidthMode: false,
            layout: 'align-start',
            width: 500,
            contentWidth: 760,
            isNested: true,
          },
          expected: 'align-start',
        },
      ],
      [
        'align-start remains unchanged when set to contentWidth under no fullwidthMode and nested',
        {
          args: {
            fullWidthMode: false,
            layout: 'align-start',
            width: 760,
            contentWidth: 760,
            isNested: true,
          },
          expected: 'align-start',
        },
      ],
      [
        'align-start remains under fullwidthMode, <contentWidth and nested',
        {
          args: {
            fullWidthMode: true,
            layout: 'align-start',
            width: 500,
            contentWidth: 760,
            isNested: true,
          },
          expected: 'align-start',
        },
      ],
      [
        'align-start remains when no fullwidthMode, >contentWidth and nested',
        {
          args: {
            fullWidthMode: false,
            layout: 'align-start',
            width: 800,
            contentWidth: 760,
            isNested: true,
          },
          expected: 'align-start',
        },
      ],
      [
        'align-start change to center when set to contentWidth under no fullwidthMode and not nested',
        {
          args: {
            fullWidthMode: false,
            layout: 'align-start',
            width: 760,
            contentWidth: 760,
            isNested: false,
          },
          expected: 'center',
        },
      ],
      [
        'align-start change to wide when >contentWidth under no fullwidthMode and not nested',
        {
          args: {
            fullWidthMode: false,
            layout: 'align-start',
            width: 800,
            contentWidth: 760,
            isNested: false,
          },
          expected: 'wide',
        },
      ],
      [
        'align-start remains under fullwidthMode and not nested',
        {
          args: {
            fullWidthMode: true,
            layout: 'align-start',
            width: 500,
            contentWidth: 760,
            isNested: false,
          },
          expected: 'align-start',
        },
      ],
      [
        'align-start should remain under fullwidthMode when width >= contentWidth and not nested',
        {
          args: {
            fullWidthMode: true,
            layout: 'align-start',
            width: 1700,
            contentWidth: 760,
            isNested: false,
          },
          expected: 'align-start',
        },
      ],
    ])('%s', (_name, { args, expected }) => {
      const { width, layout, contentWidth, fullWidthMode, isNested } = args;
      expect(
        utils.calcNewLayout(
          width,
          layout as RichMediaLayout,
          contentWidth,
          fullWidthMode,
          isNested,
        ),
      ).toBe(expected);
    });
  });
});
