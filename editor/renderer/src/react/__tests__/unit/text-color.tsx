import React from 'react';
import { render } from '@testing-library/react';
import TextColor from '../../marks/textColor';

import { setGlobalTheme } from '@atlaskit/tokens';
import { ffTest } from '@atlassian/feature-flags-test-utils';

describe('custom text colors inversion in dark mode', () => {
  it('inverts in dark mode', async () => {
    await setGlobalTheme({ colorMode: 'dark' });
    const { container } = render(
      <TextColor
        color="#ff00cc"
        dataAttributes={{
          'data-renderer-mark': true,
        }}
      >
        test
      </TextColor>,
    );

    const span = container.querySelector('[data-text-custom-color]')!;
    expect(span!).toHaveStyle('--custom-palette-color: #00FF33');
  });

  it('does not invert in light mode', async () => {
    await setGlobalTheme({ colorMode: 'light' });
    const { container } = render(
      <TextColor
        color="#ff00cc"
        dataAttributes={{
          'data-renderer-mark': true,
        }}
      >
        test
      </TextColor>,
    );

    const span = container.querySelector('[data-text-custom-color]')!;
    expect(span!).toHaveStyle('--custom-palette-color: #ff00cc');
  });
});

describe('feature flag uses LCH color inversion in dark mode', () => {
  ffTest(
    'platform.editor.use-lch-for-color-inversion_1qv8ol',
    async () => {
      await setGlobalTheme({ colorMode: 'dark' });
      const { container } = render(
        <TextColor
          color="#ff00cc"
          dataAttributes={{
            'data-renderer-mark': true,
          }}
        >
          test
        </TextColor>,
      );

      const span = container.querySelector('[data-text-custom-color]')!;
      expect(span!).toHaveStyle('--custom-palette-color: #CE00A1');
    },
    async () => {
      await setGlobalTheme({ colorMode: 'dark' });
      const { container } = render(
        <TextColor
          color="#ff00cc"
          dataAttributes={{
            'data-renderer-mark': true,
          }}
        >
          test
        </TextColor>,
      );

      const span = container.querySelector('[data-text-custom-color]')!;
      expect(span!).toHaveStyle('--custom-palette-color: #00FF33');
    },
  );
});
