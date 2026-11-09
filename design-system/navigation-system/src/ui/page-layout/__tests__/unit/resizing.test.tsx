import React, { useState } from 'react';

import { skipA11yAudit } from '@af/accessibility-testing/skip-a11y-audit';
import Button from '@atlaskit/button/default/button';
import DropdownMenu from '@atlaskit/dropdown-menu/dropdown-menu';
import Select from '@atlaskit/select/default';
import { PopupSelect } from '@atlaskit/select/popup-select';
import type { OptionType } from '@atlaskit/select/types';
import {
	FlyoutMenuItem,
	FlyoutMenuItemContent,
	FlyoutMenuItemTrigger,
} from '@atlaskit/side-nav-items/flyout-menu-item';
import { MenuList } from '@atlaskit/side-nav-items/menu-list';
import { flushPopoverExit } from '@atlaskit/top-layer/testing/flush-popover-exit';
import { resetMatchMedia } from '@atlassian/test-utils/match-media';
import { screen } from '@atlassian/testing-library/screen';
import { fireEvent, render } from '@atlassian/testing-library/testing-library/react';

import { Aside } from '../../aside';
import { Main } from '../../main/main';
import { Panel } from '../../panel';
import * as panelSplitterWidthUtils from '../../panel-splitter/get-pixel-width';
import { PanelSplitter } from '../../panel-splitter/panel-splitter';
import { Root } from '../../root';
import { SideNav } from '../../side-nav/side-nav';
import {
	filterFromConsoleErrorOutput,
	parseCssErrorRegex,
	type ResetConsoleErrorFn,
} from './_filter-from-console-error-output';

function ControlledPopupSelect({
	options,
	defaultIsOpen,
}: {
	options: OptionType[];
	defaultIsOpen: boolean;
}) {
	const [isOpen, setIsOpen] = useState(defaultIsOpen);
	const [selectedOption, setSelectedOption] = useState<OptionType | null>(null);

	return (
		<PopupSelect
			menuIsOpen={isOpen}
			onMenuOpen={() => setIsOpen(true)}
			onMenuClose={() => setIsOpen(false)}
			onChange={(option) => setSelectedOption(option)}
			value={selectedOption}
			options={options}
			target={({ isOpen: _isOpen, ...triggerProps }) => (
				<Button {...triggerProps}>Controlled popup select</Button>
			)}
			defaultIsOpen={defaultIsOpen}
		/>
	);
}

function ControlledSelect({ options }: { options: OptionType[] }) {
	const [isOpen, setIsOpen] = useState(true);
	const [selectedOption, setSelectedOption] = useState<OptionType | null>(null);

	return (
		<Select
			menuIsOpen={isOpen}
			onMenuOpen={() => setIsOpen(true)}
			onMenuClose={() => setIsOpen(false)}
			onChange={(option) => setSelectedOption(option)}
			value={selectedOption}
			options={options}
			placeholder="Select labels"
		/>
	);
}

/**
 * `popover="auto"` layers are exclusive: opening one closes any other auto layer that is not its
 * ancestor. So the tests that check layers inside and outside a layout area open one layer per case.
 */
const openLayerLocations = ['inside', 'outside'] as const;

