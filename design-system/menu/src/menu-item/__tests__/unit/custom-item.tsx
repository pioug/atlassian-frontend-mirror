/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { createSerializer, matchers } from '@emotion/jest';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import { fireEvent, render, screen } from '@testing-library/react';
import { HashRouter, Link } from 'react-router-dom';

import type { CSSFn, CustomItemComponentProps } from '../../../types';
import CustomItem from '../../custom-item';

expect.addSnapshotSerializer(createSerializer());
expect.extend(matchers);

window.requestAnimationFrame = (cb) => {
	cb(-1);
	return -1;
};

describe('<CustomItem />', () => {
	const Component = (props: CustomItemComponentProps) => (
		// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
		<button type="button" {...props} />
	);

	it('should callback on click', () => {
		const callback = jest.fn();
		render(
			<CustomItem component={Component} onClick={callback} testId="target">
				Hello world
			</CustomItem>,
		);

		fireEvent.click(screen.getByTestId('target'));

		expect(callback).toHaveBeenCalled();
	});

	// This behaviour exists only as a side effect for spread props.
	// When we remove the ability for spread props in a future major version
	// This test can be deleted.
	it('should take a data-testid directly', () => {
		render(
			<CustomItem component={Component} data-testid="link">
				Hello world
			</CustomItem>,
		);

		expect(screen.getByTestId('link')).toBeInTheDocument();
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
			<CustomItem component={Component} css={hackStyles} testId="link">
				Hello world
			</CustomItem>,
			/* eslint-disable @atlaskit/design-system/consistent-css-prop-usage */
		);

		expect(screen.getByTestId('link')).toHaveStyleRule('background-color', 'red');
		expect(screen.getByTestId('link')).toHaveStyleRule('color', 'currentColor');
	});

	it('should not gain focus on mouse down when it had no initial focus', () => {
		render(
			<div>
				<button type="button" data-testid="focused-button">
					Button
				</button>
				<CustomItem component={Component} testId="target">
					Hello world
				</CustomItem>
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
		render(
			<CustomItem component={Component} testId="target">
				Hello world
			</CustomItem>,
		);

		screen.getByTestId('target').focus();
		fireEvent.mouseDown(screen.getByTestId('target'));
		expect(screen.getByTestId('target')).toHaveFocus();
	});

	it('should callback to user supplied mouse down prop', () => {
		const onMouseDown = jest.fn();
		render(
			<CustomItem component={Component} onMouseDown={onMouseDown} testId="target">
				Hello world
			</CustomItem>,
		);

		fireEvent.mouseDown(screen.getByTestId('target'));

		expect(onMouseDown).toHaveBeenCalled();
	});

	it('should not callback on click when disabled', () => {
		const callback = jest.fn();
		render(
			<CustomItem component={Component} isDisabled onClick={callback} testId="target">
				Hello world
			</CustomItem>,
		);

		fireEvent.click(screen.getByTestId('target'));

		expect(callback).not.toHaveBeenCalled();
	});

	it('should respect the cssFn prop', () => {
		const customCss: CSSFn = (state) => ({
			...(state.isSelected && { border: '1px solid' }),
			...(state.isDisabled && { pointerEvents: 'none' as const }),
			padding: '10px',
			opacity: 0.75,
			borderRadius: '5px',
		});
		render(
			<CustomItem
				component={Component}
				testId="component"
				// eslint-disable-next-line @repo/internal/react/no-unsafe-overrides
				cssFn={customCss}
				isSelected
				isDisabled
			>
				Helloo
			</CustomItem>,
		);
		const component = screen.getByTestId('component');

		expect(component).toHaveStyleRule('padding', '10px');
		expect(component).toHaveStyleRule('opacity', '0.75');
		expect(component).toHaveStyleRule('border-radius', '5px');
		expect(component).toHaveStyleRule('border', '1px solid');
	});

	it('should prevent dragging so the transparent artefact isnt shown', () => {
		// Return if default was prevented which we will then assert later
		const dragStartEvent = jest.fn((e) => e.defaultPrevented);
		render(
			// eslint-disable-next-line @atlaskit/design-system/no-direct-use-of-web-platform-drag-and-drop
			<div onDragStart={dragStartEvent}>
				<CustomItem component={Component} testId="target">
					Hello world
				</CustomItem>
			</div>,
		);

		fireEvent.dragStart(screen.getByTestId('target'));

		expect(screen.getByTestId('target')).toHaveAttribute('draggable', 'false');
		//  Default was prevented?
		expect(dragStartEvent.mock.results[0].value).toEqual(true);
	});

	it('should not prevent dragging when UNSAFE_isDraggable is true', () => {
		// Return if default was prevented which we will then assert later
		const dragStartEvent = jest.fn((e) => e.defaultPrevented);
		render(
			// eslint-disable-next-line @atlaskit/design-system/no-direct-use-of-web-platform-drag-and-drop
			<div onDragStart={dragStartEvent}>
				<CustomItem component={Component} testId="target" UNSAFE_isDraggable>
					Hello world
				</CustomItem>
			</div>,
		);

		fireEvent.dragStart(screen.getByTestId('target'));

		expect(dragStartEvent.mock.results[0].value).toEqual(false);
	});

	it('should pass through extra props to the component', () => {
		const Link = ({
			children,
			...props
		}: CustomItemComponentProps & {
			href: string;
			// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
		}) => <a {...props}>{children}</a>;

		render(
			<CustomItem href="/my-details" component={Link} testId="target">
				Hello world
			</CustomItem>,
		);

		expect(screen.getByTestId('target')).toHaveAttribute('href', '/my-details');
	});

	it('should work with a component from an external library', () => {
		render(
			<HashRouter>
				<CustomItem to="/my-details" component={Link} testId="target">
					Hello world
				</CustomItem>
			</HashRouter>,
		);

		expect(screen.getByTestId('target')).toHaveAttribute('href', '#/my-details');
	});
});
