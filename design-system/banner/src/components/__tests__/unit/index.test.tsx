import React from 'react';

import { render, within } from '@testing-library/react';
import { axe, JestAxeConfigureOptions, toHaveNoViolations } from 'jest-axe';

import Banner from '../../banner';

const axeRules: JestAxeConfigureOptions = {
  rules: {
    'color-contrast': { enabled: false },
  },
  resultTypes: ['violations', 'incomplete'],
};

expect.extend(toHaveNoViolations);

describe('banner', () => {
  it('basic sanity check', () => {
    const { getByTestId } = render(<Banner testId="banner-basic" />);
    const banner = getByTestId('banner-basic');

    expect(banner).toBeDefined();
  });

  describe('props', () => {
    it('should render children prop', () => {
      const { getByTestId } = render(
        <Banner testId="banner-text">Testing!</Banner>,
      );
      const { getByText } = within(getByTestId('banner-text'));

      expect(getByText('Testing!')).toBeInTheDocument();
    });
  });

  describe('isOpen max-height', () => {
    it('should have max-height 0 when isOpen is not set', () => {
      const { getByTestId } = render(<Banner testId="banner-closed" />);
      expect(getByTestId('banner-closed')).toHaveStyle('max-height: 0px');
    });
  });

  describe('a11y', () => {
    it('should not fail an aXe audit', async () => {
      const { getByTestId } = render(
        <Banner testId="banner-announcement" appearance="announcement" />,
      );
      const results = await axe(getByTestId('banner-announcement'), axeRules);

      expect(results).toHaveNoViolations();
    });

    it('should have role=alert and aria-hidden=true by default', () => {
      const { getByTestId } = render(<Banner testId="banner" />);
      const { getByRole } = within(getByTestId('banner'));
      const banner = getByRole('alert');

      expect(banner).toBeInTheDocument(); // check role=alert
      expect(banner).toHaveAttribute('aria-hidden', 'true');
    });

    it('should be aria-hidden=true when isOpen is false', () => {
      const { getByTestId } = render(<Banner testId="banner" />);
      const { getByRole } = within(getByTestId('banner'));

      expect(getByRole('alert')).toHaveAttribute('aria-hidden', 'true');
    });

    it('should have role=alert when appearance is "error"', () => {
      const { getByTestId } = render(
        <Banner testId="banner" appearance="error" />,
      );
      const { getByRole } = within(getByTestId('banner'));

      expect(getByRole('alert')).toBeInTheDocument();
    });

    it('should have correct a11y props when appearance is "announcement"', () => {
      const { getByTestId } = render(
        <Banner testId="banner" appearance="announcement" isOpen />,
      );
      const { getByRole } = within(getByTestId('banner'));
      const banner = getByRole('region');

      expect(banner).toBeInTheDocument(); // check role=region
      expect(banner).toHaveAttribute('tabindex', '0');
      expect(banner).toHaveAttribute('aria-label', 'announcement');
      expect(banner).toHaveAttribute('aria-hidden', 'false');
    });
  });
});
