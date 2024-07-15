/**
 * @jsxRuntime classic
 */
/** @jsx jsx */
/**
 * @jsxFrag React.Fragment
 */
import React, { forwardRef, type Ref } from 'react';

import { createSerializer, matchers } from '@emotion/jest';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import { fireEvent, render, screen } from '@testing-library/react';

import AppProvider, { type RouterLinkComponentProps } from '@atlaskit/app-provider';

import type { CSSFn } from '../../../types';
import LinkItem from '../../link-item';

expect.addSnapshotSerializer(createSerializer());
expect.extend(matchers);

window.requestAnimationFrame = (cb) => {
	cb(-1);
	return -1;
};

type MyRouterLinkConfig = {
	to: string;
	customProp?: string;
};

const MyRouterLinkComponent = forwardRef(
	(
		{ href, children, ...rest }: RouterLinkComponentProps<MyRouterLinkConfig>,
		ref: Ref<HTMLAnchorElement>,
	) => {
		const label = <>{children} (Router link)</>;

		if (typeof href === 'string') {
			return (
				<a ref={ref} data-test-link-type="simple" href={href} {...rest}>
					{label}
				</a>
			);
		}

		return (
			<a
				ref={ref}
				data-test-link-type="advanced"
				data-custom-attribute={href.customProp}
				href={href.to}
				// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
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
		const { getByTestId } = render(
			<LinkItem href="http://www.atlassian.com" onClick={callback} testId="target">
				Atlassian
			</LinkItem>,
		);

		fireEvent.click(getByTestId('target'));

		expect(callback).toHaveBeenCalled();
	});

	// This behaviour exists only as a side effect for spread props.
	// When we remove the ability for spread props in a future major version
	// This test can be deleted.
	it('should take a data-testid directly', () => {
		const { getByTestId } = render(
			<LinkItem href="http://www.atlassian.com" data-testid="link">
				Atlassian
			</LinkItem>,
		);

		expect(getByTestId('link')).toBeInTheDocument();
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
			<LinkItem href="http://www.atlassian.com" css={hackStyles} testId="link">
				Atlassian
			</LinkItem>,
			/* eslint-disable @atlaskit/design-system/consistent-css-prop-usage */
		);

		expect(getByTestId('link')).toHaveStyleRule('background-color', 'red');
		expect(getByTestId('link')).toHaveStyleRule('color', 'currentColor');
	});

	it('should not gain focus on mouse down when it had no initial focus', () => {
		const { getByTestId } = render(
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

		getByTestId('focused-button').focus();
		expect(getByTestId('focused-button')).toHaveFocus();
		const allowed: boolean = fireEvent.mouseDown(getByTestId('target'));

		// target didn't get focus
		expect(getByTestId('target')).not.toHaveFocus();
		// mousedown event not prevented
		expect(allowed).toBe(true);
	});

	it('should persist focus if it was focused during mouse down', () => {
		const { getByTestId } = render(
			<LinkItem href="http://www.atlassian.com" testId="target">
				Atlassian
			</LinkItem>,
		);

		getByTestId('target').focus();
		fireEvent.mouseDown(getByTestId('target'));

		expect(getByTestId('target') === document.activeElement).toBe(true);
	});

	describe('LinkItem used as a button (for legacy purposes only, do not do this!)', () => {
		// These are examples of a LinkItem being used as a button. If you need a
		// LinkItem to do anything other than *link* to another page, you should
		// be using a ButtonItem.
		it('should callback to user supplied mouse down prop', () => {
			const onMouseDown = jest.fn();
			const { getByTestId } = render(
				// TODO: Ensure LinkItems are not used as buttons (DSP-11468)
				// eslint-disable-next-line jsx-a11y/anchor-is-valid, jsx-a11y/no-static-element-interactions
				<LinkItem onMouseDown={onMouseDown} testId="target">
					Hello world
				</LinkItem>,
			);

			fireEvent.mouseDown(getByTestId('target'));

			expect(onMouseDown).toHaveBeenCalled();
		});

		it('should not callback on click when disabled', () => {
			const callback = jest.fn();
			const { getByTestId } = render(
				// eslint-disable-next-line jsx-a11y/click-events-have-key-events
				<LinkItem href="http://www.atlassian.com" isDisabled onClick={callback} testId="target">
					Atlassian
				</LinkItem>,
			);

			fireEvent.click(getByTestId('target'));

			expect(callback).not.toHaveBeenCalled();
		});
	});

	it('should respect the cssFn prop', () => {
		const customCss: CSSFn = (state) => ({
			...(state.isSelected && { border: '1px solid' }),
			...(state.isDisabled && { pointerEvents: 'none' as const }),
			padding: '10px',
			opacity: 0.75,
			borderRadius: '5px',
		});
		const { container } = render(
			<LinkItem
				// eslint-disable-next-line @repo/internal/react/no-unsafe-overrides
				cssFn={customCss}
				isSelected
				isDisabled
				href="http://www.atlassian.com"
			>
				Atlassian
			</LinkItem>,
		);

		expect(container.firstChild).toHaveStyleRule('padding', '10px');
		expect(container.firstChild).toHaveStyleRule('opacity', '0.75');
		expect(container.firstChild).toHaveStyleRule('border-radius', '5px');
		expect(container.firstChild).toHaveStyleRule('border', '1px solid');
	});

	it('should prevent dragging so the transparent artefact isnt shown', () => {
		// Return if default was prevented which we will then assert later
		const dragStartEvent = jest.fn((e) => e.defaultPrevented);
		const { getByTestId } = render(
			// eslint-disable-next-line @atlaskit/design-system/no-direct-use-of-web-platform-drag-and-drop
			<div onDragStart={dragStartEvent}>
				<LinkItem href="http://www.atlassian.com" testId="target">
					Atlassian
				</LinkItem>
			</div>,
		);

		fireEvent.dragStart(getByTestId('target'));

		expect(getByTestId('target')).toHaveAttribute('draggable', 'false');
		//  Default was prevented?
		expect(dragStartEvent.mock.results[0].value).toEqual(true);
	});

	it('should not prevent dragging when UNSAFE_isDraggable is true', () => {
		// Return if default was prevented which we will then assert later
		const dragStartEvent = jest.fn((e) => e.defaultPrevented);
		const { getByTestId } = render(
			// eslint-disable-next-line @atlaskit/design-system/no-direct-use-of-web-platform-drag-and-drop
			<div onDragStart={dragStartEvent}>
				<LinkItem href="http://www.atlassian.com" testId="target" UNSAFE_isDraggable>
					Atlassian
				</LinkItem>
			</div>,
		);

		fireEvent.dragStart(getByTestId('target'));

		expect(dragStartEvent.mock.results[0].value).toEqual(false);
	});

	it('should have "aria-current=page" when link item is selected', () => {
		const { getByTestId } = render(
			<LinkItem href="http://www.atlassian.com" isSelected testId="target">
				Atlassian
			</LinkItem>,
		);

		expect(getByTestId('target')).toHaveAttribute('aria-current', 'page');
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
});
