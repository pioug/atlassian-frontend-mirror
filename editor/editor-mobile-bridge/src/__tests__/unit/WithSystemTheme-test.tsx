import { mount } from 'enzyme';
import { AtlaskitThemeProvider } from '@atlaskit/theme/components';
import React from 'react';

import * as WST from '../../WithSystemTheme';

describe('WithSystemTheme', () => {
  describe('when theming is disabled', () => {
    it('should default to light mode', () => {
      const ComponentUnderTest = WST.withSystemTheme(React.Fragment, false);
      const withSystemTheme = mount(<ComponentUnderTest />);

      expect(withSystemTheme.find(AtlaskitThemeProvider).prop('mode')).toEqual(
        'light',
      );
    });
  });

  describe('when theming is enabled', () => {
    it('should read light mode from media query', () => {
      window.matchMedia = jest.fn().mockImplementation((query) => {
        return {
          matches: query === '(prefers-color-scheme: light)',
          media: '',
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
        };
      });

      const ComponentUnderTest = WST.withSystemTheme(React.Fragment, true);
      const withSystemTheme = mount(<ComponentUnderTest />);

      expect(withSystemTheme.find(AtlaskitThemeProvider).prop('mode')).toEqual(
        'light',
      );
    });

    it('should read dark mode from media query', () => {
      window.matchMedia = jest.fn().mockImplementation((query) => {
        return {
          matches: query === '(prefers-color-scheme: dark)',
          media: '',
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
        };
      });

      const ComponentUnderTest = WST.withSystemTheme(React.Fragment, true);
      const withSystemTheme = mount(<ComponentUnderTest />);

      expect(withSystemTheme.find(AtlaskitThemeProvider).prop('mode')).toEqual(
        'dark',
      );
    });
  });
});