describe('Resizing layout slots', () => {
	const getPixelWidthMock = jest.spyOn(panelSplitterWidthUtils, 'getPixelWidth');

	beforeEach(() => {
		resetMatchMedia();
		getPixelWidthMock.mockReturnValue(360);
		skipA11yAudit();
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('side nav resizing', () => {
		let resetConsoleErrorSpyFn: ResetConsoleErrorFn;
		beforeAll(() => {
			resetConsoleErrorSpyFn = filterFromConsoleErrorOutput(parseCssErrorRegex);
		});

		afterAll(() => {
			resetConsoleErrorSpyFn();
		});

		it.each(openLayerLocations)(
			'should close any open layers from both inside and outside the side nav when resizing the side nav with mouse (layer %s open)',
			async (openLayerLocation) => {
				render(
					<Root>
						<SideNav testId="sidenav" defaultWidth={360}>
							sidenav
							<PanelSplitter label="Resize Side Nav" testId="panel-splitter" />
							<MenuList>
								<FlyoutMenuItem isDefaultOpen={openLayerLocation === 'inside'}>
									<FlyoutMenuItemTrigger>Flyout menu item trigger</FlyoutMenuItemTrigger>
									<FlyoutMenuItemContent>Flyout menu item content</FlyoutMenuItemContent>
								</FlyoutMenuItem>
							</MenuList>
						</SideNav>
						<Main>
							<DropdownMenu
								shouldRenderToParent
								trigger="Dropdown trigger"
								defaultOpen={openLayerLocation === 'outside'}
							>
								Dropdown content
							</DropdownMenu>
						</Main>
					</Root>,
				);

				// The layer should be open before resizing
				expect(
					screen.getByText(
						openLayerLocation === 'inside' ? 'Flyout menu item content' : 'Dropdown content',
					),
				).toBeVisible();

				// Resize the side nav
				const splitter = screen.getByTestId('panel-splitter');
				fireEvent.dragStart(splitter, { clientX: 360 });
				fireEvent.dragEnter(splitter, { clientX: 420 });
				fireEvent.drop(splitter);

				// A top-layer popover unmounts its content after the exit, so let the exit finish
				await flushPopoverExit();

				// Layers should now be closed
				expect(screen.queryByText('Flyout menu item content')).not.toBeInTheDocument();
				expect(screen.queryByText('Dropdown content')).not.toBeInTheDocument();
			},
		);

		it.each(openLayerLocations)(
			'should close any open layers from both inside and outside the side nav when resizing the side nav with keyboard (layer %s open)',
			async (openLayerLocation) => {
				render(
					<Root>
						<SideNav testId="sidenav" defaultWidth={360}>
							sidenav
							<PanelSplitter label="Resize side nav" testId="panel-splitter" />
							<MenuList>
								<FlyoutMenuItem isDefaultOpen={openLayerLocation === 'inside'}>
									<FlyoutMenuItemTrigger>Flyout menu item trigger</FlyoutMenuItemTrigger>
									<FlyoutMenuItemContent>Flyout menu item content</FlyoutMenuItemContent>
								</FlyoutMenuItem>
							</MenuList>
						</SideNav>
						<Main>
							<DropdownMenu
								shouldRenderToParent
								trigger="Dropdown trigger"
								defaultOpen={openLayerLocation === 'outside'}
							>
								Dropdown content
							</DropdownMenu>
						</Main>
					</Root>,
				);

				// The layer should be open before resizing
				expect(
					screen.getByText(
						openLayerLocation === 'inside' ? 'Flyout menu item content' : 'Dropdown content',
					),
				).toBeVisible();

				// Resize the side nav using keyboard
				const splitter = screen.getByRole('slider', { name: 'Resize side nav', hidden: true });
				splitter.focus();
				fireEvent.change(splitter, { target: { value: 120 } });

				// A top-layer popover unmounts its content after the exit, so let the exit finish
				await flushPopoverExit();

				// Layers should now be closed
				expect(screen.queryByText('Flyout menu item content')).not.toBeInTheDocument();
				expect(screen.queryByText('Dropdown content')).not.toBeInTheDocument();
			},
		);

		describe('closing select menus', () => {
			it('should close uncontrolled select menus when resizing the side nav with mouse', async () => {
				render(
					<Root>
						<SideNav testId="sidenav" defaultWidth={360}>
							sidenav
							<PanelSplitter label="Resize side nav" testId="panel-splitter" />
							<Select
								options={[{ label: 'Option 1 inside side nav', value: 'option-1-inside-side-nav' }]}
								placeholder="Select inside side nav"
								defaultMenuIsOpen
							/>
						</SideNav>
						<Main>
							<Select
								options={[{ label: 'Option 1 inside main', value: 'option-1-inside-main' }]}
								placeholder="Select inside main"
								defaultMenuIsOpen
							/>
						</Main>
					</Root>,
				);

				// Layers should be open before resizing
				expect(screen.getByText('Option 1 inside side nav')).toBeVisible();
				expect(screen.getByText('Option 1 inside main')).toBeVisible();

				// Resize the side nav
				const splitter = screen.getByTestId('panel-splitter');
				fireEvent.dragStart(splitter, { clientX: 360 });
				fireEvent.dragEnter(splitter, { clientX: 420 });
				fireEvent.drop(splitter);

				// Layers should now be closed
				expect(screen.queryByText('Option 1 inside side nav')).not.toBeInTheDocument();
				expect(screen.queryByText('Option 1 inside main')).not.toBeInTheDocument();
			});

			it('should close controlled select menus when resizing the side nav with mouse', async () => {
				render(
					<Root>
						<SideNav testId="sidenav" defaultWidth={360}>
							sidenav
							<PanelSplitter label="Resize side nav" testId="panel-splitter" />
							<ControlledSelect
								options={[{ label: 'Option 1 inside side nav', value: 'option-1-inside-side-nav' }]}
							/>
						</SideNav>
						<Main>
							<ControlledSelect
								options={[{ label: 'Option 1 inside main', value: 'option-1-inside-main' }]}
							/>
						</Main>
					</Root>,
				);

				// Layers should be open before resizing
				expect(screen.getByText('Option 1 inside side nav')).toBeVisible();
				expect(screen.getByText('Option 1 inside main')).toBeVisible();

				// Resize the side nav
				const splitter = screen.getByTestId('panel-splitter');
				fireEvent.dragStart(splitter, { clientX: 360 });
				fireEvent.dragEnter(splitter, { clientX: 420 });
				fireEvent.drop(splitter);

				// Layers should now be closed
				expect(screen.queryByText('Option 1 inside side nav')).not.toBeInTheDocument();
				expect(screen.queryByText('Option 1 inside main')).not.toBeInTheDocument();
			});

			it('should close uncontrolled select menus when resizing the side nav with keyboard', async () => {
				render(
					<Root>
						<SideNav testId="sidenav" defaultWidth={360}>
							sidenav
							<PanelSplitter label="Resize side nav" testId="panel-splitter" />
							<Select
								options={[{ label: 'Option 1 inside side nav', value: 'option-1-inside-side-nav' }]}
								placeholder="Select inside side nav"
								defaultMenuIsOpen
							/>
						</SideNav>
						<Main>
							<Select
								options={[{ label: 'Option 1 inside main', value: 'option-1-inside-main' }]}
								placeholder="Select inside main"
								defaultMenuIsOpen
							/>
						</Main>
					</Root>,
				);

				// Layers should be open before resizing
				expect(screen.getByText('Option 1 inside side nav')).toBeVisible();
				expect(screen.getByText('Option 1 inside main')).toBeVisible();

				// Resize the side nav using keyboard
				const splitter = screen.getByRole('slider', { name: 'Resize side nav', hidden: true });
				splitter.focus();
				fireEvent.change(splitter, { target: { value: 120 } });

				// Layers should now be closed
				expect(screen.queryByText('Option 1 inside side nav')).not.toBeInTheDocument();
				expect(screen.queryByText('Option 1 inside main')).not.toBeInTheDocument();
			});

			it('should close controlled select menus when resizing the side nav with keyboard', async () => {
				render(
					<Root>
						<SideNav testId="sidenav" defaultWidth={360}>
							sidenav
							<PanelSplitter label="Resize side nav" testId="panel-splitter" />
							<ControlledSelect
								options={[{ label: 'Option 1 inside side nav', value: 'option-1-inside-side-nav' }]}
							/>
						</SideNav>
						<Main>
							<ControlledSelect
								options={[{ label: 'Option 1 inside main', value: 'option-1-inside-main' }]}
							/>
						</Main>
					</Root>,
				);

				// Layers should be open before resizing
				expect(screen.getByText('Option 1 inside side nav')).toBeVisible();
				expect(screen.getByText('Option 1 inside main')).toBeVisible();

				// Resize the side nav using keyboard
				const splitter = screen.getByRole('slider', { name: 'Resize side nav', hidden: true });
				splitter.focus();
				fireEvent.change(splitter, { target: { value: 120 } });

				// Layers should now be closed
				expect(screen.queryByText('Option 1 inside side nav')).not.toBeInTheDocument();
				expect(screen.queryByText('Option 1 inside main')).not.toBeInTheDocument();
			});

			it.each(openLayerLocations)(
				'should close uncontrolled popup select menus when resizing the side nav with mouse (menu %s open)',
				async (openLayerLocation) => {
					render(
						<Root>
							<SideNav testId="sidenav" defaultWidth={360}>
								sidenav
								<PanelSplitter label="Resize side nav" testId="panel-splitter" />
								<PopupSelect
									options={[
										{ label: 'Option 1 inside side nav', value: 'option-1-inside-side-nav' },
									]}
									target={({ isOpen: _isOpen, ...triggerProps }) => (
										<Button {...triggerProps}>Uncontrolled popup select</Button>
									)}
									defaultIsOpen={openLayerLocation === 'inside'}
								/>
							</SideNav>
							<Main>
								<PopupSelect
									options={[{ label: 'Option 1 inside main', value: 'option-1-inside-main' }]}
									target={({ isOpen: _isOpen, ...triggerProps }) => (
										<Button {...triggerProps}>Uncontrolled popup select</Button>
									)}
									defaultIsOpen={openLayerLocation === 'outside'}
								/>
							</Main>
						</Root>,
					);

					// The menu should be open before resizing
					expect(
						screen.getByText(
							openLayerLocation === 'inside' ? 'Option 1 inside side nav' : 'Option 1 inside main',
						),
					).toBeVisible();

					// Resize the side nav
					const splitter = screen.getByTestId('panel-splitter');
					fireEvent.dragStart(splitter, { clientX: 360 });
					fireEvent.dragEnter(splitter, { clientX: 420 });
					fireEvent.drop(splitter);

					// A top-layer popover unmounts its content after the exit, so let the exit finish
					await flushPopoverExit();

					// Layers should now be closed
					expect(screen.queryByText('Option 1 inside side nav')).not.toBeInTheDocument();
					expect(screen.queryByText('Option 1 inside main')).not.toBeInTheDocument();
				},
			);

			it.each(openLayerLocations)(
				'should close controlled popup select menus when resizing the side nav with mouse (menu %s open)',
				async (openLayerLocation) => {
					render(
						<Root>
							<SideNav testId="sidenav" defaultWidth={360}>
								sidenav
								<PanelSplitter label="Resize side nav" testId="panel-splitter" />
								<ControlledPopupSelect
									options={[
										{ label: 'Option 1 inside side nav', value: 'option-1-inside-side-nav' },
									]}
									defaultIsOpen={openLayerLocation === 'inside'}
								/>
							</SideNav>
							<Main>
								<ControlledPopupSelect
									options={[{ label: 'Option 1 inside main', value: 'option-1-inside-main' }]}
									defaultIsOpen={openLayerLocation === 'outside'}
								/>
							</Main>
						</Root>,
					);

					// The menu should be open before resizing
					expect(
						screen.getByText(
							openLayerLocation === 'inside' ? 'Option 1 inside side nav' : 'Option 1 inside main',
						),
					).toBeVisible();

					// Resize the side nav
					const splitter = screen.getByTestId('panel-splitter');
					fireEvent.dragStart(splitter, { clientX: 360 });
					fireEvent.dragEnter(splitter, { clientX: 420 });
					fireEvent.drop(splitter);

					// A top-layer popover unmounts its content after the exit, so let the exit finish
					await flushPopoverExit();

					// Layers should now be closed
					expect(screen.queryByText('Option 1 inside side nav')).not.toBeInTheDocument();
					expect(screen.queryByText('Option 1 inside main')).not.toBeInTheDocument();
				},
			);

			it.each(openLayerLocations)(
				'should close uncontrolled popup select menus when resizing the side nav with keyboard (menu %s open)',
				async (openLayerLocation) => {
					render(
						<Root>
							<SideNav testId="sidenav" defaultWidth={360}>
								sidenav
								<PanelSplitter label="Resize side nav" testId="panel-splitter" />
								<PopupSelect
									options={[
										{ label: 'Option 1 inside side nav', value: 'option-1-inside-side-nav' },
									]}
									target={({ isOpen: _isOpen, ...triggerProps }) => (
										<Button {...triggerProps}>Uncontrolled popup select</Button>
									)}
									defaultIsOpen={openLayerLocation === 'inside'}
								/>
							</SideNav>
							<Main>
								<PopupSelect
									options={[{ label: 'Option 1 inside main', value: 'option-1-inside-main' }]}
									target={({ isOpen: _isOpen, ...triggerProps }) => (
										<Button {...triggerProps}>Uncontrolled popup select</Button>
									)}
									defaultIsOpen={openLayerLocation === 'outside'}
								/>
							</Main>
						</Root>,
					);

					// The menu should be open before resizing
					expect(
						screen.getByText(
							openLayerLocation === 'inside' ? 'Option 1 inside side nav' : 'Option 1 inside main',
						),
					).toBeVisible();

					// Resize the side nav using keyboard
					const splitter = screen.getByRole('slider', { name: 'Resize side nav', hidden: true });
					splitter.focus();
					fireEvent.change(splitter, { target: { value: 120 } });

					// A top-layer popover unmounts its content after the exit, so let the exit finish
					await flushPopoverExit();

					// Layers should now be closed
					expect(screen.queryByText('Option 1 inside side nav')).not.toBeInTheDocument();
					expect(screen.queryByText('Option 1 inside main')).not.toBeInTheDocument();
				},
			);

			it.each(openLayerLocations)(
				'should close controlled popup select menus when resizing the side nav with keyboard (menu %s open)',
				async (openLayerLocation) => {
					render(
						<Root>
							<SideNav testId="sidenav" defaultWidth={360}>
								sidenav
								<PanelSplitter label="Resize side nav" testId="panel-splitter" />
								<ControlledPopupSelect
									options={[
										{ label: 'Option 1 inside side nav', value: 'option-1-inside-side-nav' },
									]}
									defaultIsOpen={openLayerLocation === 'inside'}
								/>
							</SideNav>
							<Main>
								<ControlledPopupSelect
									options={[{ label: 'Option 1 inside main', value: 'option-1-inside-main' }]}
									defaultIsOpen={openLayerLocation === 'outside'}
								/>
							</Main>
						</Root>,
					);

					// The menu should be open before resizing
					expect(
						screen.getByText(
							openLayerLocation === 'inside' ? 'Option 1 inside side nav' : 'Option 1 inside main',
						),
					).toBeVisible();

					// Resize the side nav using keyboard
					const splitter = screen.getByRole('slider', { name: 'Resize side nav', hidden: true });
					splitter.focus();
					fireEvent.change(splitter, { target: { value: 120 } });

					// A top-layer popover unmounts its content after the exit, so let the exit finish
					await flushPopoverExit();

					// Layers should now be closed
					expect(screen.queryByText('Option 1 inside side nav')).not.toBeInTheDocument();
					expect(screen.queryByText('Option 1 inside main')).not.toBeInTheDocument();
				},
			);
		});

		describe('side nav', () => {
			it('should update width when resized', () => {
				render(
					<Root>
						<SideNav testId="sidenav" defaultWidth={360}>
							sidenav
							<PanelSplitter label="Resize Side Nav" testId="panel-splitter" />
						</SideNav>
						<Main>main</Main>
					</Root>,
				);

				const splitter = screen.getByTestId('panel-splitter');

				fireEvent.dragStart(splitter, { clientX: 360 });
				fireEvent.dragEnter(splitter, { clientX: 420 });
				// Mocking computed width to be the dragged width, as it would in a browser.
				getPixelWidthMock.mockReturnValue(420);
				fireEvent.drop(splitter);

				expect(screen.getByTestId('sidenav')).toHaveStyle({
					'--n_sNvw': 'clamp(240px, 420px, 50vw)',
				});
			});

			it('should hoist the CSS width variable when resized', async () => {
				getPixelWidthMock.mockReturnValue(360);

				render(
					<Root UNSAFE_dangerouslyHoistSlotSizes>
						<SideNav testId="sidenav" defaultWidth={360}>
							sidenav
							<PanelSplitter label="Resize Side Nav" testId="panel-splitter" />
						</SideNav>
						<Main>main</Main>
					</Root>,
				);

				expect(screen.getByTestId('sidenav')).toHaveTextContent(
					':root { --leftSidebarWidth: var(--n_sNvlw) }',
				);
				expect(screen.getByTestId('sidenav')).toHaveTextContent(':root { --n_sNvlw: 0px }');
				expect(screen.getByTestId('sidenav')).toHaveTextContent(
					'@media (min-width: 64rem) { :root { --n_sNvlw: var(--n_snvRsz, clamp(240px, 360px, 50vw)) } }',
				);

				const splitter = screen.getByTestId('panel-splitter');

				fireEvent.dragStart(splitter, { clientX: 360 });
				fireEvent.dragEnter(splitter, { clientX: 420 });
				// Mocking computed width to be the dragged width, as it would in a browser.
				getPixelWidthMock.mockReturnValue(420);
				fireEvent.drop(splitter);

				expect(screen.getByTestId('sidenav')).toHaveTextContent(
					'@media (min-width: 64rem) { :root { --n_sNvlw: var(--n_snvRsz, clamp(240px, 420px, 50vw)) } }',
				);
			});
		});
	});

	describe('aside resizing', () => {
		it('should update width when resized', () => {
			render(
				<Root>
					<Aside testId="aside" defaultWidth={360}>
						aside
						<PanelSplitter label="Resize aside" testId="panel-splitter" />
					</Aside>
					<Main>main</Main>
				</Root>,
			);

			const splitter = screen.getByTestId('panel-splitter');

			fireEvent.dragStart(splitter, { clientX: 360 });
			fireEvent.dragEnter(splitter, { clientX: 420 });
			// Mocking computed width to be the dragged width, as it would in a browser.
			getPixelWidthMock.mockReturnValue(420);
			fireEvent.drop(splitter);

			expect(screen.getByTestId('aside')).toHaveStyle({
				'--n_asDw': 'clamp(0px, 420px, 50vw)',
			});
		});

		it('should hoist the CSS width variable when resized', async () => {
			getPixelWidthMock.mockReturnValue(360);

			render(
				<Root UNSAFE_dangerouslyHoistSlotSizes>
					<Aside testId="aside" defaultWidth={360}>
						aside
						<PanelSplitter label="Resize aside" testId="panel-splitter" />
					</Aside>
					<Main>main</Main>
				</Root>,
			);

			expect(screen.getByTestId('aside')).toHaveTextContent(':root { --rightSidebarWidth: 0px }');
			expect(screen.getByTestId('aside')).toHaveTextContent(
				'@media (min-width: 64rem) { :root { --rightSidebarWidth: var(--n_asdRsz, clamp(0px, 360px, 50vw)) } }',
			);

			const splitter = screen.getByTestId('panel-splitter');

			fireEvent.dragStart(splitter, { clientX: 360 });
			fireEvent.dragEnter(splitter, { clientX: 420 });
			// Mocking computed width to be the dragged width, as it would in a browser.
			getPixelWidthMock.mockReturnValue(420);
			fireEvent.drop(splitter);

			expect(screen.getByTestId('aside')).toHaveTextContent(':root { --rightSidebarWidth: 0px }');
			expect(screen.getByTestId('aside')).toHaveTextContent(
				'@media (min-width: 64rem) { :root { --rightSidebarWidth: var(--n_asdRsz, clamp(0px, 420px, 50vw)) } }',
			);
		});

		it.each(openLayerLocations)(
			'should close any open layers from both inside and outside the panel when resizing the panel (layer %s open)',
			async (openLayerLocation) => {
				render(
					<Root>
						<Main>
							<DropdownMenu
								shouldRenderToParent
								trigger="Dropdown in main - trigger"
								defaultOpen={openLayerLocation === 'outside'}
							>
								Dropdown in main - content
							</DropdownMenu>
						</Main>
						<Aside testId="aside" defaultWidth={360}>
							<DropdownMenu
								shouldRenderToParent
								trigger="Dropdown in aside - trigger"
								defaultOpen={openLayerLocation === 'inside'}
							>
								Dropdown in aside - content
							</DropdownMenu>

							<PanelSplitter label="Resize aside" testId="panel-splitter" />
						</Aside>
						<Main>main</Main>
					</Root>,
				);

				// The layer should be open before resizing
				expect(
					screen.getByText(
						openLayerLocation === 'inside'
							? 'Dropdown in aside - content'
							: 'Dropdown in main - content',
					),
				).toBeVisible();

				// Resize the aside
				const splitter = screen.getByTestId('panel-splitter');
				fireEvent.dragStart(splitter, { clientX: 360 });
				fireEvent.dragEnter(splitter, { clientX: 420 });
				fireEvent.drop(splitter);

				// A top-layer popover unmounts its content after the exit, so let the exit finish
				await flushPopoverExit();

				// Layers should now be closed
				expect(screen.queryByText('Dropdown in main - content')).not.toBeInTheDocument();
				expect(screen.queryByText('Dropdown in aside - content')).not.toBeInTheDocument();
			},
		);
	});

	describe('panel resizing', () => {
		it('should update width when resized', () => {
			render(
				<Root>
					<Panel testId="panel" defaultWidth={360}>
						panel
						<PanelSplitter label="Resize panel" testId="panel-splitter" />
					</Panel>
					<Main>main</Main>
				</Root>,
			);

			const splitter = screen.getByTestId('panel-splitter');

			fireEvent.dragStart(splitter, { clientX: 360 });
			fireEvent.dragEnter(splitter, { clientX: 420 });
			// Mocking computed width to be the dragged width, as it would in a browser.
			getPixelWidthMock.mockReturnValue(420);
			fireEvent.drop(splitter);

			expect(screen.getByTestId('panel')).toHaveStyle({
				'--n_pnlW':
					'clamp(360px, 420px, round(nearest, calc((100vw - var(--n_sNvlw, 0px)) / 2), 1px))',
			});
		});

		it('should hoist the CSS width variable when resized', async () => {
			getPixelWidthMock.mockReturnValue(360);

			render(
				<Root UNSAFE_dangerouslyHoistSlotSizes>
					<Panel testId="panel" defaultWidth={360}>
						panel
						<PanelSplitter label="Resize panel" testId="panel-splitter" />
					</Panel>
					<Main>main</Main>
				</Root>,
			);

			expect(screen.getByTestId('panel')).toHaveTextContent(':root { --rightPanelWidth: 0px }');
			expect(screen.getByTestId('panel')).toHaveTextContent(
				'@media (min-width: 90rem) { :root { --rightPanelWidth: var(--n_pnlRsz, clamp(360px, 360px, round(nearest, calc((100vw - var(--n_sNvlw, 0px)) / 2), 1px))) } }',
			);

			const splitter = screen.getByTestId('panel-splitter');

			fireEvent.dragStart(splitter, { clientX: 360 });
			fireEvent.dragEnter(splitter, { clientX: 420 });
			// Mocking computed width to be the dragged width, as it would in a browser.
			getPixelWidthMock.mockReturnValue(420);
			fireEvent.drop(splitter);

			expect(screen.getByTestId('panel')).toHaveTextContent(
				'@media (min-width: 90rem) { :root { --rightPanelWidth: var(--n_pnlRsz, clamp(360px, 420px, round(nearest, calc((100vw - var(--n_sNvlw, 0px)) / 2), 1px))) }',
			);
		});

		it.each(openLayerLocations)(
			'should close any open layers from both inside and outside the panel when resizing the panel (layer %s open)',
			async (openLayerLocation) => {
				render(
					<Root>
						<Main>
							<DropdownMenu
								shouldRenderToParent
								trigger="Dropdown in main - trigger"
								defaultOpen={openLayerLocation === 'outside'}
							>
								Dropdown in main - content
							</DropdownMenu>
						</Main>
						<Panel testId="panel" defaultWidth={360}>
							<DropdownMenu
								shouldRenderToParent
								trigger="Dropdown in panel - trigger"
								defaultOpen={openLayerLocation === 'inside'}
							>
								Dropdown in panel - content
							</DropdownMenu>

							<PanelSplitter label="Resize panel" testId="panel-splitter" />
						</Panel>
						<Main>main</Main>
					</Root>,
				);

				// The layer should be open before resizing
				expect(
					screen.getByText(
						openLayerLocation === 'inside'
							? 'Dropdown in panel - content'
							: 'Dropdown in main - content',
					),
				).toBeVisible();

				// Resize the panel
				const splitter = screen.getByTestId('panel-splitter');
				fireEvent.dragStart(splitter, { clientX: 360 });
				fireEvent.dragEnter(splitter, { clientX: 420 });
				fireEvent.drop(splitter);

				// A top-layer popover unmounts its content after the exit, so let the exit finish
				await flushPopoverExit();

				// Layers should now be closed
				expect(screen.queryByText('Dropdown in main - content')).not.toBeInTheDocument();
				expect(screen.queryByText('Dropdown in panel - content')).not.toBeInTheDocument();
			},
		);
	});
});
