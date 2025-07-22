import React from 'react';

import { render } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import { mockSiteData } from '@atlaskit/link-test-helpers/datasource';

import { SiteSelector, type SiteSelectorProps } from './index';

describe('SiteSelector', () => {
	const mockOnSiteSelection = jest.fn();
	const renderSiteSelector = (propsOverride?: Partial<SiteSelectorProps>) => {
		const component = render(
			<IntlProvider locale="en">
				<SiteSelector
					testId={'my-selector'}
					availableSites={mockSiteData}
					selectedSite={mockSiteData[0]} // hello sorted alphabetically
					onSiteSelection={mockOnSiteSelection}
					{...(!!propsOverride && propsOverride)}
					label={{
						id: 'my-selector-label',
						defaultMessage: 'custom label',
					}}
				/>
			</IntlProvider>,
		);

		const getSiteSelector = async () => component.findByTestId('my-selector__control');

		// react-select doesn't seem to handle click events well
		const openSiteSelector = async () => (await getSiteSelector()).click();

		const getMenuOptions = async () =>
			component.findAllByTestId('my-selector-select--option', { exact: false });

		const getSelectedOptions = async () =>
			(await getMenuOptions()).filter((option) => option.getAttribute('aria-selected') === 'true');

		return {
			...component,
			getMenuOptions,
			getSelectedOptions,
			getSiteSelector,
			openSiteSelector,
		};
	};

	it('should display the selected site on load', async () => {
		const { getSiteSelector } = renderSiteSelector();

		expect(await getSiteSelector()).toHaveTextContent('hello');
	});

	it('should only select one site on mount', async () => {
		const { openSiteSelector, getSelectedOptions } = renderSiteSelector();

		await openSiteSelector();

		expect((await getSelectedOptions()).length).toEqual(1);
	});

	it('should call onSiteSelection callback with selected site name', async () => {
		const { openSiteSelector, getMenuOptions } = renderSiteSelector();

		await openSiteSelector();
		const jiraSiteDropdownItems = await getMenuOptions();
		jiraSiteDropdownItems[3].click();

		expect(mockOnSiteSelection).toHaveBeenCalledWith(mockSiteData[3]);
	});

	it('should display site names in alphabetical order', async () => {
		const { getMenuOptions, openSiteSelector } = renderSiteSelector();

		await openSiteSelector();

		const dropdownItems = (await getMenuOptions()).map((item) => item.textContent);
		const sortedDropdownItems = [...dropdownItems].sort();

		expect(dropdownItems).toEqual(sortedDropdownItems);
	});
	it('should capture and report a11y violations', async () => {
		const { container } = render(
			<IntlProvider locale="en">
				<SiteSelector
					testId={'my-selector'}
					availableSites={mockSiteData}
					selectedSite={mockSiteData[0]} // hello sorted alphabetically
					onSiteSelection={mockOnSiteSelection}
					label={{
						id: 'my-selector-label',
						defaultMessage: 'custom label',
					}}
				/>
			</IntlProvider>,
		);
		await expect(container).toBeAccessible();
	});
});
