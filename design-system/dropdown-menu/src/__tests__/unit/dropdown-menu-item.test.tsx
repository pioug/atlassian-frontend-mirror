import React, { forwardRef, type Ref } from 'react';

import { render, screen } from '@testing-library/react';

import AppProvider from '@atlaskit/app-provider/app-provider';
import type { RouterLinkComponentProps } from '@atlaskit/app-provider/router-link-provider';
import TaskIcon from '@atlaskit/icon/core/task';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import DropdownItem from '../../dropdown-menu-item';

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

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('DropdownMenu Item', () => {
	describe('default menu - button', () => {
		it('simple menu item', () => {
			render(<DropdownItem>Menu</DropdownItem>);
			expect(screen.getByText('Menu')).toBeInTheDocument();
		});

		it('should have description', () => {
			const desc = 'A long text to describe a menu';
			render(<DropdownItem description={desc}>Menu</DropdownItem>);
			expect(screen.getByText(desc)).toBeInTheDocument();
		});

		describe('aria-current', () => {
			it('should set aria-current when selected', () => {
				render(
					<DropdownItem isSelected testId="item">
						Menu
					</DropdownItem>,
				);
				expect(screen.getByTestId('item')).toHaveAttribute('aria-current', 'true');
			});

			describe('nested submenu trigger (A11Y-29757)', () => {
				it('should not set aria-current when gate is on', () => {
					passGate('platform_dst_dropdown_nested_trigger_aria_current');
					render(
						// @ts-ignore -- aria-haspopup is supplied by DropdownMenu via spread props for nested triggers
						<DropdownItem isSelected aria-haspopup="true" aria-expanded="true" testId="item">
							Menu
						</DropdownItem>,
					);
					// The open state is conveyed via aria-expanded, so aria-current is inappropriate here.
					expect(screen.getByTestId('item')).not.toHaveAttribute('aria-current');
					expect(screen.getByTestId('item')).toHaveAttribute('aria-haspopup', 'true');
				});

				it('should retain legacy aria-current when gate is off', () => {
					failGate('platform_dst_dropdown_nested_trigger_aria_current');
					render(
						// @ts-ignore -- aria-haspopup is supplied by DropdownMenu via spread props for nested triggers
						<DropdownItem isSelected aria-haspopup="true" aria-expanded="true" testId="item">
							Menu
						</DropdownItem>,
					);
					// Legacy behaviour: ButtonItem still sets aria-current from isSelected.
					expect(screen.getByTestId('item')).toHaveAttribute('aria-current', 'true');
					expect(screen.getByTestId('item')).toHaveAttribute('aria-haspopup', 'true');
				});
			});
		});

		describe('custom component', () => {
			it('should render the item as a custom component if one is provided', () => {
				const text = 'Menu';
				const role = 'banner';

				const Header: React.ForwardRefExoticComponent<React.RefAttributes<HTMLElement>> =
					forwardRef<HTMLElement>((props, ref) => <header {...props} ref={ref} />);

				render(
					<DropdownItem
						// @ts-expect-error - Added during @types/react@~18.3.24 upgrade.
						component={Header}
					>
						{text}
					</DropdownItem>,
				);

				expect(screen.getByRole(role)).toHaveTextContent(text);
			});
		});

		describe('icon', () => {
			const uniqueText = 'uniqueText';
			const testId = 'testId';

			it('should have icon before the text', () => {
				render(
					<DropdownItem
						elemBefore={<TaskIcon color="currentColor" label={uniqueText} testId={testId} />}
						testId={testId}
					>
						Menu
					</DropdownItem>,
				);

				const iconBefore = screen.getByLabelText(uniqueText);
				const container = screen.getByTestId(`${testId}--primitive--icon-before`);
				expect(iconBefore).toBeInTheDocument();
				expect(container).toBeInTheDocument();
			});

			it('should have icon after the text', () => {
				render(
					<DropdownItem
						elemAfter={<TaskIcon color="currentColor" label={uniqueText} />}
						testId={testId}
					>
						Menu
					</DropdownItem>,
				);
				const iconBefore = screen.getByLabelText(uniqueText);
				const container = screen.getByTestId(`${testId}--primitive--icon-after`);
				expect(iconBefore).toBeInTheDocument();
				expect(container).toBeInTheDocument();
			});

			it('should have icon before and after the text', () => {
				const beforeText = `${uniqueText}Before`;
				const afterText = `${uniqueText}After`;
				render(
					<DropdownItem
						elemBefore={<TaskIcon color="currentColor" label={beforeText} />}
						elemAfter={<TaskIcon color="currentColor" label={afterText} />}
						testId={testId}
					>
						Menu
					</DropdownItem>,
				);
				const iconBefore = screen.getByLabelText(beforeText);
				const iconBeforeContainer = screen.getByTestId(`${testId}--primitive--icon-before`);
				const iconAfter = screen.getByLabelText(afterText);
				const iconAfterContainer = screen.getByTestId(`${testId}--primitive--icon-after`);
				expect(iconBefore).toBeInTheDocument();
				expect(iconAfter).toBeInTheDocument();
				expect(iconBeforeContainer).toBeInTheDocument();
				expect(iconAfterContainer).toBeInTheDocument();
			});
		});
	});

	describe('link menu', () => {
		const href = '/hello';

		it('menu can be a link', () => {
			render(<DropdownItem href={href}>Menu</DropdownItem>);
			const link = screen.getByRole('menuitem');
			expect(link).toBeInTheDocument();
			expect(link.tagName.toLowerCase()).toBe('a');
			expect(link).toHaveAttribute('href', href);
		});

		it('link menu should have description', () => {
			const desc = 'A long text to describe a menu';
			render(
				<DropdownItem href={href} description={desc}>
					Menu
				</DropdownItem>,
			);
			const link = screen.getByRole('menuitem');
			expect(link.tagName.toLowerCase()).toBe('a');
			expect(link).toHaveAttribute('href', href);
			expect(screen.getByText(desc)).toBeInTheDocument();
		});

		describe('when link items are used inside an AppProvider, with a routerLinkComponent defined', () => {
			it('should render a router link for internal links', () => {
				render(
					<AppProvider routerLinkComponent={MyRouterLinkComponent}>
						<DropdownItem href={href} testId="link-item">
							Menu
						</DropdownItem>
					</AppProvider>,
				);
				expect(screen.getByTestId('link-item')).toHaveAttribute('data-is-router-link', 'true');
			});

			it('should render a standard <a> anchor when UNSAFE_shouldDisableRouterLink is true', () => {
				render(
					<AppProvider routerLinkComponent={MyRouterLinkComponent}>
						<DropdownItem href={href} testId="link-item" UNSAFE_shouldDisableRouterLink={true}>
							Menu
						</DropdownItem>
					</AppProvider>,
				);
				expect(screen.getByTestId('link-item')).toHaveAttribute('data-is-router-link', 'false');
			});
		});
	});
});
