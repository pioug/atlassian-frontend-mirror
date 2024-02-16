import React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from 'react-intl-next';

import { UserPickerField } from '../../../components/UserPickerField';

const defaultProps = {
  product: 'confluence',
  isBrowseUsersDisabled: false,
};
const renderUserPickerField = (optionProps?: any) => {
  const props = {
    ...defaultProps,
    ...optionProps,
  };
  return (
    <IntlProvider messages={{}} locale="en">
      <UserPickerField {...props} />
      <div>placeholder</div>
    </IntlProvider>
  );
};

it('should render UserPickerField', async () => {
  render(
    renderUserPickerField({
      allowEmail: true,
    }),
  );
  await screen.findByText('placeholder');
  const label = screen.getByText('Names, teams, groups, or emails');
  expect(label).toBeDefined();
});

it('should set custom header if passed as a prop', async () => {
  render(
    renderUserPickerField({
      allowEmail: true,
      userPickerOptions: {
        header: 'test header',
        noOptionsMessageHandler: jest.fn(),
      },
    }),
  );
  await screen.findByText('placeholder');
  const label = screen.getByText('Names, teams, groups, or emails');
  expect(label).toBeDefined();
  const user = userEvent.setup();
  await user.click(screen.getByRole('combobox'));
  await user.keyboard('[Enter]');
  expect(screen.getByText('test header')).toBeDefined();
});

it('should call noOptionsMessageHandler if user input text return no match', async () => {
  const mockNoOptionsMessageHandler = jest.fn();
  render(
    renderUserPickerField({
      allowEmail: false,
      userPickerOptions: {
        noOptionsMessageHandler: mockNoOptionsMessageHandler,
      },
    }),
  );
  await screen.findByText('placeholder');
  const label = screen.getByText('Names, teams, groups, or emails');
  expect(label).toBeDefined();
  const user = userEvent.setup();
  await user.click(screen.getByRole('combobox'));
  await user.keyboard('zsd');
  expect(mockNoOptionsMessageHandler).toHaveBeenCalled();
});
