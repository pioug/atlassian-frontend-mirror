import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { render, fireEvent } from '@testing-library/react';
import QuestionCircleIcon from '@atlaskit/icon/core/question-circle';
import { createIntl, createIntlCache, IntlProvider } from 'react-intl-next';

import { messages } from '../../../messages';

import { HelpLayout } from '../../HelpLayout';

// Messages
const cache = createIntlCache();
const intl = createIntl(
	{
		locale: 'en',
		messages: {},
	},
	cache,
);
const messageClose = intl.formatMessage(messages.help_panel_header_close);
const messageBack = intl.formatMessage(messages.help_panel_header_back);
const messageLoading = intl.formatMessage(messages.help_loading);

// Mock props
const mockOnCloseButtonClick = jest.fn();
const mockOnBackButtonClick = jest.fn();

const defaultContentText = <div id="mock-content">Mock Content</div>;

describe('BackButton', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should capture and report a11y violations', async () => {
		const { container } = render(
			<IntlProvider locale="en">
				<HelpLayout
					isBackbuttonVisible={false}
					isLoading={false}
					onCloseButtonClick={mockOnCloseButtonClick}
					onBackButtonClick={mockOnBackButtonClick}
					footer={<div id="mock-footer">Footer</div>}
				>
					<div>{defaultContentText}</div>
				</HelpLayout>
			</IntlProvider>,
		);

		await expect(container).toBeAccessible();
	});

	it('Should display the close button if the props mockOnCloseButtonClick is defined', () => {
		const { queryByLabelText } = render(
			<IntlProvider locale="en">
				<HelpLayout
					isBackbuttonVisible={false}
					isLoading={false}
					onCloseButtonClick={mockOnCloseButtonClick}
					onBackButtonClick={mockOnBackButtonClick}
					footer={<div id="mock-footer">Footer</div>}
				>
					<div>{defaultContentText}</div>
				</HelpLayout>
			</IntlProvider>,
		);

		const closeButton = queryByLabelText(messageClose);

		expect(closeButton).not.toBeNull();
	});

	it('Should NOT display the close button if the props mockOnCloseButtonClick is undefined or null', () => {
		const { queryByLabelText } = render(
			<IntlProvider locale="en">
				<HelpLayout
					isBackbuttonVisible={false}
					isLoading={false}
					onBackButtonClick={mockOnBackButtonClick}
					footer={<div id="mock-footer">Footer</div>}
				>
					<div>{defaultContentText}</div>
				</HelpLayout>
			</IntlProvider>,
		);

		const closeButton = queryByLabelText(messageClose);

		expect(closeButton).toBeNull();
	});

	it('Should display the back button if the props isBackbuttonVisible is true', () => {
		const { queryAllByText } = render(
			<IntlProvider locale="en">
				<HelpLayout
					isBackbuttonVisible={true}
					isLoading={false}
					onCloseButtonClick={mockOnCloseButtonClick}
					onBackButtonClick={mockOnBackButtonClick}
					footer={<div id="mock-footer">Footer</div>}
				>
					<div>{defaultContentText}</div>
				</HelpLayout>
			</IntlProvider>,
		);

		const backButton = queryAllByText(messageBack);

		expect(backButton).not.toBeNull();
	});

	it('Should call onCloseButtonClick when the user clicks the Close button', () => {
		const { queryByLabelText } = render(
			<IntlProvider locale="en">
				<HelpLayout
					isBackbuttonVisible={true}
					isLoading={false}
					onCloseButtonClick={mockOnCloseButtonClick}
					onBackButtonClick={mockOnBackButtonClick}
					footer={<div id="mock-footer">Footer</div>}
				>
					<div>{defaultContentText}</div>
				</HelpLayout>
			</IntlProvider>,
		);

		const closeButton = queryByLabelText(messageClose)!.closest('button');
		expect(closeButton).not.toBeNull();

		if (closeButton) {
			fireEvent.click(closeButton);

			expect(mockOnCloseButtonClick).toHaveBeenCalledTimes(1);
		}
	});

	it('Should call onBackButtonClick when the user clicks the Back button', () => {
		const { queryByText } = render(
			<IntlProvider locale="en">
				<HelpLayout
					isBackbuttonVisible={true}
					isLoading={false}
					onCloseButtonClick={mockOnCloseButtonClick}
					onBackButtonClick={mockOnBackButtonClick}
					footer={<div id="mock-footer">Footer</div>}
				>
					<div>{defaultContentText}</div>
				</HelpLayout>
			</IntlProvider>,
		);

		const backButton = queryByText(messageBack);
		expect(backButton).not.toBeNull();

		if (backButton) {
			fireEvent.click(backButton);

			expect(mockOnBackButtonClick).toHaveBeenCalledTimes(1);
		}
	});

	it('Should show the loading state when isLoading = true', () => {
		const { queryByLabelText } = render(
			<IntlProvider locale="en">
				<HelpLayout
					isBackbuttonVisible={true}
					isLoading={true}
					onCloseButtonClick={mockOnCloseButtonClick}
					onBackButtonClick={mockOnBackButtonClick}
					footer={<div id="mock-footer">Footer</div>}
				>
					<div>{defaultContentText}</div>
				</HelpLayout>
			</IntlProvider>,
		);

		const loadingImg = queryByLabelText(messageLoading);
		expect(loadingImg).not.toBeNull();
	});
});

describe('Help Layout with Side Nav', () => {
	const mockSideNavTabs = [
		{
			icon: <QuestionCircleIcon label={'help tab'} />,
			label: 'help',
			contentRender: () => <div>Help Tab Content</div>,
			header: {
				title: 'Help',
			},
		},
		{
			icon: <QuestionCircleIcon label={'search tab'} />,
			label: 'search',
			contentRender: () => <div>Search Tab Content</div>,
			header: {
				title: 'Search',
			},
		},
	];

	it('Should render the side nav when sideNavTabs is defined', () => {
		const { queryByTestId } = render(
			<IntlProvider locale="en">
				<HelpLayout
					isBackbuttonVisible={false}
					isLoading={false}
					onCloseButtonClick={mockOnCloseButtonClick}
					onBackButtonClick={mockOnBackButtonClick}
					sideNavTabs={mockSideNavTabs}
				>
					<div>{defaultContentText}</div>
				</HelpLayout>
			</IntlProvider>,
		);

		const sideNav = queryByTestId('side-nav-tabs');
		expect(sideNav).not.toBeNull();
	});

	it('Should render side tabs', () => {
		const { queryByTestId } = render(
			<IntlProvider locale="en">
				<HelpLayout
					isBackbuttonVisible={false}
					isLoading={false}
					onCloseButtonClick={mockOnCloseButtonClick}
					onBackButtonClick={mockOnBackButtonClick}
					sideNavTabs={mockSideNavTabs}
				>
					<div>{defaultContentText}</div>
				</HelpLayout>
			</IntlProvider>,
		);
		const searchTab = queryByTestId('side-nav-search');
		const helpTab = queryByTestId('side-nav-help');
		expect(searchTab).not.toBeNull();
		expect(helpTab).not.toBeNull();
	});
});
