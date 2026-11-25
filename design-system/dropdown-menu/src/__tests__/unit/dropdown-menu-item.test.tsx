import React, { forwardRef, type Ref, useRef } from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import AppProvider from '@atlaskit/app-provider/app-provider';
import type { RouterLinkComponentProps } from '@atlaskit/app-provider/router-link-provider';
import TaskIcon from '@atlaskit/icon/core/task';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import { DropdownItem } from '../../dropdown-item';

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

		describe('returnFocusRef', () => {
			const ItemWithReturnFocusRef = ({ onClick }: { onClick: () => void }) => {
				const returnFocusRef = useRef<HTMLButtonElement>(null);
				return (
					<>
						<DropdownItem returnFocusRef={returnFocusRef} onClick={onClick}>
							Open modal
						</DropdownItem>
						<button type="button" ref={returnFocusRef}>
							Focus target
						</button>
					</>
				);
			};

			it('focuses the ref when the top-layer gate is off', async () => {
				failGate('platform-dst-top-layer');
				const onClick = jest.fn();
				render(<ItemWithReturnFocusRef onClick={onClick} />);
				const item = screen.getByRole('menuitem', { name: 'Open modal' });

				await userEvent.click(item);

				expect(onClick).toHaveBeenCalledTimes(1);
				expect(screen.getByRole('button', { name: 'Focus target' })).toHaveFocus();
			});

			it('does not move focus when the top-layer gate is on', async () => {
				passGate('platform-dst-top-layer');
				const onClick = jest.fn();
				render(<ItemWithReturnFocusRef onClick={onClick} />);
				const item = screen.getByRole('menuitem', { name: 'Open modal' });

				await userEvent.click(item);

				expect(onClick).toHaveBeenCalledTimes(1);
				expect(item).toHaveFocus();
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

it('omits aria-controls in the new menu', () => {
	passGate('platform-dst-new-menu');

	render(
		<DropdownItem aria-controls="popup" aria-haspopup="dialog" aria-expanded>
			Open dialog
		</DropdownItem>,
	);

	const item = screen.getByRole('menuitem', { name: 'Open dialog' });
	expect(item).not.toHaveAttribute('aria-controls');
	expect(item).toHaveAttribute('aria-haspopup', 'dialog');
	expect(item).toHaveAttribute('aria-expanded', 'true');
});

describe('New dropdown item interactions', () => {
	beforeEach(() => {
		passGate('platform-dst-new-menu');
	});

	it.each([
		['Esc', 'Escape'],
		['Del', 'Delete'],
		['PgUp', 'PageUp'],
		['Ins', 'Insert'],
		['enter', 'Enter'],
		['Return', 'Enter'],
		['tab', 'Tab'],
		['f12', 'F12'],
		['⎋', 'Escape'],
		['⇥', 'Tab'],
		['↵', 'Enter'],
		['↩', 'Enter'],
		['⌦', 'Delete'],
		['⇞', 'PageUp'],
		['⇟', 'PageDown'],
		['↖', 'Home'],
		['↘', 'End'],
		['$', '$'],
		['=', '='],
	])('exposes %s as %s in the accessible shortcut', (label, key) => {
		render(<DropdownItem shortcut={['⌘', label]}>Run action</DropdownItem>);

		const item = screen.getByRole('menuitem', { name: 'Run action' });
		expect(item).toHaveAttribute('aria-keyshortcuts', `Meta+${key}`);
		expect(screen.getByText(label)).toBeVisible();
	});

	it.each(['UnknownKey', '⚡'])('keeps an unrecognized shortcut %s readable', (label) => {
		render(<DropdownItem shortcut={['Ctrl', label]}>Run action</DropdownItem>);

		const item = screen.getByRole('menuitem');
		expect(item).not.toHaveAttribute('aria-keyshortcuts');
		expect(item).toHaveAccessibleName(`Run action Ctrl ${label}`);
	});

	it.each([undefined, 'https://example.com'])(
		'forwards focus and hover handlers and exposes the shortcut with href %s',
		async (href) => {
			const user = userEvent.setup();
			const onFocus = jest.fn();
			const onBlur = jest.fn();
			const onMouseEnter = jest.fn();
			const onMouseLeave = jest.fn();

			render(
				<DropdownItem
					href={href}
					onFocus={onFocus}
					onBlur={onBlur}
					onMouseEnter={onMouseEnter}
					onMouseLeave={onMouseLeave}
					shortcut={['Ctrl', '⇧', '+']}
					title="Native tooltip"
				>
					Run action
				</DropdownItem>,
			);

			const item = screen.getByRole('menuitem', { name: 'Run action' });
			await user.tab();
			await user.hover(item);
			await user.unhover(item);
			await user.tab();

			expect(onFocus).toHaveBeenCalledTimes(1);
			expect(onBlur).toHaveBeenCalledTimes(1);
			expect(onMouseEnter).toHaveBeenCalledTimes(1);
			expect(onMouseLeave).toHaveBeenCalledTimes(1);
			expect(item).toHaveAttribute('aria-keyshortcuts', 'Control+Shift+Plus');
			expect(item).not.toHaveAttribute('title');
			expect(screen.getByText('Ctrl').tagName).toBe('KBD');
		},
	);

	it('keeps links focusable and exposes their shortcuts when isDisabled is supplied', async () => {
		const user = userEvent.setup();
		render(
			<DropdownItem href="https://example.com" isDisabled shortcut={['A']}>
				Open link
			</DropdownItem>,
		);

		const item = screen.getByRole('menuitem', { name: 'Open link' });
		await user.tab();

		expect(item).toHaveFocus();
		expect(item).not.toHaveAttribute('aria-disabled');
		expect(item).toHaveAttribute('aria-keyshortcuts', 'A');
	});

	it('keeps disabled buttons out of the tab order and prevents activation', async () => {
		const user = userEvent.setup();
		const onClick = jest.fn();
		render(
			<DropdownItem isDisabled onClick={onClick} shortcut={['A']}>
				Disabled action
			</DropdownItem>,
		);

		const item = screen.getByRole('menuitem');
		await user.tab();
		await user.click(item);

		expect(item).toBeDisabled();
		expect(item).not.toHaveFocus();
		expect(item).not.toHaveAttribute('aria-keyshortcuts');
		expect(onClick).not.toHaveBeenCalled();
	});
});
