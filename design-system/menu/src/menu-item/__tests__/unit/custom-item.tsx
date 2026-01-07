/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';
import { fireEvent, render, screen } from '@testing-library/react';

import InteractionContext, { type InteractionContextType } from '@atlaskit/interaction-context';

import type { CustomItemComponentProps } from '../../../types';
import CustomItem from '../../custom-item';

window.requestAnimationFrame = (cb) => {
	cb(-1);
	return -1;
};

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
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
		);

		expect(screen.getByTestId('link')).toHaveCompiledCss({ backgroundColor: 'red' });
		expect(screen.getByTestId('link')).toHaveCompiledCss({ color: 'currentColor' });
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

	it('should prevent dragging so the transparent artefact isnt shown', () => {
		// Return if default was prevented which we will then assert later
		const dragStartEvent = jest.fn((e) => e.defaultPrevented);
		render(
			// eslint-disable-next-line @atlaskit/design-system/no-direct-use-of-web-platform-drag-and-drop, @atlassian/a11y/no-static-element-interactions
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
			// eslint-disable-next-line @atlaskit/design-system/no-direct-use-of-web-platform-drag-and-drop, @atlassian/a11y/no-static-element-interactions
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
		const Link = (
			{
				children,
				...props
			}: CustomItemComponentProps & {
				href: string;
			}, // eslint-disable-next-line @atlaskit/design-system/no-html-anchor, @repo/internal/react/no-unsafe-spread-props
		) => <a {...props}>{children}</a>;

		render(
			<CustomItem href="/my-details" component={Link} testId="target">
				Hello world
			</CustomItem>,
		);

		expect(screen.getByTestId('target')).toHaveAttribute('href', '/my-details');
	});

	it('should render children in a span when isTitleHeading is false (default)', () => {
		render(
			<CustomItem component={Component} testId="is-title-heading-false">
				Hello world
			</CustomItem>,
		);

		expect(
			screen.queryByRole('heading', { level: 2, name: 'Hello world' }),
		).not.toBeInTheDocument();
		const span = screen.getByText('Hello world');
		expect(span.tagName.toLowerCase()).toBe('span');
		expect(span).toBeVisible();
	});

	it('should render children in a h2 when isTitleHeading is true', () => {
		render(
			<CustomItem component={Component} testId="is-title-heading-true" isTitleHeading>
				Hello world
			</CustomItem>,
		);

		const heading = screen.getByRole('heading', { level: 2, name: 'Hello world' });
		expect(heading.tagName.toLowerCase()).toBe('h2');
		expect(heading).toBeVisible();
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
				<CustomItem component={Component} interactionName={interactionName} testId="target">
					Hello world
				</CustomItem>
				,
			</InteractionContext.Provider>,
		);

		fireEvent.click(screen.getByTestId('target'));
		expect(mockTraceInteraction).toHaveBeenCalledTimes(1);
		expect(mockTraceInteraction).toHaveBeenCalledWith(interactionName, expect.any(Number));
	});
});
