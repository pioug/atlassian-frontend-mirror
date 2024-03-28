import React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { token } from '@atlaskit/tokens';

import AtlaskitRadioSelect from '../../../RadioSelect';

const user = userEvent.setup();

const OPTIONS = [
  { label: '0', value: 'zero' },
  { label: '1', value: 'one' },
  { label: '2', value: 'two' },
  { label: '3', value: 'three' },
  { label: '4', value: 'four' },
];

describe('Radio Select', () => {
  it('should load radio icons with options', () => {
    render(
      <AtlaskitRadioSelect menuIsOpen options={OPTIONS} aria-label="Options" />,
    );

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    // one icon represents select dropdown trigger
    expect(screen.getAllByRole('presentation', { hidden: true })).toHaveLength(
      6,
    );
  });

  it('should not close menu after an option is selected', async () => {
    render(
      <AtlaskitRadioSelect
        menuIsOpen={true}
        options={OPTIONS}
        aria-label="Options"
      />,
    );

    expect(screen.getByRole('combobox')).toHaveAttribute(
      'aria-expanded',
      'true',
    );

    await user.click(screen.getByText('1'));

    expect(screen.getByRole('combobox')).toHaveAttribute(
      'aria-expanded',
      'true',
    );
  });

  it('should mark option as selected on user click', async () => {
    render(
      <AtlaskitRadioSelect
        menuIsOpen={true}
        options={OPTIONS}
        aria-label="Options"
      />,
    );

    const radioToBeSelected = screen.getAllByRole('presentation', {
      hidden: true,
    })[1];

    expect(radioToBeSelected.parentElement).toHaveStyle(
      `--icon-secondary-color: transparent`,
    );

    await user.click(screen.getByText('0'));

    const selectedOption = screen.getAllByRole('presentation', {
      hidden: true,
    })[1];

    expect(selectedOption.parentElement).toHaveStyle(
      `--icon-secondary-color: ${token('elevation.surface', '#FFFFFF')}`,
    );
  });

  it('should not allow to select multiple options', async () => {
    render(
      <AtlaskitRadioSelect menuIsOpen options={OPTIONS} aria-label="Options" />,
    );

    expect(screen.getAllByText('1')).toHaveLength(1);
    expect(screen.getAllByText('2')).toHaveLength(1);

    await user.click(screen.getByText('1'));
    await user.click(screen.getByText('2'));

    expect(screen.getAllByText('1')).toHaveLength(1);
    expect(screen.getAllByText('2')).toHaveLength(2);
  });
});
