/**
 * @jsxRuntime classic
 * @jsx jsx
 */
/**
 * @jsxFrag React.Fragment
 */
import React, { forwardRef, type Ref } from 'react';

import { css, jsx } from '@compiled/react';
import { fireEvent, render, screen } from '@testing-library/react';

import AppProvider, { type RouterLinkComponentProps } from '@atlaskit/app-provider';
import InteractionContext, { type InteractionContextType } from '@atlaskit/interaction-context';

import LinkItem from '../../link-item';

window.requestAnimationFrame = (cb) => {
	cb(-1);
	return -1;
};

type MyRouterLinkConfig = {
	to: string;
	customProp?: string;
};

const MyRouterLinkComponent: React.ForwardRefExoticComponent<
	React.PropsWithoutRef<RouterLinkComponentProps<MyRouterLinkConfig>> &
		React.RefAttributes<HTMLAnchorElement>
> = forwardRef(
	(
		{ href, children, ...rest }: RouterLinkComponentProps<MyRouterLinkConfig>,
		ref: Ref<HTMLAnchorElement>,
	) => {
		const label = <>{children} (Router link)</>;

		if (typeof href === 'string') {
			return (
				// eslint-disable-next-line @atlaskit/design-system/no-html-anchor
				<a ref={ref} data-test-link-type="simple" href={href} {...rest}>
					{label}
				</a>
			);
		}

		return (
			// eslint-disable-next-line @atlaskit/design-system/no-html-anchor
			<a
				ref={ref}
				data-test-link-type="advanced"
				data-custom-attribute={href.customProp}
				href={href.to}
				{...rest}
			>
				{label}
			</a>
		);
	},
);

