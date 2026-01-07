import React from 'react';

import { type VirtualElement } from '@popperjs/core';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import __noop from '@atlaskit/ds-lib/noop';

import { Popper } from '../../index';

const user = userEvent.setup();

jest.mock('popper.js', () => {
	const PopperJS = jest.requireActual('popper.js');

	return class Popper {
		static placements = PopperJS.placements;

		constructor() {
			return {
				destroy: __noop,
				scheduleUpdate: __noop,
			};
		}
	};
});

class VirtualReference implements VirtualElement {
	getBoundingClientRect(): DOMRect {
		return {
			top: 10,
			left: 10,
			bottom: 20,
			right: 100,
			width: 90,
			height: 10,
			x: 0,
			y: 0,
			toJSON: __noop,
		};
	}
}

const virtualReferenceElement = new VirtualReference();
const referenceElement = document.createElement('button');

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('Popper', () => {
	it('should render Popper', async () => {
		render(
			<Popper>
				{({ ref, style, placement, arrowProps }) => (
					<div
						ref={ref}
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						style={style}
						data-placement={placement}
						data-testid="popper"
					>
						<div {...arrowProps} />
					</div>
				)}
			</Popper>,
		);

		expect(screen.getByTestId('popper')).toBeInTheDocument();
	});

	it('should position popper relatively to refrence element', async () => {
		render(
			<>
				<Popper referenceElement={virtualReferenceElement} placement="bottom-end">
					{({ ref, style, placement, arrowProps }) => (
						<div
							ref={ref}
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							style={style}
							data-placement={placement}
							data-testid="popper"
						>
							<div {...arrowProps} />
						</div>
					)}
				</Popper>
			</>,
		);

		const popper = screen.getByTestId('popper');

		await user.click(popper);

		// 100px, 20px + 8px offset
		expect(screen.getByTestId('popper')).toHaveStyle('transform: translate(100px, 28px)');
		expect(screen.getByTestId('popper').childNodes[0]).toHaveStyle(
			'transform: translate(0px, 0px)',
		);
	});

	it('should render children with provided content', () => {
		const Content = () => <div>Content</div>;

		render(
			<Popper>
				{({ ref, style, placement }) => (
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					<div ref={ref} style={style} data-placement={placement}>
						<Content />
					</div>
				)}
			</Popper>,
		);

		expect(screen.getByText('Content')).toBeInTheDocument();
	});

	describe('should apply correct modifiers', () => {
		it('with default props', () => {
			render(
				<Popper referenceElement={referenceElement}>
					{({ ref, style, placement, arrowProps }) => (
						<div
							ref={ref}
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							style={style}
							data-placement={placement}
							data-testid="popper"
						>
							<div {...arrowProps} />
						</div>
					)}
				</Popper>,
			);

			expect(screen.getByTestId('popper')).toHaveStyle('position: fixed');
		});

		it('with offset props', async () => {
			render(
				<Popper referenceElement={virtualReferenceElement} offset={[16, 16]} placement="bottom-end">
					{({ ref, style, placement, arrowProps }) => (
						<div
							ref={ref}
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							style={style}
							data-placement={placement}
							data-testid="popper"
						>
							<div {...arrowProps} />
						</div>
					)}
				</Popper>,
			);

			await user.click(screen.getByTestId('popper'));

			const popper = screen.getByTestId('popper');

			expect(popper).toHaveStyle('position: fixed');
			// 100px + 16px, 20px + 16px
			expect(popper).toHaveStyle('transform: translate(116px, 36px)');
		});

		it('with custom modifiers props', async () => {
			const modifiers = [
				{
					name: 'offset',
					enabled: true,
					options: {
						offset: [8, 8],
					},
				},
			];

			render(
				<Popper referenceElement={referenceElement} modifiers={modifiers}>
					{({ ref, style, placement, arrowProps }) => (
						<div
							ref={ref}
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							style={style}
							data-placement={placement}
							data-testid="popper"
						>
							<div {...arrowProps} />
						</div>
					)}
				</Popper>,
			);

			await user.click(screen.getByTestId('popper'));

			expect(screen.getByTestId('popper')).toHaveStyle('position: fixed');
			expect(screen.getByTestId('popper')).toHaveStyle('transform: translate(8px, 8px)');
		});

		it('with offset and modifiers props, modifiers should have higher priority', async () => {
			const modifiers = [
				{
					name: 'offset',
					enabled: false,
				},
			];

			render(
				<Popper referenceElement={referenceElement} offset={[10, 10]} modifiers={modifiers}>
					{({ ref, style, placement, arrowProps }) => (
						<div
							ref={ref}
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							style={style}
							data-placement={placement}
							data-testid="popper"
						>
							<div {...arrowProps} />
						</div>
					)}
				</Popper>,
			);

			await user.click(screen.getByTestId('popper'));

			expect(screen.getByTestId('popper')).toHaveStyle('position: fixed');
			expect(screen.getByTestId('popper')).toHaveStyle('transform: translate(0px, 0px)');
		});

		it('should be positioned absolutely if strategy is set to absolute', async () => {
			render(
				<Popper referenceElement={referenceElement} strategy="absolute">
					{({ ref, style, placement, arrowProps }) => (
						<div
							ref={ref}
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							style={style}
							data-placement={placement}
							data-testid="popper"
						>
							<div {...arrowProps} />
						</div>
					)}
				</Popper>,
			);

			await user.click(screen.getByTestId('popper'));

			expect(screen.getByTestId('popper')).toHaveStyle('position: absolute');
		});
	});
});
