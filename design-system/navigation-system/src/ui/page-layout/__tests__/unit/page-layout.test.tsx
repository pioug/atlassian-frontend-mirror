import React from 'react';

import { render, screen } from '@testing-library/react';

import noop from '@atlaskit/ds-lib/noop';

import { Aside } from '../../aside';
import { Banner } from '../../banner';
import { UNSAFE_sideNavLayoutVar } from '../../constants';
import { Main } from '../../main/main';
import { Panel } from '../../panel';
import { Root } from '../../root';
import { SideNav } from '../../side-nav/side-nav';
import { SideNavToggleButton } from '../../side-nav/toggle-button';
import { TopNav } from '../../top-nav/top-nav';

import { resetMatchMedia, setMediaQuery } from './_test-utils';

const originalNodeEnv = process.env.NODE_ENV;

describe('page layout', () => {
	beforeEach(() => {
		resetMatchMedia();
	});

	afterEach(() => {
		jest.clearAllMocks();
		process.env.NODE_ENV = originalNodeEnv;
	});

	describe('hoisting CSS variables', () => {
		it('should hoist the side nav width to the document root element when opted in', () => {
			setMediaQuery('(min-width: 64rem)', { initial: true });
			render(
				<Root UNSAFE_dangerouslyHoistSlotSizes>
					<SideNav defaultWidth={300} testId="side-nav">
						sidenav
					</SideNav>
				</Root>,
			);

			expect(screen.getByTestId('side-nav')).toHaveTextContent(
				':root { --leftSidebarWidth: var(--n_sNvlw) }',
			);
			expect(screen.getByTestId('side-nav')).toHaveTextContent(':root { --n_sNvlw: 0px }');
			expect(screen.getByTestId('side-nav')).toHaveTextContent(
				'@media (min-width: 64rem) { :root { --n_sNvlw: var(--n_snvRsz, clamp(240px, 300px, 50vw)) } }',
			);
		});

		it('should hoist the banner height to the document root element when opted in', () => {
			render(
				<Root UNSAFE_dangerouslyHoistSlotSizes>
					<Banner height={122}>banner</Banner>
				</Root>,
			);

			expect(screen.getByText('banner')).toHaveTextContent(':root { --bannerHeight: 122px }');
		});

		it('should hoist the top bar height to the document root element when opted in', () => {
			render(
				<Root UNSAFE_dangerouslyHoistSlotSizes>
					<TopNav height={122}>topbar</TopNav>
				</Root>,
			);

			expect(screen.getByText('topbar')).toHaveTextContent(
				':root { --topNavigationHeight: 122px }',
			);
		});

		it('should hoist the panel width to the document root element when opted in', () => {
			render(
				<Root UNSAFE_dangerouslyHoistSlotSizes>
					<Panel testId="panel" defaultWidth={399}>
						panel
					</Panel>
				</Root>,
			);

			expect(screen.getByTestId('panel')).toHaveTextContent(':root { --rightPanelWidth: 0px }');
			expect(screen.getByTestId('panel')).toHaveTextContent(
				'@media (min-width: 90rem) { :root { --rightPanelWidth: var(--n_pnlRsz, clamp(399px, 399px, round(nearest, calc((100vw - var(--n_sNvlw, 0px)) / 2), 1px))) } }',
			);
		});

		it('should hoist the aside width to the document root element when opted in', () => {
			render(
				<Root UNSAFE_dangerouslyHoistSlotSizes>
					<Aside testId="aside" defaultWidth={199}>
						aside
					</Aside>
				</Root>,
			);

			expect(screen.getByTestId('aside')).toHaveTextContent(':root { --rightSidebarWidth: 0px }');
			expect(screen.getByTestId('aside')).toHaveTextContent(
				'@media (min-width: 64rem) { :root { --rightSidebarWidth: var(--n_asdRsz, clamp(0px, 199px, 50vw)) } }',
			);
		});

		it('should not hoist CSS variables by default', () => {
			/**
			 * Intentionally not including SideNav, see test below
			 */
			render(
				<div data-testid="test-wrapper">
					<Root>
						<Banner>banner</Banner>
						<TopNav>
							<SideNavToggleButton collapseLabel="Collapse sidebar" expandLabel="Expand sidebar" />
						</TopNav>
						<Main>main</Main>
						<Panel>panel</Panel>
					</Root>
				</div>,
			);

			expect(screen.getByTestId('test-wrapper')).not.toHaveTextContent(':root');
		});

		it('should not hoist legacy CSS variable for SideNav by default', () => {
			/**
			 * SideNav is a special case where we hoist a variable by default that's used by the Panel slot.
			 * So we are asserting specifically that the legacy variable is not hoisted by default.
			 */
			render(
				<div data-testid="test-wrapper">
					<Root>
						<SideNav>sidenav</SideNav>
					</Root>
				</div>,
			);

			expect(screen.getByTestId('test-wrapper')).not.toHaveTextContent(UNSAFE_sideNavLayoutVar);
		});
	});

	describe('implicit grid item dev warnings', () => {
		it('should not log anything in prod mode', () => {
			process.env.NODE_ENV = 'production';
			jest.spyOn(console, 'error').mockImplementation(noop);

			render(
				<Root>
					<div>implicit grid item</div>
				</Root>,
			);

			expect(console.error).toHaveBeenCalledTimes(0);
		});

		it('should log nothing in dev mode if no implicit grid items were found', () => {
			jest.spyOn(console, 'error').mockImplementation(noop);

			render(
				<Root>
					<Main>main</Main>
				</Root>,
			);

			expect(console.error).toHaveBeenCalledTimes(0);
		});

		it('should log warnings in dev mode for implicit grid items', () => {
			jest.spyOn(console, 'error').mockImplementation(noop);

			render(
				<Root>
					<div>implicit grid item</div>
				</Root>,
			);

			expect(console.error).toHaveBeenCalledTimes(1);
		});

		it('should ignore style and script tags', () => {
			jest.spyOn(console, 'error').mockImplementation(noop);

			render(
				<Root>
					<script />
					{
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-global-styles
						<style />
					}
				</Root>,
			);

			expect(console.error).not.toHaveBeenCalled();
		});

		it('should set data attributes to prevent hiding page layout components in PROD', () => {
			process.env.NODE_ENV = 'production';

			render(
				<Root>
					<Banner>banner</Banner>
					<TopNav>
						<SideNavToggleButton collapseLabel="Collapse sidebar" expandLabel="Expand sidebar" />
					</TopNav>
					<SideNav testId="sidenav">sidenav</SideNav>
					<Main>main</Main>
					<Aside>aside</Aside>
					<Panel>panel</Panel>
				</Root>,
			);

			const slotElementCount = 6;
			// eslint-disable-next-line testing-library/no-node-access
			expect(document.querySelectorAll('[data-layout-slot]')).toHaveLength(slotElementCount);
		});
	});

	describe('default width prop dev warnings', () => {
		it('should not log anything in prod mode', () => {
			process.env.NODE_ENV = 'production';
			jest.spyOn(console, 'warn').mockImplementation(noop);

			const { rerender } = render(
				<Root>
					<Aside defaultWidth={300}>aside</Aside>
					<Panel defaultWidth={300}>panel</Panel>
				</Root>,
			);

			rerender(
				<Root>
					<Aside defaultWidth={400}>aside</Aside>
					<Panel defaultWidth={400}>panel</Panel>
				</Root>,
			);

			expect(console.warn).not.toHaveBeenCalled();
		});

		it('should not log anything in dev mode if default width props are not updated after initial render', () => {
			jest.spyOn(console, 'warn').mockImplementation(noop);

			const { rerender } = render(
				<Root>
					<Aside defaultWidth={300}>aside</Aside>
					<Panel defaultWidth={300}>panel</Panel>
				</Root>,
			);

			rerender(
				<Root>
					<Aside defaultWidth={300}>aside</Aside>
					<Panel defaultWidth={300}>panel</Panel>
				</Root>,
			);

			expect(console.warn).not.toHaveBeenCalled();
		});

		it('should log warnings in dev mode when default width props are updated after initial render', () => {
			jest.spyOn(console, 'warn').mockImplementation(noop);

			const { rerender } = render(
				<Root>
					<Aside defaultWidth={300}>aside</Aside>
					<Panel defaultWidth={300}>panel</Panel>
				</Root>,
			);

			rerender(
				<Root>
					<Aside defaultWidth={400}>aside</Aside>
					<Panel defaultWidth={400}>panel</Panel>
				</Root>,
			);

			// Expect one warning each for Aside and Panel
			expect(console.warn).toHaveBeenCalledTimes(2);
		});
	});

	it('should support passing test IDs to the page layout components', async () => {
		render(
			<Root testId="root-test-id">
				<Banner testId="banner-test-id">banner</Banner>
				<TopNav testId="top-bar-test-id">topbar</TopNav>
				<SideNav testId="sidenav-test-id">sidenav</SideNav>
				<Main testId="main-test-id">main</Main>
				<Aside testId="aside-test-id">aside</Aside>
				<Panel testId="panel-test-id">panel</Panel>
			</Root>,
		);

		expect(screen.getByTestId('root-test-id')).toBeInTheDocument();
		expect(screen.getByTestId('banner-test-id')).toBeInTheDocument();
		expect(screen.getByTestId('top-bar-test-id')).toBeInTheDocument();
		expect(screen.getByTestId('sidenav-test-id')).toBeInTheDocument();
		expect(screen.getByTestId('main-test-id')).toBeInTheDocument();
		expect(screen.getByTestId('aside-test-id')).toBeInTheDocument();
		expect(screen.getByTestId('panel-test-id')).toBeInTheDocument();
	});
});
