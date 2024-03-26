import React from 'react';

import { fireEvent, render } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import { mockSiteData } from '@atlaskit/link-test-helpers/datasource';

import { SiteSelector, SiteSelectorProps } from './index';

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

    const getSiteSelector = () =>
      document.getElementsByClassName('my-selector__control')[0];

    // react-select doesn't seem to handle click events well
    const openSiteSelector = () => fireEvent.mouseDown(getSiteSelector());

    const getMenuOptions = () =>
      [
        ...document.getElementsByClassName('my-selector__option'),
      ] as HTMLElement[];

    const getSelectedOptions = () =>
      [
        ...document.getElementsByClassName('my-selector__option--is-selected'),
      ] as HTMLElement[];

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

    expect(getSiteSelector()).toHaveTextContent('hello');
  });

  it('should only select one site on mount', async () => {
    const { openSiteSelector, getSelectedOptions } = renderSiteSelector();

    openSiteSelector();

    expect(getSelectedOptions().length).toEqual(1);
  });

  it('should call onSiteSelection callback with selected site name', async () => {
    const { openSiteSelector, getMenuOptions } = renderSiteSelector();

    openSiteSelector();
    const jiraSiteDropdownItems = getMenuOptions();
    fireEvent.click(jiraSiteDropdownItems[3]);

    expect(mockOnSiteSelection).toHaveBeenCalledWith(mockSiteData[3]);
  });

  it('should display site names in alphabetical order', async () => {
    const { getMenuOptions, openSiteSelector } = renderSiteSelector();

    openSiteSelector();

    const dropdownItems = getMenuOptions().map(item => item.textContent);
    const sortedDropdownItems = [...dropdownItems].sort();

    expect(dropdownItems).toEqual(sortedDropdownItems);
  });
});
