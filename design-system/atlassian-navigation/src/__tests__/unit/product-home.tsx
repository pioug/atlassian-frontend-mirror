import React from 'react';

import { render } from '@testing-library/react';

import { CustomProductHome, ProductHome } from '../../../src';

const testId = 'product-home';
const logoTestId = `${testId}-logo`;

/**
 * Gets the var from the logo's parent.
 *
 * It is set on the logo's parent instead of the logo so it can be shared
 * easily with the icon as well.
 */
const getLogoMaxWidthCSSVar = (logoElement: HTMLElement) =>
  logoElement.parentElement?.style.getPropertyValue('--logo-max-width');

describe('<ProductHome />', () => {
  const icon = jest.fn(() => null);
  const logo = jest.fn(() => null);

  describe('logoMaxWidth', () => {
    it('should set CSS variable with the provided value', () => {
      const { getByTestId } = render(
        <ProductHome
          icon={icon}
          logo={logo}
          testId={testId}
          logoMaxWidth={100}
        />,
      );
      const logoElement = getByTestId(logoTestId);
      expect(getLogoMaxWidthCSSVar(logoElement)).toBe('100px');
    });

    it('should be 260px by default', () => {
      const { getByTestId } = render(
        <ProductHome icon={icon} logo={logo} testId={testId} />,
      );
      const logoElement = getByTestId(logoTestId);
      expect(getLogoMaxWidthCSSVar(logoElement)).toBe('260px');
    });
  });
});

describe('<CustomProductHome />', () => {
  const iconUrl = 'fake-icon.png';
  const logoUrl = 'fake-logo.png';

  describe('logoMaxWidth', () => {
    it('should set max-width with the provided value', () => {
      const { getByTestId } = render(
        <CustomProductHome
          iconUrl={iconUrl}
          iconAlt=""
          logoUrl={logoUrl}
          logoAlt=""
          testId={testId}
          logoMaxWidth={100}
        />,
      );
      const logoElement = getByTestId(logoTestId);
      expect(logoElement.style.maxWidth).toEqual('100px');
    });

    it('should be 260px by default', () => {
      const { getByTestId } = render(
        <CustomProductHome
          iconUrl={iconUrl}
          iconAlt=""
          logoUrl={logoUrl}
          logoAlt=""
          testId={testId}
        />,
      );
      const logoElement = getByTestId(logoTestId);
      expect(logoElement.style.maxWidth).toEqual('260px');
    });
  });
});
