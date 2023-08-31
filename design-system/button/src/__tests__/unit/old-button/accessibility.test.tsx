/** @jsx jsx */
import { jsx } from '@emotion/react';
import { render } from '@testing-library/react';

import { axe } from '@af/accessibility-testing';

import ButtonGroup from '../../../containers/button-group';
import Button from '../../../index';
import CustomThemeButton from '../../../old-button/custom-theme-button';
import LoadingButton from '../../../old-button/loading-button';

describe('Button component accessibility', () => {
  describe('Button', () => {
    it('should not fail an aXe audit', async () => {
      const { container } = render(<Button>Save</Button>);
      await axe(container);
    });

    it('should not fail an aXe audit when isDisabled is true', async () => {
      const { container } = render(<Button isDisabled>Save</Button>);
      await axe(container);
    });

    it('should not fail an aXe audit when isSelected is true', async () => {
      const { container } = render(<Button isSelected>Save</Button>);
      await axe(container);
    });
  });

  describe('LoadingButton', () => {
    it('should not fail an aXe audit', async () => {
      const { container } = render(<LoadingButton>Save</LoadingButton>);
      await axe(container);
    });

    it('should not fail an aXe audit when isLoading is true', async () => {
      const { container } = render(
        <LoadingButton isLoading>Save</LoadingButton>,
      );
      await axe(container);
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
      await axe(container);
    });

    it('should not fail an aXe audit when isLoading is true', async () => {
      const { container } = render(
        <CustomThemeButton isLoading>Save</CustomThemeButton>,
      );
      await axe(container);
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

      await axe(screen.container);
    });
  });
});
