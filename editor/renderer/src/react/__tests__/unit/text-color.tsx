import React from 'react';
import { render } from '@testing-library/react';
import TextColor from '../../marks/textColor';
import { ffTest } from '@atlassian/feature-flags-test-utils';
import { setGlobalTheme } from '@atlaskit/tokens';

describe('custom text colors inversion in dark mode', () => {
  ffTest(
    'platform.editor.dm-invert-text-color_cvho2',
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
    async () => {
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
    },
  );
});
