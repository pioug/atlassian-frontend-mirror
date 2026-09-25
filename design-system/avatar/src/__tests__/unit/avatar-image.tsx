import React from 'react';

import cases from 'jest-in-case';

import { fireEvent, render, screen } from '@atlassian/testing-library';

import AvatarImage from '../../internal/avatar-image';
import { type SizeType } from '../../types';

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('AvatarImage', () => {
	it('should display the default avatar if no image is provided', () => {
		render(<AvatarImage appearance="circle" size="large" alt="Carole Baskin" testId="avatar" />);

		const svgElement = screen.getByTestId('avatar--person');

		expect(svgElement).toHaveAttribute('aria-label', 'Carole Baskin');
	});

	it('should display the default square avatar if appearance is square and no image is provided', () => {
		render(<AvatarImage appearance="square" size="large" alt="Carole Baskin" testId="avatar" />);

		const svgElement = screen.getByTestId('avatar--ship');

		expect(svgElement).toHaveAttribute('aria-label', 'Carole Baskin');
	});

	it('should display the default avatar if image is provided and fails to load', () => {
		render(
			<AvatarImage
				appearance="circle"
				size="large"
				alt="Carole Baskin"
				testId="avatar"
				src="thisisnotanimage"
			/>,
		);

		fireEvent.error(screen.getByTestId('avatar--image'));
		const svgElement = screen.getByTestId('avatar--person');
		expect(svgElement).toHaveAttribute('aria-label', 'Carole Baskin');
	});

	it('should display the default square avatar if image is provided and fails to load', () => {
		render(
			<AvatarImage
				appearance="square"
				size="large"
				alt="Carole Baskin"
				testId="avatar"
				src="thisisnotanimage"
			/>,
		);

		fireEvent.error(screen.getByTestId('avatar--image'));
		const svgElement = screen.getByTestId('avatar--ship');
		expect(svgElement).toHaveAttribute('aria-label', 'Carole Baskin');
	});

	it('should reset error state if `src` prop is updated', () => {
		const { rerender } = render(
			<AvatarImage
				appearance="circle"
				size="large"
				alt="Carole Baskin"
				testId="avatar"
				src="thisisnotanimage"
			/>,
		);

		fireEvent.error(screen.getByTestId('avatar--image'));
		const svgElement = screen.getByTestId('avatar--person');
		expect(svgElement).toHaveAttribute('aria-label', 'Carole Baskin');

		rerender(
			<AvatarImage
				appearance="circle"
				size="large"
				alt="Carole Baskin"
				testId="avatar"
				src="data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs="
			/>,
		);

		// After rerender on prop change we should no longer get the default SVG with aria-label
		expect(() => {
			const svgElement = screen.getByTestId('avatar--person');
			expect(svgElement).toHaveAttribute('aria-label', 'Carole Baskin');
		}).toThrow();
		// Instead we should see an img with an alt
		const imgElement = screen.getByTestId('avatar--image');
		expect(imgElement).toHaveAttribute('alt', 'Carole Baskin');
	});

	describe('UNSAFE_isUpdatedGeometry', () => {
		type SupportedSizeCase = {
			size: Extract<SizeType, 'xxsmall' | 'small' | 'medium' | 'large' | 'xlarge' | 'xxlarge'>;
			width: number;
			height: number;
		};

		// Mirrors the literal `updatedHexagonDimensionMap` in `../../avatar-content.tsx` (the sole
		// source of truth for these values).
		const supportedSizes: SupportedSizeCase[] = [
			{ size: 'xxsmall', width: 15.4, height: 17.17 },
			{ size: 'small', width: 23.11, height: 25.76 },
			{ size: 'medium', width: 30.81, height: 34.34 },
			{ size: 'large', width: 38.51, height: 42.93 },
			{ size: 'xlarge', width: 92.43, height: 103.02 },
			{ size: 'xxlarge', width: 123.24, height: 137.36 },
		];

		// The compiled CSS pipeline may canonicalize lengths to `pt`/`pc` when shorter than `px`
		// (e.g. `124px` -> `93pt`), so convert whatever unit was extracted back to a px number
		// rather than asserting on the raw compiled unit string.
		const toPx = (value: string): number => {
			const match = value.trim().match(/^(-?\d*\.?\d+)(px|pt|pc)$/);
			if (!match) {
				throw new Error(`Unexpected CSS length "${value}"`);
			}
			const [, rawNumber, unit] = match;
			const number = parseFloat(rawNumber);
			// Round to avoid floating-point drift introduced by the pt/pc round-trip (e.g.
			// `92.43pt` -> `123.24000000000001`).
			if (unit === 'pt') {
				return Math.round(((number * 4) / 3) * 100) / 100;
			}
			if (unit === 'pc') {
				return Math.round(number * 16 * 100) / 100;
			}
			return number;
		};

		// `nestedSvgStylesMap`/`updatedHexagonNestedSvgStylesMap` size the icon glyph via a nested
		// `& svg` descendant selector on the icon wrapper `<span>`, rather than a property directly
		// on that span — so we read the actual compiled stylesheet for the wrapper's resolved
		// classes instead of `getComputedStyle`, since jsdom does not reliably resolve cascade
		// specificity across descendant selectors from multiple stylesheets.
		const getResolvedNestedSvgSize = (iconWrapper: HTMLElement) => {
			// Reading the injected Compiled <style> tags directly is the only way to inspect a nested
			// `& svg` descendant selector's declaration; there is no Testing Library query for
			// stylesheet contents.
			// eslint-disable-next-line testing-library/no-node-access
			const styleText = Array.from(document.querySelectorAll('style'))
				.map((styleElement) => styleElement.textContent ?? '')
				.join('\n');
			const classNames = iconWrapper.className.split(' ').filter(Boolean);

			let width: number | undefined;
			let height: number | undefined;
			for (const className of classNames) {
				const widthMatch = styleText.match(
					new RegExp(`\\.${className}\\s+svg\\{width:([^;}]+)\\}`),
				);
				const heightMatch = styleText.match(
					new RegExp(`\\.${className}\\s+svg\\{height:([^;}]+)\\}`),
				);
				if (widthMatch) {
					width = toPx(widthMatch[1]);
				}
				if (heightMatch) {
					height = toPx(heightMatch[1]);
				}
			}
			return { width, height };
		};

		cases(
			'should scale the fallback icon glyph to match the updated hexagon geometry',
			({ size, width, height }: SupportedSizeCase) => {
				render(
					<AvatarImage
						appearance="hexagon"
						size={size}
						alt="Agent"
						testId="avatar"
						UNSAFE_isUpdatedGeometry
					/>,
				);

				// The icon wrapper `<span>` (which carries the nested svg-sizing styles under test) has
				// no dedicated testId of its own; it's the immediate parent of the icon's testId'd element.
				// eslint-disable-next-line testing-library/no-node-access
				const iconWrapper = screen.getByTestId('avatar--agent').parentElement as HTMLElement;

				expect(getResolvedNestedSvgSize(iconWrapper)).toEqual({ width, height });
			},
			supportedSizes,
		);

		it('should preserve the legacy icon glyph size when the prop is not set', () => {
			render(<AvatarImage appearance="hexagon" size="xxlarge" alt="Agent" testId="avatar" />);

			// eslint-disable-next-line testing-library/no-node-access
			const iconWrapper = screen.getByTestId('avatar--agent').parentElement as HTMLElement;

			expect(getResolvedNestedSvgSize(iconWrapper)).toEqual({ width: 128, height: 128 });
		});
	});
});

