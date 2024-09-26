/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { createSerializer, matchers } from '@emotion/jest';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import { fireEvent, render, screen } from '@testing-library/react';

import noop from '@atlaskit/ds-lib/noop';
import InteractionContext, { type InteractionContextType } from '@atlaskit/interaction-context';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import type { CSSFn } from '../../../types';
import ButtonItem from '../../button-item';

expect.addSnapshotSerializer(createSerializer());
expect.extend(matchers);

window.requestAnimationFrame = (cb) => {
	cb(-1);
	return -1;
};

describe('<ButtonItem />', () => {
	it('should callback on click', () => {
		const callback = jest.fn();
		render(
			<ButtonItem onClick={callback} testId="target">
				Hello world
			</ButtonItem>,
		);

		fireEvent.click(screen.getByTestId('target'));

		expect(callback).toHaveBeenCalled();
	});

	// The purpose of this test is to confirm that this functionality still
	// works as expected. We **do not** want people to use this. You can see
	// that TS throws that `css` doesn't exist in the allowed props. This is
	// desired and expected.
	//
	// TL;DR: we don't want you to use it (type fail), but if you're already using it, it should work
	it('should override styles without stripping them', () => {
		const hackStyles = css({
			backgroundColor: 'red',
		});

		render(
			/* eslint-disable @atlaskit/design-system/consistent-css-prop-usage */
			// @ts-ignore
			<ButtonItem css={hackStyles} testId="link">
				Hello world
			</ButtonItem>,
			/* eslint-disable @atlaskit/design-system/consistent-css-prop-usage */
		);

		expect(screen.getByTestId('link')).toHaveStyleRule('background-color', 'red');
		expect(screen.getByTestId('link')).toHaveStyleRule('color', 'currentColor');
	});

	// This behaviour exists only as a side effect for spread props.
	// When we remove the ability for spread props in a future major version
	// This test can be deleted.
	it('should take a data-testid directly', () => {
		render(<ButtonItem data-testid="link">Hello world</ButtonItem>);

		expect(screen.getByTestId('link')).toBeInTheDocument();
	});

	it('should not gain focus on mouse down when it had no initial focus', () => {
		render(
			<div>
				<button type="button" data-testid="focused-button">
					Button
				</button>
				<ButtonItem testId="target">Hello world</ButtonItem>,
			</div>,
		);

		screen.getByTestId('focused-button').focus();
		expect(screen.getByTestId('focused-button')).toHaveFocus();
		const allowed: boolean = fireEvent.mouseDown(screen.getByTestId('target'));

		// target didn't get focus
		expect(screen.getByTestId('target')).not.toHaveFocus();
		// mousedown event not prevented
		expect(allowed).toBe(true);
	});

	it('should persist focus if it was focused during mouse down', () => {
		render(<ButtonItem testId="target">Hello world</ButtonItem>);

		screen.getByTestId('target').focus();
		fireEvent.mouseDown(screen.getByTestId('target'));
		expect(screen.getByTestId('target')).toHaveFocus();
	});

	it('should callback to user supplied mouse down prop', () => {
		const onMouseDown = jest.fn();
		render(
			<ButtonItem onMouseDown={onMouseDown} testId="target">
				Hello world
			</ButtonItem>,
		);

		fireEvent.mouseDown(screen.getByTestId('target'));

		expect(onMouseDown).toHaveBeenCalled();
	});

	it('should not callback on click when disabled', () => {
		const callback = jest.fn();
		render(
			<ButtonItem isDisabled onClick={callback} testId="target">
				Hello world
			</ButtonItem>,
		);

		fireEvent.click(screen.getByTestId('target'));

		expect(callback).not.toHaveBeenCalled();
	});

	it('should respect the cssFn prop', () => {
		const customCssSelected = { border: '1px solid' };
		const customCssDisabled = { pointerEvents: 'none' as const };
		const customCss = {
			padding: '10px',
			opacity: 0.75,
			borderRadius: '5px',
		};

		const cssFn: CSSFn = (state) => {
			return {
				...(state.isSelected && customCssSelected),
				...(state.isDisabled && customCssDisabled),
				...customCss,
			};
		};

		const { container } = render(
			<ButtonItem
				// eslint-disable-next-line @repo/internal/react/no-unsafe-overrides
				cssFn={cssFn}
				isSelected
				isDisabled
				onClick={noop}
			>
				Helloo
			</ButtonItem>,
		);

		expect(container.firstChild).toHaveStyleRule('padding', customCss.padding);
		expect(container.firstChild).toHaveStyleRule('opacity', String(customCss.opacity));
		expect(container.firstChild).toHaveStyleRule('border-radius', customCss.borderRadius);
		expect(container.firstChild).toHaveStyleRule('border', customCssSelected.border);
		expect(container.firstChild).toHaveStyleRule('pointer-events', customCssDisabled.pointerEvents);
	});

	ffTest.on(
		'platform_button_item-add-ufo-metrics',
		'with ufo interaction metrics FG enabled',
		() => {
			it('should callback on click', () => {
				const callback = jest.fn();
				render(
					<ButtonItem onClick={callback} testId="target">
						Hello world
					</ButtonItem>,
				);

				fireEvent.click(screen.getByTestId('target'));

				expect(callback).toHaveBeenCalled();
			});

			it('should call UFO interaction metrics on click', () => {
				const mockTraceInteraction = jest.fn();
				const mockHold = jest.fn();

				const context: InteractionContextType = {
					hold: mockHold,
					tracePress: mockTraceInteraction,
				};

				const interactionName = 'ufo-interaction-name';

				render(
					<InteractionContext.Provider value={context}>
						<ButtonItem interactionName={interactionName} testId="target">
							Hello world
						</ButtonItem>
						,
					</InteractionContext.Provider>,
				);

				fireEvent.click(screen.getByTestId('target'));
				expect(mockTraceInteraction).toHaveBeenCalledTimes(1);
				expect(mockTraceInteraction).toHaveBeenCalledWith(interactionName, expect.any(Number));
			});

			// The purpose of this test is to confirm that this functionality still
			// works as expected. We **do not** want people to use this. You can see
			// that TS throws that `css` doesn't exist in the allowed props. This is
			// desired and expected.
			//
			// TL;DR: we don't want you to use it (type fail), but if you're already using it, it should work
			it('should override styles without stripping them', () => {
				const hackStyles = css({
					backgroundColor: 'red',
				});

				render(
					/* eslint-disable @atlaskit/design-system/consistent-css-prop-usage */
					// @ts-ignore
					<ButtonItem css={hackStyles} testId="link">
						Hello world
					</ButtonItem>,
					/* eslint-disable @atlaskit/design-system/consistent-css-prop-usage */
				);

				expect(screen.getByTestId('link')).toHaveStyleRule('background-color', 'red');
				expect(screen.getByTestId('link')).toHaveStyleRule('color', 'currentColor');
			});

			// This behaviour exists only as a side effect for spread props.
			// When we remove the ability for spread props in a future major version
			// This test can be deleted.
			it('should take a data-testid directly', () => {
				render(<ButtonItem data-testid="link">Hello world</ButtonItem>);

				expect(screen.getByTestId('link')).toBeInTheDocument();
			});

			it('should not gain focus on mouse down when it had no initial focus', () => {
				render(
					<div>
						<button type="button" data-testid="focused-button">
							Button
						</button>
						<ButtonItem testId="target">Hello world</ButtonItem>,
					</div>,
				);

				screen.getByTestId('focused-button').focus();
				expect(screen.getByTestId('focused-button')).toHaveFocus();
				const allowed: boolean = fireEvent.mouseDown(screen.getByTestId('target'));

				// target didn't get focus
				expect(screen.getByTestId('target')).not.toHaveFocus();
				// mousedown event not prevented
				expect(allowed).toBe(true);
			});

			it('should persist focus if it was focused during mouse down', () => {
				render(<ButtonItem testId="target">Hello world</ButtonItem>);

				screen.getByTestId('target').focus();
				fireEvent.mouseDown(screen.getByTestId('target'));
				expect(screen.getByTestId('target')).toHaveFocus();
			});

			it('should callback to user supplied mouse down prop', () => {
				const onMouseDown = jest.fn();
				render(
					<ButtonItem onMouseDown={onMouseDown} testId="target">
						Hello world
					</ButtonItem>,
				);

				fireEvent.mouseDown(screen.getByTestId('target'));

				expect(onMouseDown).toHaveBeenCalled();
			});

			it('should not callback on click when disabled', () => {
				const callback = jest.fn();
				render(
					<ButtonItem isDisabled onClick={callback} testId="target">
						Hello world
					</ButtonItem>,
				);

				fireEvent.click(screen.getByTestId('target'));

				expect(callback).not.toHaveBeenCalled();
			});

			it('should respect the cssFn prop', () => {
				const customCssSelected = { border: '1px solid' };
				const customCssDisabled = { pointerEvents: 'none' as const };
				const customCss = {
					padding: '10px',
					opacity: 0.75,
					borderRadius: '5px',
				};

				const cssFn: CSSFn = (state) => {
					return {
						...(state.isSelected && customCssSelected),
						...(state.isDisabled && customCssDisabled),
						...customCss,
					};
				};

				const { container } = render(
					<ButtonItem
						// eslint-disable-next-line @repo/internal/react/no-unsafe-overrides
						cssFn={cssFn}
						isSelected
						isDisabled
						onClick={noop}
					>
						Helloo
					</ButtonItem>,
				);

				expect(container.firstChild).toHaveStyleRule('padding', customCss.padding);
				expect(container.firstChild).toHaveStyleRule('opacity', String(customCss.opacity));
				expect(container.firstChild).toHaveStyleRule('border-radius', customCss.borderRadius);
				expect(container.firstChild).toHaveStyleRule('border', customCssSelected.border);
				expect(container.firstChild).toHaveStyleRule(
					'pointer-events',
					customCssDisabled.pointerEvents,
				);
			});
		},
	);
});
