import React from 'react';

import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import noop from '@atlaskit/ds-lib/noop';
import { ffTest } from '@atlassian/feature-flags-test-utils';
import { resetMatchMedia } from '@atlassian/test-utils';

import { useSkipLink } from '../../../../context/skip-links/use-skip-link';
import { useSkipLinkInternal } from '../../../../context/skip-links/use-skip-link-internal';
import {
	filterFromConsoleErrorOutput,
	parseCssErrorRegex,
	type ResetConsoleErrorFn,
} from '../../../../ui/page-layout/__tests__/unit/_filter-from-console-error-output';
import { Aside } from '../../../../ui/page-layout/aside';
import { Banner } from '../../../../ui/page-layout/banner';
import { Main } from '../../../../ui/page-layout/main/main';
import { Panel } from '../../../../ui/page-layout/panel';
import { Root } from '../../../../ui/page-layout/root';
import { SideNav } from '../../../../ui/page-layout/side-nav/side-nav';
import { TopNav } from '../../../../ui/page-layout/top-nav/top-nav';

beforeAll(() => {
	// Stubbing calls that don't make sense outside of the browser
	HTMLElement.prototype.scrollIntoView = noop;
	window.scrollTo = noop;
});

// These are placed outside of the individual ffTest blocks to prevent mock restoration between parallel test executions
const consoleWarn = jest.spyOn(console, 'warn');
const NODE_ENV = process.env.NODE_ENV;

beforeEach(() => {
	process.env.NODE_ENV = NODE_ENV;
	consoleWarn.mockReset();
});

afterAll(() => {
	consoleWarn.mockRestore();
});

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('Custom skip links', () => {
	it('generates 3 links - 1 through standard slot method, 2 custom, in the correct order', () => {
		const IntroSection = () => {
			useSkipLink('intro-section', 'Intro Section', 0);

			return (
				// Adding data-layout-slot prop to prevent console errors for incorrect page layout children composition
				<div id="intro-section" data-layout-slot>
					intro
				</div>
			);
		};
		const ExternalFooter = () => {
			useSkipLink('external-footer', 'External Footer', 7);

			return (
				// Adding data-layout-slot prop to prevent console errors for incorrect page layout children composition
				<div id="external-footer" data-layout-slot>
					external footer
				</div>
			);
		};
		render(
			<Root>
				<IntroSection />
				<ExternalFooter />
				<Banner>
					<p>Child</p>
				</Banner>
			</Root>,
		);
		const allLinksInSkipLinks = screen.getAllByRole('link');

		expect(allLinksInSkipLinks).toHaveLength(3);
		expect(allLinksInSkipLinks[0]).toHaveTextContent('Intro Section');
		expect(allLinksInSkipLinks[1]).toHaveTextContent('Banner');
		expect(allLinksInSkipLinks[2]).toHaveTextContent('External Footer');
	});

	describe('when a duplicate skip link is registered', () => {
		it.each(['development', 'staging'])('should error in %', (environment) => {
			process.env.NODE_ENV = environment;

			const CustomSkipLink = () => {
				useSkipLink('banner', 'Skip to banner', 0);
				return null;
			};

			expect(() =>
				render(
					<Root>
						<CustomSkipLink />
						<Banner id="banner">
							<p>Child</p>
						</Banner>
					</Root>,
				),
			).not.toThrow();

			expect(consoleWarn).toHaveBeenCalledWith(
				expect.stringContaining("Tried registering duplicate skip link for ID 'banner'."),
			);
		});

		it('should silently ignore it in production', () => {
			process.env.NODE_ENV = 'production';

			const CustomSkipLink = () => {
				useSkipLink('banner', 'Skip to banner', 0);
				return null;
			};

			expect(() =>
				render(
					<Root testId="root">
						<CustomSkipLink />
						<Banner id="banner">
							<p>Child</p>
						</Banner>
					</Root>,
				),
			).not.toThrow();

			const skipLinksContainer = within(screen.getByTestId('root--skip-links-container'));

			// Only one skip link was registered
			expect(skipLinksContainer.getAllByRole('link')).toHaveLength(1);
			// The `useSkipLink` in `CustomSkipLink` was called first so that 'won'
			expect(skipLinksContainer.getByRole('link')).toHaveTextContent('Skip to banner');
		});
	});
});

/**
 * There are almost no restrictions on valid IDs in HTML5:
 * https://www.w3.org/TR/2010/WD-html-markup-20100624/datatypes.html#common.data.id-def
 */