it('image should be decorative when no alt is provided', () => {
	Object.defineProperty(Image.prototype, 'src', {
		set() {
			this.onload?.();
		},
	});

	render(<AvatarImage appearance="circle" size="large" testId="avatar" src="thisisanimage" />);

	const avatar = screen.getByTestId('avatar--image');
	expect(avatar).toHaveAttribute('alt');
	expect(avatar).toHaveAttribute('alt', '');
});

it('image should be hidden from assistive technology if no or empty alt is provided', () => {
	const imageSrc = 'data:image/png;base64,';

	render(<AvatarImage appearance="circle" size="large" testId="avatar" src={imageSrc} />);

	const avatar = screen.getByTestId('avatar--image');
	expect(avatar).toHaveAttribute('aria-hidden', 'true');
});

it('should display image if provided and successfully loads', () => {
	render(
		<AvatarImage
			appearance="square"
			size="large"
			alt="Carole Baskin"
			testId="avatar"
			src="data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs="
		/>,
	);

	const imgElement = screen.getByTestId('avatar--image');
	expect(imgElement).toHaveAttribute('alt', 'Carole Baskin');
});

it('should render images on the first tick if they were cached', () => {
	let hasCalledOnLoad = false;

	Object.defineProperty(Image.prototype, 'complete', {
		get() {
			return true;
		},
	});

	Object.defineProperty(Image.prototype, 'src', {
		set() {
			// The onload callback call will take at least one tick.
			// If the complete property wasn't checked synchronously in the component this test
			// would fail.
			process.nextTick(() => {
				hasCalledOnLoad = true;
				this.onload?.();
			});
		},
	});

	render(
		<AvatarImage
			appearance="square"
			size="large"
			alt="Carole Baskin"
			testId="avatar"
			src="data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs="
		/>,
	);

	expect(hasCalledOnLoad).toEqual(false);

	const imgElement = screen.getByTestId('avatar--image');
	expect(imgElement).toHaveAttribute('alt', 'Carole Baskin');
});
