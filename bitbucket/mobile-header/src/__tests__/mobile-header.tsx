import React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import AkButton from '@atlaskit/button';
import ButtonGroup from '@atlaskit/button/button-group';
import { skipAutoA11yFile } from '@atlassian/a11y-jest-testing';

import MobileHeader from '../components/MobileHeader';

// This file exposes one or more accessibility violations. Testing is currently skipped but violations need to
// be fixed in a timely manner or result in escalation. Once all violations have been fixed, you can remove
// the next line and associated import. For more information, see go/afm-a11y-tooling:jest
skipAutoA11yFile();

const Navigation = (isOpen: boolean) => isOpen && <div data-nav="true" />;
const Sidebar = (isOpen: boolean) => isOpen && <div data-sidebar="true" />;

test('clicking hamburger button fires onNavigationOpen', async () => {
	const openSpy = jest.fn();
	const closeSpy = jest.fn();
	render(
		<MobileHeader
			drawerState="none"
			menuIconLabel=""
			navigation={Navigation}
			sidebar={Sidebar}
			onDrawerClose={closeSpy}
			onNavigationOpen={openSpy}
			pageHeading=""
		/>,
	);
	await userEvent.click(screen.getByRole('button'));
	expect(openSpy).toHaveBeenCalledTimes(1);
});

test('passing drawerState="navigation" should render nav', () => {
	const openSpy = jest.fn();
	const navSpy = jest.fn();
	const sidebarSpy = jest.fn();
	const closeSpy = jest.fn();
	render(
		<MobileHeader
			menuIconLabel=""
			navigation={navSpy}
			sidebar={sidebarSpy}
			onDrawerClose={closeSpy}
			onNavigationOpen={openSpy}
			drawerState="navigation"
			pageHeading=""
		/>,
	);
	expect(navSpy).toHaveBeenCalledTimes(1);
	expect(navSpy).toHaveBeenCalledWith(true);
	expect(sidebarSpy).toHaveBeenCalledTimes(0);
});

test('passing drawerState="sidebar" should render sidebar', () => {
	const openSpy = jest.fn();
	const navSpy = jest.fn();
	const sidebarSpy = jest.fn();
	const closeSpy = jest.fn();
	render(
		<MobileHeader
			menuIconLabel=""
			navigation={navSpy}
			sidebar={sidebarSpy}
			drawerState="sidebar"
			onDrawerClose={closeSpy}
			onNavigationOpen={openSpy}
			pageHeading=""
		/>,
	);
	expect(navSpy).toHaveBeenCalledTimes(0);
	expect(sidebarSpy).toHaveBeenCalledTimes(1);
	expect(sidebarSpy).toHaveBeenCalledWith(true);
});

test('clicking blanket calls onDrawerClose', async () => {
	const openSpy = jest.fn();
	const closeSpy = jest.fn();
	render(
		<MobileHeader
			menuIconLabel=""
			navigation={Navigation}
			sidebar={Sidebar}
			onDrawerClose={closeSpy}
			onNavigationOpen={openSpy}
			drawerState="navigation"
			pageHeading=""
		/>,
	);
	await userEvent.click(screen.getByTestId('fake-blanket'));
	expect(closeSpy).toHaveBeenCalledTimes(1);
});

test('renders the page title', () => {
	const openSpy = jest.fn();
	const navSpy = jest.fn();
	const closeSpy = jest.fn();
	const sidebarSpy = jest.fn();
	render(
		<MobileHeader
			menuIconLabel=""
			navigation={navSpy}
			sidebar={sidebarSpy}
			onDrawerClose={closeSpy}
			onNavigationOpen={openSpy}
			drawerState="none"
			pageHeading="Pull requests"
		/>,
	);
	expect(screen.getByText('Pull requests')).toBeInTheDocument();
});

test('renders the secondary content if provided', () => {
	const navSpy = jest.fn();
	const closeSpy = jest.fn();
	const openSpy = jest.fn();
	const sidebarSpy = jest.fn();
	render(
		<MobileHeader
			menuIconLabel=""
			navigation={navSpy}
			sidebar={sidebarSpy}
			onDrawerClose={closeSpy}
			onNavigationOpen={openSpy}
			drawerState="none"
			secondaryContent={
				<ButtonGroup>
					<AkButton>One</AkButton>
					<AkButton>Two</AkButton>
				</ButtonGroup>
			}
			pageHeading=""
		/>,
	);

	// should include 1 menu button and 2 buttons in secondary content
	expect(screen.queryAllByRole('button').length).toBe(3);
});

test('renders the custom menu content if provided', () => {
	const closeSpy = jest.fn();
	const openSpy = jest.fn();
	const sidebarSpy = jest.fn();
	render(
		<MobileHeader
			customMenu={<AkButton>Test</AkButton>}
			menuIconLabel="menu icon"
			sidebar={sidebarSpy}
			onDrawerClose={closeSpy}
			onNavigationOpen={openSpy}
			drawerState="none"
			pageHeading=""
		/>,
	);

	expect(screen.getByText('Test')).toBeInTheDocument();
	expect(screen.queryAllByRole('button').length).toBe(1);
	expect(screen.queryByLabelText('menu icon')).not.toBeInTheDocument();
});