test.each([':id:', '1234', '_', '.', '$', '-', "'"])(
	'should not error when the skip link id is "%s"',
	(id) => {
		const MyLandmark = () => {
			useSkipLink(id, 'My landmark', 0);

			return (
				// Adding data-layout-slot prop to prevent console errors for incorrect page layout children composition
				<div id={id} data-layout-slot />
			);
		};

		render(
			<Root>
				<MyLandmark />
			</Root>,
		);

		const link = screen.getByRole('link', { name: 'My landmark' });

		expect(() => link.click()).not.toThrow();
	},
);

it('should use the provided label', () => {
	const { rerender } = render(
		<Root testId="root">
			<Main>Hello world</Main>
		</Root>,
	);

	expect(screen.getByTestId('root--skip-links-container--label')).toHaveTextContent('Skip to:');

	rerender(
		<Root testId="root" skipLinksLabel="custom label">
			<Main>Hello world</Main>
		</Root>,
	);

	expect(screen.getByTestId('root--skip-links-container--label')).toHaveTextContent('custom label');
});

it.each(['', ' '])(
	'should not render a label if it is just whitespace (skipLinksLabel="%s")',
	(skipLinksLabel) => {
		render(
			<Root testId="root" skipLinksLabel={skipLinksLabel}>
				<Main>Hello world</Main>
			</Root>,
		);

		expect(screen.queryByTestId('root--skip-links-container--label')).not.toBeInTheDocument();
	},
);

describe('hidden skip links', () => {
	it('should not render the skip link for a Banner slot with `height={0}`', () => {
		render(
			<Root testId="root">
				<Banner height={0}>{null}</Banner>
			</Root>,
		);

		// There is no skip links container because there's no skip links
		expect(screen.queryByTestId('root--skip-links-container')).not.toBeInTheDocument();
	});

	it('should not render the skip link for an Aside slot with `defaultWidth={0}`', () => {
		render(
			<Root testId="root">
				<Aside defaultWidth={0}>{null}</Aside>
			</Root>,
		);

		// There is no skip links container because there's no skip links
		expect(screen.queryByTestId('root--skip-links-container')).not.toBeInTheDocument();
	});

	it('should not render the skip link for a Panel slot with `defaultWidth={0}`', () => {
		render(
			<Root testId="root">
				<Panel defaultWidth={0}>{null}</Panel>
			</Root>,
		);

		// There is no skip links container because there's no skip links
		expect(screen.queryByTestId('root--skip-links-container')).not.toBeInTheDocument();
	});

	it('should render the skip link if the slot size changes', () => {
		const { rerender } = render(
			<Root testId="root">
				<Banner height={0}>{null}</Banner>
				<Aside defaultWidth={0}>{null}</Aside>
				<Panel defaultWidth={0}>{null}</Panel>
			</Root>,
		);

		// There is no skip links container because there's no skip links
		expect(screen.queryByTestId('root--skip-links-container')).not.toBeInTheDocument();

		rerender(
			<Root testId="root">
				<Banner height={1}>{null}</Banner>
				<Aside defaultWidth={1}>{null}</Aside>
				<Panel defaultWidth={1}>{null}</Panel>
			</Root>,
		);

		const skipLinksContainer = within(screen.getByTestId('root--skip-links-container'));
		expect(skipLinksContainer.queryAllByRole('link')).toHaveLength(3);

		expect(skipLinksContainer.getByRole('link', { name: 'Banner' })).toBeInTheDocument();
		expect(skipLinksContainer.getByRole('link', { name: 'Aside' })).toBeInTheDocument();
		expect(skipLinksContainer.getByRole('link', { name: 'Panel' })).toBeInTheDocument();
	});
});

