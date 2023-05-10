import React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import AtlaskitSelect from '../../..';

const user = userEvent.setup();

const OPTIONS = [
  { label: '0', value: 'zero' },
  { label: '1', value: 'one' },
  { label: '2', value: 'two' },
  { label: '3', value: 'three' },
  { label: '4', value: 'four' },
];

describe('Select', () => {
  // temporarily skip this test as part of DST-2476 resolution
  it.skip('should load the animated component as default', () => {
    render(<AtlaskitSelect />);

    expect(screen.getByText('Transition')).toBeInTheDocument();
  });

  it('should toggle the menu on dropdown indicator click', async () => {
    render(<AtlaskitSelect classNamePrefix="react-select" />);

    // Menu closed by default
    expect(screen.getByRole('combobox')).toHaveAttribute(
      'aria-expanded',
      'false',
    );

    await user.click(screen.getByText('Select...'));

    // Menu to open
    expect(screen.getByRole('combobox')).toHaveAttribute(
      'aria-expanded',
      'true',
    );
  });

  describe('single value select', () => {
    it('should show the default AtlaskitSelected value', () => {
      render(<AtlaskitSelect options={OPTIONS} value={OPTIONS[0]} />);

      // Hides options cause the menu is closed
      expect(screen.queryByText('1')).not.toBeInTheDocument();
      // Displays the provided value
      expect(screen.getByText('0')).toBeInTheDocument();
    });
  });

  describe('multi value select', () => {
    it('should show the default AtlaskitSelected value', () => {
      render(
        <AtlaskitSelect
          options={OPTIONS}
          isMulti
          value={[OPTIONS[0], OPTIONS[3]]}
        />,
      );

      // Hides options cause the menu is closed
      expect(screen.queryByText('1')).not.toBeInTheDocument();
      // Displays the provided values
      expect(screen.getByText('0')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('should show clear icons on selections plus clear icon for whole select', () => {
      render(
        <AtlaskitSelect
          className="multi-select"
          classNamePrefix="react-select"
          defaultValue={OPTIONS.slice(3, 5)}
          options={OPTIONS}
          isMulti
        />,
      );

      const clearIcons = screen.getAllByTestId('show-clear-icon');

      expect(clearIcons.length).toBe(2);
    });

    it('disabled multiselect should not show clear icon on selections or select itself', () => {
      render(
        <AtlaskitSelect
          isDisabled
          className="multi-select"
          classNamePrefix="react-select"
          defaultValue={OPTIONS.slice(3, 5)}
          options={OPTIONS}
          isMulti
        />,
      );

      const clearIcons = screen.getAllByTestId('hide-clear-icon');

      expect(clearIcons.length).toBe(2);
    });
  });

  it('should disable options if isDisabled prop is true', async () => {
    const { container } = render(
      <AtlaskitSelect
        isDisabled
        className="multi-select"
        classNamePrefix="react-select"
        options={OPTIONS}
        isMulti
      />,
    );

    expect(screen.getByText('Select...')).toBeInTheDocument();

    const selectControl = container.getElementsByClassName(
      'react-select__control--is-disabled',
    );

    expect(selectControl).toHaveLength(1);
    expect(selectControl[0]).toHaveStyle('pointer-events: none');
  });

  it('should not disable options if isDisabled prop is false', async () => {
    render(
      <AtlaskitSelect
        isDisabled={false}
        className="multi-select"
        classNamePrefix="react-select"
        options={OPTIONS}
        isMulti
      />,
    );

    await user.click(screen.getByText('Select...'));

    expect(screen.getByRole('combobox')).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('should display options with group inside menu', () => {
    const options = [
      {
        label: 'group',
        options: [
          { value: 1, label: '1' },
          { value: 2, label: '2' },
        ],
      },
    ];
    render(<AtlaskitSelect options={options} menuIsOpen />);

    expect(screen.getByText('group')).toBeInTheDocument();
    expect(screen.getAllByText('group')).toHaveLength(1);

    const groupContainer = screen.getByText('group').parentNode;

    if (groupContainer) {
      expect(groupContainer).toBeInTheDocument();

      const optionWrapper = groupContainer.childNodes[1];

      expect(optionWrapper).toHaveTextContent('1');
      expect(optionWrapper).toHaveTextContent('2');
    } else {
      fail('expected group container to exist');
    }
  });

  it('should  render only groups with a match when filtering', async () => {
    const options = [
      {
        label: 'group 1',
        options: [
          { value: 1, label: '1' },
          { value: 2, label: '2' },
        ],
      },
      {
        label: 'group 2',
        options: [
          { value: 3, label: '3' },
          { value: 4, label: '4' },
        ],
      },
    ];
    render(<AtlaskitSelect options={options} menuIsOpen />);

    await user.click(screen.getByRole('combobox'));
    await user.keyboard('1');

    expect(screen.getByRole('combobox')).toHaveValue('1');
    expect(screen.getByText('group 1')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.queryByText('2')).not.toBeInTheDocument();
    expect(screen.queryByText('group 2')).not.toBeInTheDocument();
  });

  it('should not render any groups when there is no match when filtering', async () => {
    const options = [
      {
        label: 'group 1',
        options: [
          { value: 1, label: '1' },
          { value: 2, label: '2' },
        ],
      },
      {
        label: 'group 2',
        options: [
          { value: 3, label: '3' },
          { value: 4, label: '4' },
        ],
      },
    ];
    render(<AtlaskitSelect options={options} menuIsOpen />);

    await user.click(screen.getByRole('combobox'));
    await user.keyboard('5');

    expect(screen.getByRole('combobox')).toHaveValue('5');
    expect(screen.queryByText('group 1')).not.toBeInTheDocument();
    expect(screen.queryByText('group 2')).not.toBeInTheDocument();
  });

  it('should autoFocus on the AtlaskitSelect when autoFocus is set to true', async () => {
    render(<AtlaskitSelect options={OPTIONS} autoFocus />);

    await user.keyboard('5');

    expect(screen.getByRole('combobox')).toHaveValue('5');
  });

  it('should not autoFocus on the AtlaskitSelect when autoFocus is set to false', async () => {
    render(<AtlaskitSelect options={OPTIONS} autoFocus={false} />);

    await user.keyboard('5');

    expect(screen.getByRole('combobox')).toHaveValue('');
  });

  it('should pass the className down to react-select', () => {
    const { container } = render(
      <AtlaskitSelect className="custom-class-name" />,
    );

    const selectWrapper = container.getElementsByClassName('custom-class-name');

    expect(selectWrapper).toHaveLength(1);
  });

  it('should render a hidden form field when name prop is passed', () => {
    const { container } = render(
      <AtlaskitSelect name="test-name" className="custom-class-name" />,
    );

    const inputs = container.getElementsByTagName('input');

    expect(inputs).toHaveLength(2);
    expect(inputs[1]).toHaveValue('');
    expect(inputs[1]).toHaveAttribute('type', 'hidden');
  });

  /**
   * filterOption is getting called multiple for a change in inputValue
   */
  /* eslint-disable jest/no-disabled-tests */
  it.skip('should call filterOption when input of select is changed', async () => {
    const filterOptionSpy = jest.fn();
    render(
      <AtlaskitSelect
        options={OPTIONS}
        filterOption={filterOptionSpy}
        autofocus
      />,
    );

    await user.keyboard('5');
    await user.clear(screen.getByText('Select...'));
    await user.keyboard('1');

    expect(filterOptionSpy).toHaveBeenCalledTimes(2);
  });
  /* eslint-enable jest/no-disabled-tests */
});
