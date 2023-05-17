import React from 'react';

import { render } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import { mockSiteData } from '../../../../../examples-helpers/mockJiraAvailableSites';

import { JiraSiteSelector, JiraSiteSelectorProps } from './index';

describe('JiraSiteSelector', () => {
  const mockOnSiteSelection = jest.fn();
  const renderSiteSelector = (propsOverride?: Partial<JiraSiteSelectorProps>) =>
    render(
      <IntlProvider locale="en">
        <JiraSiteSelector
          testId={'my-selector'}
          availableSites={mockSiteData}
          selectedJiraSite={mockSiteData[2]}
          onSiteSelection={mockOnSiteSelection}
          {...(!!propsOverride && propsOverride)}
        />
      </IntlProvider>,
    );

  it('should display the selected site on load', async () => {
    const { getByTestId } = renderSiteSelector();

    // click dropdown button to open list dropdown
    getByTestId('my-selector--trigger').click();

    // find the selected item checkmark then find its sibling element which should be the site displayName
    // parentNode is required because checkmark icon is wrapped in another span that isn't uniquely identifiable
    const selectedItem = getByTestId('my-selector--dropdown-item__selected');

    expect(selectedItem).toHaveTextContent('hello');
  });

  it('should only ever display one checkmark', async () => {
    const { getByTestId } = renderSiteSelector();

    // click dropdown button to open list dropdown
    getByTestId('my-selector--trigger').click();

    const selectedCheckmarkNodes = getByTestId(
      'my-selector--dropdown-item__selected',
    );

    expect(selectedCheckmarkNodes).toBeInTheDocument();
  });

  it('should call onSiteSelection callback with selected site name', async () => {
    const { getAllByRole, getByTestId } = renderSiteSelector();

    // click dropdown button to open list dropdown
    getByTestId('my-selector--trigger').click();

    const jiraSiteDropdownItem = getAllByRole('menuitem');

    jiraSiteDropdownItem[3].click();

    expect(mockOnSiteSelection).toHaveBeenCalledWith(mockSiteData[3]);
  });
});