describe('page layout slots', () => {
	let resetConsoleErrorSpyFn: ResetConsoleErrorFn;
	beforeAll(() => {
		// Rendering the `SideNav` causes `parseCss` errors in JSDOM
		resetConsoleErrorSpyFn = filterFromConsoleErrorOutput(parseCssErrorRegex);
		resetMatchMedia();
	});

	afterAll(() => {
		resetConsoleErrorSpyFn();
	});

	it('should use the `label` if there is no `skipLinkLabel` provided', () => {
		render(
			<Root testId="root">
				<SideNav label="my side nav">side nav</SideNav>
				<Aside label="my aside">aside</Aside>
				<Panel label="my panel">panel</Panel>
			</Root>,
		);

		const skipLinksContainer = within(screen.getByTestId('root--skip-links-container'));

		expect(skipLinksContainer.getByRole('link', { name: 'my side nav' })).toBeInTheDocument();
		expect(skipLinksContainer.getByRole('link', { name: 'my aside' })).toBeInTheDocument();
		expect(skipLinksContainer.getByRole('link', { name: 'my panel' })).toBeInTheDocument();
	});

	it('should use the default `skipLinkLabel` value if the slot does not support a `label` prop', () => {
		render(
			<Root testId="root">
				<Banner>banner</Banner>
				<TopNav>top bar</TopNav>
				<Main>main</Main>
			</Root>,
		);

		const skipLinksContainer = within(screen.getByTestId('root--skip-links-container'));

		expect(skipLinksContainer.getByRole('link', { name: 'Banner' })).toBeInTheDocument();
		expect(skipLinksContainer.getByRole('link', { name: 'Top Bar' })).toBeInTheDocument();
		expect(skipLinksContainer.getByRole('link', { name: 'Main Content' })).toBeInTheDocument();
	});

	it('should use the default `label` value if neither `label` or `skipLinkLabel` is provided', () => {
		render(
			<Root testId="root">
				<Banner>banner</Banner>
				<TopNav>top bar</TopNav>
				<SideNav>side nav</SideNav>
				<Aside>aside</Aside>
				<Panel>panel</Panel>
			</Root>,
		);

		const skipLinksContainer = within(screen.getByTestId('root--skip-links-container'));

		expect(skipLinksContainer.getByRole('link', { name: 'Banner' })).toBeInTheDocument();
		expect(skipLinksContainer.getByRole('link', { name: 'Top Bar' })).toBeInTheDocument();
		expect(skipLinksContainer.getByRole('link', { name: 'Sidebar' })).toBeInTheDocument();
		expect(skipLinksContainer.getByRole('link', { name: 'Aside' })).toBeInTheDocument();
		expect(skipLinksContainer.getByRole('link', { name: 'Panel' })).toBeInTheDocument();
	});

	it('should use the `skipLinkLabel` value', () => {
		render(
			<Root testId="root">
				<Banner skipLinkLabel="Skip to banner">banner</Banner>
				<TopNav skipLinkLabel="Skip to top bar">top bar</TopNav>
				<SideNav label="my side nav" skipLinkLabel="Skip to side nav">
					side nav
				</SideNav>
				<Main skipLinkLabel="Skip to main">main</Main>
				<Aside label="my aside" skipLinkLabel="Skip to aside">
					aside
				</Aside>
				<Panel label="my panel" skipLinkLabel="Skip to panel">
					panel
				</Panel>
			</Root>,
		);

		const skipLinksContainer = within(screen.getByTestId('root--skip-links-container'));

		expect(skipLinksContainer.getByRole('link', { name: 'Skip to banner' })).toBeInTheDocument();
		expect(skipLinksContainer.getByRole('link', { name: 'Skip to top bar' })).toBeInTheDocument();
		expect(skipLinksContainer.getByRole('link', { name: 'Skip to side nav' })).toBeInTheDocument();
		expect(skipLinksContainer.getByRole('link', { name: 'Skip to main' })).toBeInTheDocument();
		expect(skipLinksContainer.getByRole('link', { name: 'Skip to aside' })).toBeInTheDocument();
		expect(skipLinksContainer.getByRole('link', { name: 'Skip to panel' })).toBeInTheDocument();
	});
});

it('should manage focus for the targeted element', async () => {
	render(
		<Root>
			<Main testId="main">Hello world</Main>
		</Root>,
	);

	const main = screen.getByTestId('main');

	// The main slot has no tab index by default
	expect(main).not.toHaveAttribute('tabindex');

	// We click on the skip link to the main slot
	screen.getByRole('link', { name: 'Main Content' }).click();

	// The main slot now has tabIndex="-1" and is focussed
	expect(main).toHaveAttribute('tabindex', '-1');
	expect(main).toHaveFocus();

	// User moves focus
	await userEvent.tab();

	// The main slot no longer has focus or the tab index
	expect(main).not.toHaveFocus();
	expect(main).not.toHaveAttribute('tabindex');
});

function CustomSkipLinkWithHandlers({
	id = 'custom-skip-target',
	navigate,
	onBeforeNavigate,
}: {
	id?: string;
	navigate?: () => void;
	onBeforeNavigate?: () => void;
}) {
	useSkipLinkInternal({
		id,
		label: 'Custom skip',
		listIndex: 0,
		navigate,
		onBeforeNavigate,
	});

	return (
		<div id={id} data-layout-slot>
			custom target
		</div>
	);
}

