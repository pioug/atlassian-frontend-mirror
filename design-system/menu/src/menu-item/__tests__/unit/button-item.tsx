/**
 * @jsxRuntime classic
 */
/** @jsx jsx */
import { createSerializer, matchers } from '@emotion/jest';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import { fireEvent, render } from '@testing-library/react';

import noop from '@atlaskit/ds-lib/noop';

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
		const { getByTestId } = render(
			<ButtonItem onClick={callback} testId="target">
				Hello world
			</ButtonItem>,
		);

		fireEvent.click(getByTestId('target'));

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

		const { getByTestId } = render(
			/* eslint-disable @atlaskit/design-system/consistent-css-prop-usage */
			// @ts-ignore
			<ButtonItem css={hackStyles} testId="link">
				Hello world
			</ButtonItem>,
			/* eslint-disable @atlaskit/design-system/consistent-css-prop-usage */
		);

		expect(getByTestId('link')).toHaveStyleRule('background-color', 'red');
		expect(getByTestId('link')).toHaveStyleRule('color', 'currentColor');
	});

	// This behaviour exists only as a side effect for spread props.
	// When we remove the ability for spread props in a future major version
	// This test can be deleted.
	it('should take a data-testid directly', () => {
		const { getByTestId } = render(<ButtonItem data-testid="link">Hello world</ButtonItem>);

		expect(getByTestId('link')).toBeInTheDocument();
	});

	it('should not gain focus on mouse down when it had no initial focus', () => {
		const { getByTestId } = render(
			<div>
				<button type="button" data-testid="focused-button">
					Button
				</button>
				<ButtonItem testId="target">Hello world</ButtonItem>,
			</div>,
		);

		getByTestId('focused-button').focus();
		expect(getByTestId('focused-button')).toHaveFocus();
		const allowed: boolean = fireEvent.mouseDown(getByTestId('target'));

		// target didn't get focus
		expect(getByTestId('target')).not.toHaveFocus();
		// mousedown event not prevented
		expect(allowed).toBe(true);
	});

	it('should persist focus if it was focused during mouse down', () => {
		const { getByTestId } = render(<ButtonItem testId="target">Hello world</ButtonItem>);

		getByTestId('target').focus();
		fireEvent.mouseDown(getByTestId('target'));

		expect(getByTestId('target') === document.activeElement).toBe(true);
	});

	it('should callback to user supplied mouse down prop', () => {
		const onMouseDown = jest.fn();
		const { getByTestId } = render(
			<ButtonItem onMouseDown={onMouseDown} testId="target">
				Hello world
			</ButtonItem>,
		);

		fireEvent.mouseDown(getByTestId('target'));

		expect(onMouseDown).toHaveBeenCalled();
	});

	it('should not callback on click when disabled', () => {
		const callback = jest.fn();
		const { getByTestId } = render(
			<ButtonItem isDisabled onClick={callback} testId="target">
				Hello world
			</ButtonItem>,
		);

		fireEvent.click(getByTestId('target'));

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
});
