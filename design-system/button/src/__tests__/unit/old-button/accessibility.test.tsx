/**
 * @jsxRuntime classic
 */
/** @jsx jsx */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import { render, screen } from '@testing-library/react';

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
			const { container } = render(<LoadingButton isLoading>Save</LoadingButton>);
			await axe(container);
		});

		it('should not have an aria-disabled attribute that is set to false when isLoading is undefined', () => {
			render(<LoadingButton testId="button">Hello</LoadingButton>);

			const button = screen.getByTestId('button');

			expect(button).not.toHaveAttribute('aria-disabled');
		});

		it('should not have an aria-disabled attribute that is set to false when not loading', () => {
			render(
				<LoadingButton testId="button" isLoading={false}>
					Hello
				</LoadingButton>,
			);

			const button = screen.getByTestId('button');

			expect(button).not.toHaveAttribute('aria-disabled');
		});

		it('should have an aria-disabled attribute that is set to true when loading', () => {
			render(
				<LoadingButton testId="button" isLoading={true}>
					Hello
				</LoadingButton>,
			);

			const button = screen.getByTestId('button');

			expect(button).toHaveAttribute('aria-disabled', 'true');
		});
	});

	describe('CustomThemeButton', () => {
		it('should not fail an aXe audit', async () => {
			const { container } = render(<CustomThemeButton>Save</CustomThemeButton>);
			await axe(container);
		});

		it('should not fail an aXe audit when isLoading is true', async () => {
			const { container } = render(<CustomThemeButton isLoading>Save</CustomThemeButton>);
			await axe(container);
		});

		it('should not have an aria-disabled attribute that is set to false when isLoading is undefined', () => {
			render(<CustomThemeButton testId="button">Hello</CustomThemeButton>);

			const button = screen.getByTestId('button');

			expect(button).not.toHaveAttribute('aria-disabled');
		});

		it('should not have an aria-disabled attribute that is set to false when not loading', () => {
			render(
				<CustomThemeButton testId="button" isLoading={false}>
					Hello
				</CustomThemeButton>,
			);

			const button = screen.getByTestId('button');

			expect(button).not.toHaveAttribute('aria-disabled');
		});

		it('should have an aria-disabled attribute that is set to true when loading', () => {
			render(
				<CustomThemeButton testId="button" isLoading={true}>
					Hello
				</CustomThemeButton>,
			);

			const button = screen.getByTestId('button');

			expect(button).toHaveAttribute('aria-disabled', 'true');
		});

		// Although we would prefer makers to use the `isDisabled` prop,
		// this was functional until we accidentally removed the behaviour
		// in a patch release. Adding back for now.
		it('should set aria-disabled to true if explicitly set by maker using a string', () => {
			render(
				<CustomThemeButton testId="button" aria-disabled="true">
					Hello
				</CustomThemeButton>,
			);

			const button = screen.getByTestId('button');

			expect(button).toHaveAttribute('aria-disabled', 'true');
		});

		it('should set aria-disabled to true if explicitly set by maker using a boolean', () => {
			render(
				<CustomThemeButton testId="button" aria-disabled>
					Hello
				</CustomThemeButton>,
			);

			const button = screen.getByTestId('button');

			expect(button).toHaveAttribute('aria-disabled', 'true');
		});

		it('should set aria-disabled to false if explicitly set by maker using a string', () => {
			render(
				<CustomThemeButton testId="button" aria-disabled="false">
					Hello
				</CustomThemeButton>,
			);

			const button = screen.getByTestId('button');

			expect(button).toHaveAttribute('aria-disabled', 'false');
		});

		it('should set aria-disabled to false if explicitly set by maker using a boolean', () => {
			render(
				<CustomThemeButton testId="button" aria-disabled={false}>
					Hello
				</CustomThemeButton>,
			);

			const button = screen.getByTestId('button');

			expect(button).toHaveAttribute('aria-disabled', 'false');
		});

		it('should not set aria-disabled if omitted', () => {
			render(<CustomThemeButton testId="button">Hello</CustomThemeButton>);

			const button = screen.getByTestId('button');

			expect(button).not.toHaveAttribute('aria-disabled');
		});
	});

	describe('ButtonGroup', () => {
		it('should not fail an aXe audit', async () => {
			const { container } = render(
				<ButtonGroup>
					<Button>Test button one</Button>
					<Button>Test button two</Button>
					<Button>Test button three</Button>
				</ButtonGroup>,
			);

			await axe(container);
		});
	});
});