describe('<LinkItem />', () => {
	it('should callback on click', () => {
		const callback = jest.fn();
		render(
			<LinkItem href="http://www.atlassian.com" onClick={callback} testId="target">
				Atlassian
			</LinkItem>,
		);

		fireEvent.click(screen.getByTestId('target'));

		expect(callback).toHaveBeenCalled();
	});

	// This behaviour exists only as a side effect for spread props.
	// When we remove the ability for spread props in a future major version
	// This test can be deleted.
	it('should take a data-testid directly', () => {
		render(
			<LinkItem href="http://www.atlassian.com" data-testid="link">
				Atlassian
			</LinkItem>,
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
			<LinkItem href="http://www.atlassian.com" css={hackStyles} testId="link">
				Atlassian
			</LinkItem>,
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
				<LinkItem href="http://www.atlassian.com" testId="target">
					Atlassian
				</LinkItem>
				,
			</div>,
		);

		const focusedButton = screen.getByTestId('focused-button');
		const target = screen.getByTestId('target');

		focusedButton.focus();
		expect(focusedButton).toHaveFocus();
		const allowed: boolean = fireEvent.mouseDown(target);

		// target didn't get focus
		expect(target).not.toHaveFocus();
		// mousedown event not prevented
		expect(allowed).toBe(true);
	});

	it('should persist focus if it was focused during mouse down', () => {
		render(
			<LinkItem href="http://www.atlassian.com" testId="target">
				Atlassian
			</LinkItem>,
		);

		const target = screen.getByTestId('target');

		target.focus();
		fireEvent.mouseDown(target);
		expect(target).toHaveFocus();
	});

	describe('LinkItem used as a button (for legacy purposes only, do not do this!)', () => {
		// These are examples of a LinkItem being used as a button. If you need a
		// LinkItem to do anything other than *link* to another page, you should
		// be using a ButtonItem.
		it('should callback to user supplied mouse down prop', () => {
			const onMouseDown = jest.fn();
			render(
				// TODO: Ensure LinkItems are not used as buttons (DSP-11468)
				// eslint-disable-next-line @atlassian/a11y/anchor-is-valid, @atlassian/a11y/no-static-element-interactions
				<LinkItem onMouseDown={onMouseDown} testId="target">
					Hello world
				</LinkItem>,
			);

			fireEvent.mouseDown(screen.getByTestId('target'));

			expect(onMouseDown).toHaveBeenCalled();
		});

		it('should not callback on click when disabled', () => {
			const callback = jest.fn();
			render(
				<LinkItem href="http://www.atlassian.com" isDisabled onClick={callback} testId="target">
					Atlassian
				</LinkItem>,
			);

			fireEvent.click(screen.getByTestId('target'));

			expect(callback).not.toHaveBeenCalled();
		});
	});

	it('should prevent dragging so the transparent artefact isnt shown', () => {
		// Return if default was prevented which we will then assert later
		const dragStartEvent = jest.fn((e) => e.defaultPrevented);
		render(
			// eslint-disable-next-line @atlaskit/design-system/no-direct-use-of-web-platform-drag-and-drop, @atlassian/a11y/no-static-element-interactions
			<div onDragStart={dragStartEvent}>
				<LinkItem href="http://www.atlassian.com" testId="target">
					Atlassian
				</LinkItem>
			</div>,
		);

		const target = screen.getByTestId('target');

		fireEvent.dragStart(target);

		expect(target).toHaveAttribute('draggable', 'false');
		//  Default was prevented?
		expect(dragStartEvent.mock.results[0].value).toEqual(true);
	});

	it('should not prevent dragging when UNSAFE_isDraggable is true', () => {
		// Return if default was prevented which we will then assert later
		const dragStartEvent = jest.fn((e) => e.defaultPrevented);
		render(
			// eslint-disable-next-line @atlaskit/design-system/no-direct-use-of-web-platform-drag-and-drop, @atlassian/a11y/no-static-element-interactions
			<div onDragStart={dragStartEvent}>
				<LinkItem href="http://www.atlassian.com" testId="target" UNSAFE_isDraggable>
					Atlassian
				</LinkItem>
			</div>,
		);

		fireEvent.dragStart(screen.getByTestId('target'));

		expect(dragStartEvent.mock.results[0].value).toEqual(false);
	});

	it('should have "aria-current=page" when link item is selected', () => {
		render(
			<LinkItem href="http://www.atlassian.com" isSelected testId="target">
				Atlassian
			</LinkItem>,
		);

		expect(screen.getByTestId('target')).toHaveAttribute('aria-current', 'page');
	});

	describe('should conditionally render router links or standard <a> anchors', () => {
		describe('when link items are used outside an AppProvider', () => {
			it('should render a standard <a> anchor for internal links', () => {
				render(
					<LinkItem href="/home" testId="link-item">
						Link item
					</LinkItem>,
				);

				expect(screen.getByTestId('link-item')).toHaveAttribute('data-is-router-link', 'false');
			});

			it('should render a standard <a> anchor when UNSAFE_shouldDisableRouterLink is true', () => {
				render(
					<LinkItem href="/home" testId="link-item" UNSAFE_shouldDisableRouterLink>
						Link item
					</LinkItem>,
				);

				expect(screen.getByTestId('link-item')).toHaveAttribute('data-is-router-link', 'false');
			});

			it('should render a standard <a> anchor for external links (http)', () => {
				render(
					<LinkItem href="http://www.atlassian.com" testId="link-item">
						Link item
					</LinkItem>,
				);

				expect(screen.getByTestId('link-item')).toHaveAttribute('data-is-router-link', 'false');
			});

			it('should render a standard <a> anchor for external links (https)', () => {
				render(
					<LinkItem href="https://www.atlassian.com" testId="link-item">
						Link item
					</LinkItem>,
				);

				expect(screen.getByTestId('link-item')).toHaveAttribute('data-is-router-link', 'false');
			});

			it('should render a standard <a> anchor for email links', () => {
				render(
					<LinkItem href="mailto:test@example.com" testId="link-item">
						Link item
					</LinkItem>,
				);

				expect(screen.getByTestId('link-item')).toHaveAttribute('data-is-router-link', 'false');
			});

			it('should render a standard <a> anchor for telephone links', () => {
				render(
					<LinkItem href="tel:0400-000-000" testId="link-item">
						Link item
					</LinkItem>,
				);

				expect(screen.getByTestId('link-item')).toHaveAttribute('data-is-router-link', 'false');
			});

			it('should render a standard <a> anchor for SMS links', () => {
				render(
					<LinkItem href="sms:0400-000-000?&body=foo" testId="link-item">
						Link item
					</LinkItem>,
				);

				expect(screen.getByTestId('link-item')).toHaveAttribute('data-is-router-link', 'false');
			});

			it('should render a standard <a> anchor for hash links on the current page', () => {
				render(
					<LinkItem href="#hash" testId="link-item">
						Link item
					</LinkItem>,
				);

				expect(screen.getByTestId('link-item')).toHaveAttribute('data-is-router-link', 'false');
			});

			it('should render a standard <a> anchor when href is an empty string', () => {
				render(
					// Disabling this rule because we want to test the behaviour of this component
					// when the href is an empty string.
					// eslint-disable-next-line @atlassian/a11y/anchor-is-valid
					<LinkItem href="" testId="link-item">
						Link item
					</LinkItem>,
				);

				expect(screen.getByTestId('link-item')).toHaveAttribute('data-is-router-link', 'false');
			});

			it('should render a standard <a> anchor when href is undefined', () => {
				render(
					// Disabling this rule because we want to test the behaviour of this component
					// when the href is undefined.
					// eslint-disable-next-line @atlassian/a11y/anchor-is-valid
					<LinkItem href={undefined} testId="link-item">
						Link item
					</LinkItem>,
				);

				expect(screen.getByTestId('link-item')).toHaveAttribute('data-is-router-link', 'false');
			});

			it('should render a standard <a> anchor for hash links on internal pages', () => {
				render(
					<LinkItem href="/home#hash" testId="link-item">
						Link item
					</LinkItem>,
				);

				expect(screen.getByTestId('link-item')).toHaveAttribute('data-is-router-link', 'false');
			});
		});

		describe('when link items are used inside an AppProvider, without a routerLinkComponent defined', () => {
			it('should render a standard <a> anchor for internal links', () => {
				render(
					<AppProvider>
						<LinkItem href="/home" testId="link-item">
							Link item
						</LinkItem>
					</AppProvider>,
				);

				expect(screen.getByTestId('link-item')).toHaveAttribute('data-is-router-link', 'false');
			});

			it('should render a standard <a> anchor when UNSAFE_shouldDisableRouterLink is true', () => {
				render(
					<AppProvider>
						<LinkItem href="/home" testId="link-item" UNSAFE_shouldDisableRouterLink>
							Link item
						</LinkItem>
					</AppProvider>,
				);

				expect(screen.getByTestId('link-item')).toHaveAttribute('data-is-router-link', 'false');
			});

			it('should render a standard <a> anchor for external links (http)', () => {
				render(
					<AppProvider>
						<LinkItem href="http://www.atlassian.com" testId="link-item">
							Link item
						</LinkItem>
					</AppProvider>,
				);

				expect(screen.getByTestId('link-item')).toHaveAttribute('data-is-router-link', 'false');
			});

			it('should render a standard <a> anchor for external links (https)', () => {
				render(
					<AppProvider>
						<LinkItem href="https://www.atlassian.com" testId="link-item">
							Link item
						</LinkItem>
					</AppProvider>,
				);

				expect(screen.getByTestId('link-item')).toHaveAttribute('data-is-router-link', 'false');
			});

			it('should render a standard <a> anchor for email links', () => {
				render(
					<AppProvider>
						<LinkItem href="mailto:test@example.com" testId="link-item">
							Link item
						</LinkItem>
					</AppProvider>,
				);

				expect(screen.getByTestId('link-item')).toHaveAttribute('data-is-router-link', 'false');
			});

			it('should render a standard <a> anchor for telephone links', () => {
				render(
					<AppProvider>
						<LinkItem href="tel:0400-000-000" testId="link-item">
							Link item
						</LinkItem>
					</AppProvider>,
				);

				expect(screen.getByTestId('link-item')).toHaveAttribute('data-is-router-link', 'false');
			});

			it('should render a standard <a> anchor for SMS links', () => {
				render(
					<AppProvider>
						<LinkItem href="sms:0400-000-000?&body=foo" testId="link-item">
							Link item
						</LinkItem>
					</AppProvider>,
				);

				expect(screen.getByTestId('link-item')).toHaveAttribute('data-is-router-link', 'false');
			});

			it('should render a standard <a> anchor for hash links on the current page', () => {
				render(
					<AppProvider>
						<LinkItem href="#hash" testId="link-item">
							Link item
						</LinkItem>
					</AppProvider>,
				);

				expect(screen.getByTestId('link-item')).toHaveAttribute('data-is-router-link', 'false');
			});

			it('should render a standard <a> anchor when href is an empty string', () => {
				render(
					<AppProvider>
						{/* Disabling this rule because we want to test the behaviour of this component */}
						{/* when the href is an empty string. */}
						{/* eslint-disable-next-line @atlassian/a11y/anchor-is-valid*/}
						<LinkItem href="" testId="link-item">
							Link item
						</LinkItem>
					</AppProvider>,
				);

				expect(screen.getByTestId('link-item')).toHaveAttribute('data-is-router-link', 'false');
			});

			it('should render a standard <a> anchor when href is undefined', () => {
				render(
					<AppProvider>
						{/* Disabling this rule because we want to test the behaviour of this component */}
						{/* when the href is undefined. */}
						{/* eslint-disable-next-line @atlassian/a11y/anchor-is-valid*/}
						<LinkItem href={undefined} testId="link-item">
							Link item
						</LinkItem>
					</AppProvider>,
				);

				expect(screen.getByTestId('link-item')).toHaveAttribute('data-is-router-link', 'false');
			});

			it('should render a standard <a> anchor for hash links on internal pages', () => {
				render(
					<AppProvider>
						<LinkItem href="/home#hash" testId="link-item">
							Link item
						</LinkItem>
					</AppProvider>,
				);

				expect(screen.getByTestId('link-item')).toHaveAttribute('data-is-router-link', 'false');
			});
		});

		describe('when link items are used inside an AppProvider, with a routerLinkComponent defined', () => {
			it('should render a router link for internal links', () => {
				render(
					<AppProvider routerLinkComponent={MyRouterLinkComponent}>
						<LinkItem href="/home" testId="link-item">
							Link item
						</LinkItem>
					</AppProvider>,
				);

				expect(screen.getByTestId('link-item')).toHaveAttribute('data-is-router-link', 'true');
			});

			it('should render a standard <a> anchor when UNSAFE_shouldDisableRouterLink is true', () => {
				render(
					<AppProvider routerLinkComponent={MyRouterLinkComponent}>
						<LinkItem href="/home" testId="link-item" UNSAFE_shouldDisableRouterLink>
							Link item
						</LinkItem>
					</AppProvider>,
				);

				expect(screen.getByTestId('link-item')).toHaveAttribute('data-is-router-link', 'false');
			});

			it('should render a standard <a> anchor for external links (http)', () => {
				render(
					<AppProvider routerLinkComponent={MyRouterLinkComponent}>
						<LinkItem href="http://www.atlassian.com" testId="link-item">
							Link item
						</LinkItem>
					</AppProvider>,
				);

				expect(screen.getByTestId('link-item')).toHaveAttribute('data-is-router-link', 'false');
			});

			it('should render a standard <a> anchor for external links (https)', () => {
				render(
					<AppProvider routerLinkComponent={MyRouterLinkComponent}>
						<LinkItem href="https://www.atlassian.com" testId="link-item">
							Link item
						</LinkItem>
					</AppProvider>,
				);

				expect(screen.getByTestId('link-item')).toHaveAttribute('data-is-router-link', 'false');
			});

			it('should render a standard <a> anchor for email links', () => {
				render(
					<AppProvider routerLinkComponent={MyRouterLinkComponent}>
						<LinkItem href="mailto:test@example.com" testId="link-item">
							Link item
						</LinkItem>
					</AppProvider>,
				);

				expect(screen.getByTestId('link-item')).toHaveAttribute('data-is-router-link', 'false');
			});

			it('should render a standard <a> anchor for telephone links', () => {
				render(
					<AppProvider routerLinkComponent={MyRouterLinkComponent}>
						<LinkItem href="tel:0400-000-000" testId="link-item">
							Link item
						</LinkItem>
					</AppProvider>,
				);

				expect(screen.getByTestId('link-item')).toHaveAttribute('data-is-router-link', 'false');
			});

			it('should render a standard <a> anchor for SMS links', () => {
				render(
					<AppProvider routerLinkComponent={MyRouterLinkComponent}>
						<LinkItem href="sms:0400-000-000?&body=foo" testId="link-item">
							Link item
						</LinkItem>
					</AppProvider>,
				);

				expect(screen.getByTestId('link-item')).toHaveAttribute('data-is-router-link', 'false');
			});

			it('should render a standard <a> anchor for hash links on the current page', () => {
				render(
					<AppProvider routerLinkComponent={MyRouterLinkComponent}>
						<LinkItem href="#hash" testId="link-item">
							Link item
						</LinkItem>
					</AppProvider>,
				);

				expect(screen.getByTestId('link-item')).toHaveAttribute('data-is-router-link', 'false');
			});

			it('should render a standard <a> anchor when href is an empty string', () => {
				render(
					<AppProvider routerLinkComponent={MyRouterLinkComponent}>
						{/* Disabling this rule because we want to test the behaviour of this component */}
						{/* when the href is an empty string. */}
						{/* eslint-disable-next-line @atlassian/a11y/anchor-is-valid*/}
						<LinkItem href="" testId="link-item">
							Link item
						</LinkItem>
					</AppProvider>,
				);

				expect(screen.getByTestId('link-item')).toHaveAttribute('data-is-router-link', 'false');
			});

			it('should render a standard <a> anchor when href is undefined', () => {
				render(
					<AppProvider routerLinkComponent={MyRouterLinkComponent}>
						{/* Disabling this rule because we want to test the behaviour of this component */}
						{/* when the href is undefined. */}
						{/* eslint-disable-next-line @atlassian/a11y/anchor-is-valid*/}
						<LinkItem href={undefined} testId="link-item">
							Link item
						</LinkItem>
					</AppProvider>,
				);

				expect(screen.getByTestId('link-item')).toHaveAttribute('data-is-router-link', 'false');
			});

			it('should render a render a router link for hash links on internal pages', () => {
				render(
					<AppProvider routerLinkComponent={MyRouterLinkComponent}>
						<LinkItem href="/home#hash" testId="link-item">
							Link item
						</LinkItem>
					</AppProvider>,
				);

				expect(screen.getByTestId('link-item')).toHaveAttribute('data-is-router-link', 'true');
			});
		});
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
				<LinkItem href="http://www.atlassian.com" interactionName={interactionName} testId="target">
					Atlassian
				</LinkItem>
				,
			</InteractionContext.Provider>,
		);

		fireEvent.click(screen.getByTestId('target'));
		expect(mockTraceInteraction).toHaveBeenCalledTimes(1);
		expect(mockTraceInteraction).toHaveBeenCalledWith(interactionName, expect.any(Number));
	});
});
