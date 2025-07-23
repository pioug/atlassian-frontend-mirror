import React from 'react';

import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import noop from '@atlaskit/ds-lib/noop';

import {
	SkipLinksContext,
	type SkipLinksContextData,
	useSkipLink,
} from '../../../../context/skip-links/skip-links-context';
import { SkipLinksDataContext } from '../../../../context/skip-links/skip-links-data-context';
import {
	filterFromConsoleErrorOutput,
	parseCssErrorRegex,
	type ResetConsoleErrorFn,
	resetMatchMedia,
} from '../../../../ui/page-layout/__tests__/unit/_test-utils';
import { Aside } from '../../../../ui/page-layout/aside';
import { Banner } from '../../../../ui/page-layout/banner';
import { Main } from '../../../../ui/page-layout/main/main';
import { Panel } from '../../../../ui/page-layout/panel';
import { Root } from '../../../../ui/page-layout/root';
import { SideNav } from '../../../../ui/page-layout/side-nav/side-nav';
import { TopNav } from '../../../../ui/page-layout/top-nav/top-nav';
import { SkipLinksContainer } from '../../skip-links-container';

beforeAll(() => {
	// Stubbing calls that don't make sense outside of the browser
	HTMLElement.prototype.scrollIntoView = noop;
	window.scrollTo = noop;
});

describe('skip links', () => {
	describe('SkipLinksContainer', () => {
		const label = '跳转到';
		const context: SkipLinksContextData = {
			registerSkipLink: noop,
			unregisterSkipLink: noop,
		};
		const dataContext = [
			{ id: 'left', label: 'Left panel' },
			{ id: 'right', label: 'Right panel' },
		];
		const skipLinksContainer = (
			<SkipLinksDataContext.Provider value={dataContext}>
				<SkipLinksContext.Provider value={context}>
					<SkipLinksContainer label={label} />
				</SkipLinksContext.Provider>
			</SkipLinksDataContext.Provider>
		);

		it('generate 3 links', () => {
			render(skipLinksContainer);
			expect(screen.getByText(label)).toBeInTheDocument();
			expect(screen.getAllByRole('link')).toHaveLength(2);
		});
	});

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
			const consoleWarn = jest.spyOn(console, 'warn');
			const NODE_ENV = process.env.NODE_ENV;

			afterEach(() => {
				process.env.NODE_ENV = NODE_ENV;
				consoleWarn.mockReset();
			});

			afterAll(() => {
				consoleWarn.mockRestore();
			});

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

		expect(screen.getByTestId('root--skip-links-container--label')).toHaveTextContent(
			'custom label',
		);
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
			expect(
				skipLinksContainer.getByRole('link', { name: 'Skip to side nav' }),
			).toBeInTheDocument();
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
});
