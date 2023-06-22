/** @jsx jsx */
import { jsx } from '@emotion/react';
import { render } from '@testing-library/react';
import { axe, JestAxeConfigureOptions, toHaveNoViolations } from 'jest-axe';

import ButtonGroup from '../../button-group';
import CustomThemeButton from '../../custom-theme-button';
import Button from '../../index';
import LoadingButton from '../../loading-button';

expect.extend(toHaveNoViolations);

const axeRules: JestAxeConfigureOptions = {
  rules: {
    // As we're testing on the JSDOM, color-contrast testing can't run.
    'color-contrast': { enabled: false },
  },
  // The types of results fetched are limited for performance reasons
  resultTypes: ['violations', 'incomplete', 'inapplicable'],
};

describe('Button component accessibility', () => {
  describe('Button', () => {
    it('should not fail an aXe audit', async () => {
      const { container } = render(<Button>Save</Button>);
      const results = await axe(container, axeRules);

      expect(results).toHaveNoViolations();
    });

    it('should not fail an aXe audit when isDisabled is true', async () => {
      const { container } = render(<Button isDisabled>Save</Button>);
      const results = await axe(container, axeRules);

      expect(results).toHaveNoViolations();
    });

    it('should not fail an aXe audit when isSelected is true', async () => {
      const { container } = render(<Button isSelected>Save</Button>);
      const results = await axe(container, axeRules);

      expect(results).toHaveNoViolations();
    });
  });

  describe('LoadingButton', () => {
    it('should not fail an aXe audit', async () => {
      const { container } = render(<LoadingButton>Save</LoadingButton>);
      const results = await axe(container, axeRules);

      expect(results).toHaveNoViolations();
    });

    it('should not fail an aXe audit when isLoading is true', async () => {
      const { container } = render(
        <LoadingButton isLoading>Save</LoadingButton>,
      );
      const results = await axe(container, axeRules);

      expect(results).toHaveNoViolations();
    });

    it('should have an aria-busy attribute that is set to false when isLoading is undefined', () => {
      const { getByTestId } = render(
        <LoadingButton testId="button">Hello</LoadingButton>,
      );

      const button = getByTestId('button');

      expect(button.getAttribute('aria-busy')).toBe('false');
    });

    it('should have an aria-busy attribute that is set to false when not loading', () => {
      const { getByTestId } = render(
        <LoadingButton testId="button" isLoading={false}>
          Hello
        </LoadingButton>,
      );

      const button = getByTestId('button');

      expect(button.getAttribute('aria-busy')).toBe('false');
    });

    it('should have an aria-busy attribute that is set to true when loading', () => {
      const { getByTestId } = render(
        <LoadingButton testId="button" isLoading={true}>
          Hello
        </LoadingButton>,
      );

      const button = getByTestId('button');

      expect(button.getAttribute('aria-busy')).toBe('true');
    });
  });

  describe('CustomThemeButton', () => {
    it('should not fail an aXe audit', async () => {
      const { container } = render(<CustomThemeButton>Save</CustomThemeButton>);
      const results = await axe(container, axeRules);

      expect(results).toHaveNoViolations();
    });

    it('should not fail an aXe audit when isLoading is true', async () => {
      const { container } = render(
        <CustomThemeButton isLoading>Save</CustomThemeButton>,
      );
      const results = await axe(container, axeRules);

      expect(results).toHaveNoViolations();
    });

    it('should have an aria-busy attribute that is set to false when isLoading is undefined', () => {
      const { getByTestId } = render(
        <CustomThemeButton testId="button">Hello</CustomThemeButton>,
      );

      const button = getByTestId('button');

      expect(button.getAttribute('aria-busy')).toBe('false');
    });

    it('should have an aria-busy attribute that is set to false when not loading', () => {
      const { getByTestId } = render(
        <CustomThemeButton testId="button" isLoading={false}>
          Hello
        </CustomThemeButton>,
      );

      const button = getByTestId('button');

      expect(button.getAttribute('aria-busy')).toBe('false');
    });

    it('should have an aria-busy attribute that is set to true when loading', () => {
      const { getByTestId } = render(
        <CustomThemeButton testId="button" isLoading={true}>
          Hello
        </CustomThemeButton>,
      );

      const button = getByTestId('button');

      expect(button.getAttribute('aria-busy')).toBe('true');
    });
  });

  describe('ButtonGroup', () => {
    it('should not fail an aXe audit', async () => {
      const screen = render(
        <ButtonGroup>
          <Button>Test button one</Button>
          <Button>Test button two</Button>
          <Button>Test button three</Button>
        </ButtonGroup>,
      );

      const results = await axe(screen.container, axeRules);

      expect(results).toHaveNoViolations();
    });
  });
});