ffTest.on('platform_dst_nav4_skip_link_a11y_1', 'with skip link a11y improvements', () => {
	let resetConsoleErrorSpyFn: ResetConsoleErrorFn;
	beforeAll(() => {
		// Rendering the `SideNav` causes `parseCss` errors in JSDOM
		resetConsoleErrorSpyFn = filterFromConsoleErrorOutput(parseCssErrorRegex);
		resetMatchMedia();
	});

	afterAll(() => {
		resetConsoleErrorSpyFn();
	});

	it('should only render skip links for the SideNav and Main slots', async () => {
		const user = userEvent.setup();
		render(
			<Root testId="root">
				<Banner height={32}>banner</Banner>
				<TopNav height={48}>top nav</TopNav>
				<SideNav defaultWidth={320}>side nav</SideNav>
				<Main>main</Main>
				<Aside defaultWidth={200}>aside</Aside>
				<Panel defaultWidth={200}>panel</Panel>
			</Root>,
		);

		// The skip links live inside a popup dialog that needs to be opened first
		await user.click(screen.getByTestId('root--skip-links-trigger'));

		const skipLinksContainer = within(screen.getByTestId('root--skip-links-container'));

		expect(skipLinksContainer.getAllByRole('link')).toHaveLength(2);
		expect(skipLinksContainer.getByRole('link', { name: 'Sidebar' })).toBeInTheDocument();
		expect(skipLinksContainer.getByRole('link', { name: 'Main content' })).toBeInTheDocument();
	});

	it('renders a skip-to button and does not expose skip links until the dialog is open', () => {
		render(
			<Root testId="root">
				<Main>Hello world</Main>
			</Root>,
		);

		expect(screen.getByRole('button', { name: 'Skip to' })).toBeInTheDocument();
		expect(screen.queryByRole('link', { name: 'Main content' })).not.toBeInTheDocument();
	});

	it('focuses the skip-to trigger when it is the first tab stop', async () => {
		const user = userEvent.setup();
		render(
			<Root testId="root">
				<Main>Hello world</Main>
			</Root>,
		);

		const trigger = screen.getByTestId('root--skip-links-trigger');
		expect(trigger).not.toHaveFocus();

		await user.tab();

		expect(trigger).toHaveFocus();
	});

	it('uses the provided `skipLinksTriggerLabel` for the trigger button', () => {
		render(
			<Root testId="root" skipLinksTriggerLabel="Jump to a section">
				<Main>Hello world</Main>
			</Root>,
		);

		expect(screen.getByRole('button', { name: 'Jump to a section' })).toBeInTheDocument();
	});

	it('opens a dialog with skip links when the trigger is activated', async () => {
		const user = userEvent.setup();
		render(
			<Root testId="root">
				<Main>Hello world</Main>
			</Root>,
		);

		await user.click(screen.getByRole('button', { name: 'Skip to' }));

		const dialog = screen.getByRole('dialog', { name: 'Skip to' });
		expect(dialog).toBeInTheDocument();
		expect(within(dialog).getByRole('link', { name: 'Main content' })).toBeInTheDocument();
	});

	it('uses the provided `skipLinksLabel` as the dialog accessible name and visible heading', async () => {
		const user = userEvent.setup();
		render(
			<Root testId="root" skipLinksLabel="Jump to a section">
				<Main>Hello world</Main>
			</Root>,
		);

		await user.click(screen.getByRole('button', { name: 'Skip to' }));

		expect(screen.getByRole('dialog', { name: 'Jump to a section' })).toBeInTheDocument();
		expect(screen.getByTestId('root--skip-links-container--label')).toHaveTextContent(
			'Jump to a section',
		);
	});

	it('renders all registered skip links inside the dialog', async () => {
		const user = userEvent.setup();
		render(
			<Root testId="root">
				<SideNav>side nav</SideNav>
				<Main>main</Main>
			</Root>,
		);

		await user.click(screen.getByRole('button', { name: 'Skip to' }));

		const dialog = screen.getByRole('dialog', { name: 'Skip to' });
		const linksInDialog = within(dialog).getAllByRole('link');
		expect(linksInDialog).toHaveLength(2);
		expect(within(dialog).getByRole('link', { name: 'Sidebar' })).toBeInTheDocument();
		expect(within(dialog).getByRole('link', { name: 'Main content' })).toBeInTheDocument();
	});

	it('moves focus to the target when a skip link in the dialog is activated', async () => {
		const user = userEvent.setup();
		render(
			<Root testId="root">
				<Main testId="main">Hello world</Main>
			</Root>,
		);

		await user.click(screen.getByRole('button', { name: 'Skip to' }));
		await user.click(
			within(screen.getByRole('dialog', { name: 'Skip to' })).getByRole('link', {
				name: 'Main content',
			}),
		);

		const main = screen.getByTestId('main');
		expect(main).toHaveAttribute('tabindex', '-1');
		expect(main).toHaveFocus();
	});

	it('closes the dialog and restores focus to the trigger when Escape is pressed', async () => {
		const user = userEvent.setup();
		render(
			<Root testId="root">
				<Main>Hello world</Main>
			</Root>,
		);

		const trigger = screen.getByTestId('root--skip-links-trigger');
		await user.click(trigger);
		expect(screen.getByRole('dialog', { name: 'Skip to' })).toBeInTheDocument();

		await user.keyboard('{Escape}');

		expect(screen.queryByRole('dialog', { name: 'Skip to' })).not.toBeInTheDocument();
		await waitFor(() => {
			expect(trigger).toHaveFocus();
		});
	});

	it('does not render skip links UI when there are no registered skip links', () => {
		render(
			<Root testId="root">
				<Banner height={0}>{null}</Banner>
			</Root>,
		);

		expect(screen.queryByTestId('root--skip-links-container')).not.toBeInTheDocument();
		expect(screen.queryByTestId('root--skip-links-trigger')).not.toBeInTheDocument();
	});

	it('should pass an aXe accessibility audit when the popup is open', async () => {
		const user = userEvent.setup();
		render(
			<Root testId="root">
				<SideNav>side nav</SideNav>
				<Main>main</Main>
			</Root>,
		);

		await user.click(screen.getByRole('button', { name: 'Skip to' }));

		// Sanity check the dialog is open before auditing
		expect(screen.getByRole('dialog', { name: 'Skip to' })).toBeInTheDocument();

		await expect(screen.getByRole('dialog', { name: 'Skip to' })).toBeAccessible();
	});

	describe('useSkipLinkInternal navigate replaces default focus', () => {
		it('calls navigate instead of focusing the slot element', async () => {
			const user = userEvent.setup();
			const navigate = jest.fn();
			render(
				<Root testId="root">
					<CustomSkipLinkWithHandlers navigate={navigate} />
				</Root>,
			);

			const target = screen.getByText('custom target');

			// The skip links live inside a popup dialog that needs to be opened first
			await user.click(screen.getByRole('button', { name: 'Skip to' }));
			await user.click(screen.getByRole('link', { name: 'Custom skip' }));

			expect(navigate).toHaveBeenCalledTimes(1);
			expect(target).not.toHaveAttribute('tabindex');
		});

		it('should manage focus for the targeted element when navigate is not provided', async () => {
			const user = userEvent.setup();
			render(
				<Root testId="root">
					<Main testId="main">Hello world</Main>
				</Root>,
			);

			const main = screen.getByTestId('main');
			expect(main).not.toHaveAttribute('tabindex');

			// The skip links live inside a popup dialog that needs to be opened first
			await user.click(screen.getByRole('button', { name: 'Skip to' }));
			await user.click(screen.getByRole('link', { name: 'Main content' }));

			expect(main).toHaveAttribute('tabindex', '-1');
			expect(main).toHaveFocus();

			await user.tab();

			expect(main).not.toHaveFocus();
			expect(main).not.toHaveAttribute('tabindex');
		});

		it('does NOT call onBeforeNavigate when the gate is on (legacy callback is disabled)', async () => {
			const user = userEvent.setup();
			const onBeforeNavigate = jest.fn();
			render(
				<Root testId="root">
					<CustomSkipLinkWithHandlers onBeforeNavigate={onBeforeNavigate} />
				</Root>,
			);

			// The skip links live inside a popup dialog that needs to be opened first
			await user.click(screen.getByRole('button', { name: 'Skip to' }));
			await user.click(screen.getByRole('link', { name: 'Custom skip' }));

			expect(onBeforeNavigate).not.toHaveBeenCalled();
		});

		it('invokes navigate even when there is no DOM element matching the skip-link id', async () => {
			const user = userEvent.setup();
			const navigate = jest.fn();
			// Render a custom skip link whose registered id has no matching DOM element.
			function CustomSkipLinkNoTarget() {
				useSkipLinkInternal({
					id: 'no-such-target',
					label: 'Custom skip',
					listIndex: 0,
					navigate,
				});
				return null;
			}
			render(
				<Root testId="root">
					<CustomSkipLinkNoTarget />
				</Root>,
			);

			await user.click(screen.getByRole('button', { name: 'Skip to' }));
			await user.click(screen.getByRole('link', { name: 'Custom skip' }));

			// Under the gate, the navigate path does not consult the DOM at all.
			expect(navigate).toHaveBeenCalledTimes(1);
		});
	});

	describe('SkipLinksPopup close + navigate ordering', () => {
		it('closes the popup BEFORE invoking the consumer navigate', async () => {
			const user = userEvent.setup();
			let dialogPresentWhenNavigateRan: boolean | undefined;
			const navigate = jest.fn(() => {
				dialogPresentWhenNavigateRan = !!screen.queryByRole('dialog', { name: 'Skip to' });
			});

			render(
				<Root testId="root">
					<CustomSkipLinkWithHandlers navigate={navigate} />
				</Root>,
			);

			await user.click(screen.getByRole('button', { name: 'Skip to' }));
			expect(screen.getByRole('dialog', { name: 'Skip to' })).toBeInTheDocument();

			await user.click(screen.getByRole('link', { name: 'Custom skip' }));

			expect(navigate).toHaveBeenCalledTimes(1);
			// flushSync(closePopup) inside SkipLinksPopup means the dialog is gone
			// by the time the consumer's `navigate` is called.
			expect(dialogPresentWhenNavigateRan).toBe(false);
			expect(screen.queryByRole('dialog', { name: 'Skip to' })).not.toBeInTheDocument();
		});

		it('closes the popup BEFORE the fallback focusElement runs (no consumer navigate)', async () => {
			const user = userEvent.setup();
			render(
				<Root testId="root">
					<Main testId="main">Hello world</Main>
				</Root>,
			);

			await user.click(screen.getByRole('button', { name: 'Skip to' }));
			expect(screen.getByRole('dialog', { name: 'Skip to' })).toBeInTheDocument();

			await user.click(screen.getByRole('link', { name: 'Main content' }));

			// Dialog has closed and focus has moved to the slot element.
			expect(screen.queryByRole('dialog', { name: 'Skip to' })).not.toBeInTheDocument();
			expect(screen.getByTestId('main')).toHaveFocus();
		});

		it('does NOT restore focus to the trigger after a skip link is activated', async () => {
			const user = userEvent.setup();
			render(
				<Root testId="root">
					<Main testId="main">Hello world</Main>
				</Root>,
			);

			const trigger = screen.getByTestId('root--skip-links-trigger');
			await user.click(trigger);
			await user.click(screen.getByRole('link', { name: 'Main content' }));

			// Focus should land on the slot element (which then gets tabindex="-1"), NOT on the trigger.
			await waitFor(() => {
				expect(trigger).not.toHaveFocus();
			});
			expect(screen.getByTestId('main')).toHaveFocus();
		});

		it('can be reopened after a skip link has been activated', async () => {
			const user = userEvent.setup();
			render(
				<Root testId="root">
					<Main testId="main">Hello world</Main>
				</Root>,
			);

			// First open + click a skip link
			await user.click(screen.getByRole('button', { name: 'Skip to' }));
			await user.click(screen.getByRole('link', { name: 'Main content' }));
			expect(screen.queryByRole('dialog', { name: 'Skip to' })).not.toBeInTheDocument();

			// Reopen the popup and confirm the skip link list is rendered again
			await user.click(screen.getByRole('button', { name: 'Skip to' }));
			const dialog = screen.getByRole('dialog', { name: 'Skip to' });
			expect(within(dialog).getByRole('link', { name: 'Main content' })).toBeInTheDocument();
		});
	});
});

ffTest.off(
	'platform_dst_nav4_skip_link_a11y_1',
	'useSkipLinkInternal onBeforeNavigate + focusElement',
	() => {
		it('calls onBeforeNavigate and focuses the slot element', () => {
			const onBeforeNavigate = jest.fn();
			render(
				<Root testId="root">
					<CustomSkipLinkWithHandlers onBeforeNavigate={onBeforeNavigate} />
				</Root>,
			);

			const target = screen.getByText('custom target');

			screen.getByRole('link', { name: 'Custom skip' }).click();

			expect(onBeforeNavigate).toHaveBeenCalledTimes(1);
			expect(target).toHaveAttribute('tabindex', '-1');
			expect(target).toHaveFocus();
		});
	},
);
