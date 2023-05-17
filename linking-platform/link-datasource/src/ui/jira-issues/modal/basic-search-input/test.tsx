import React from 'react';

import { render } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import { BasicSearchInput, BasicSearchInputProps } from './index';

describe('BasicSearchInput', () => {
  const setup = (propsOverride: Partial<BasicSearchInputProps> = {}) => {
    const mockOnChange = jest.fn();
    const mockOnSearch = jest.fn();

    const component = render(
      <IntlProvider locale="en">
        <BasicSearchInput
          onChange={mockOnChange}
          onSearch={mockOnSearch}
          searchTerm="testing"
          testId="basic-search-input"
          {...propsOverride}
        />
      </IntlProvider>,
    );

    return { mockOnChange, mockOnSearch, ...component };
  };

  it('renders with the provided input text', async () => {
    const { getByDisplayValue } = setup();

    expect(getByDisplayValue('testing')).toBeInTheDocument();
  });

  it('calls onSearch with the input text', async () => {
    const { findByTestId, mockOnSearch } = setup();

    (
      await findByTestId('jira-jql-datasource-modal--basic-search-button')
    ).click();

    expect(mockOnSearch).toHaveBeenCalledWith('testing');
  });

  it('disables search button when expected', async () => {
    const { findByTestId, mockOnSearch } = setup({ isDisabled: true });

    const searchButton = await findByTestId(
      'jira-jql-datasource-modal--basic-search-button',
    );

    expect(searchButton).toBeDisabled();

    searchButton.click();
    expect(mockOnSearch).not.toHaveBeenCalled();
  });

  it('shows search button in a loading state when searching', async () => {
    const { findByTestId } = setup({ isSearching: true });

    const searchButton = await findByTestId(
      'jira-jql-datasource-modal--basic-search-button',
    );

    expect(searchButton.getAttribute('data-has-overlay')).toEqual('true');
  });
});
