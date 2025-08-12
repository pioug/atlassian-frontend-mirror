/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';
import { fireEvent, render, screen } from '@testing-library/react';

import InteractionContext, { type InteractionContextType } from '@atlaskit/interaction-context';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import ButtonItem from '../../button-item';

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
		);

		expect(screen.getByTestId('link')).toHaveCompiledCss({ backgroundColor: 'red' });
		expect(screen.getByTestId('link')).toHaveCompiledCss({ color: 'currentColor' });
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

	ffTest.on('platform_dst_menu_item_button_aria_current', 'aria-current', () => {
		it('should convey selected state to screen readers using aria-current', () => {
			render(<ButtonItem isSelected>Hello world</ButtonItem>);

			expect(screen.getByRole('button')).toHaveAttribute('aria-current', 'true');
		});
	});
});
