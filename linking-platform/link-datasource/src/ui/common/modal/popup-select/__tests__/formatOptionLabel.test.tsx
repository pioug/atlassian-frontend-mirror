import { render } from '@testing-library/react';

import formatOptionLabel from '../formatOptionLabel';
import { SelectOption } from '../types';

describe('Testing formatOptionLabel', () => {
  const setup = (props: SelectOption) => {
    return render(formatOptionLabel(props));
  };

  it('should render the lozenge component when optionType is lozengeLabel', () => {
    const { queryByTestId } = setup({
      optionType: 'lozengeLabel',
      label: 'Done',
      value: 'done',
    });

    expect(
      queryByTestId('basic-filter-popup-select-option--lozenge'),
    ).toBeInTheDocument();
  });

  it('should render the avatar component when optionType is avatarLabel', () => {
    const { queryByTestId } = setup({
      optionType: 'avatarLabel',
      label: 'Bob',
      value: 'bob',
    });

    expect(
      queryByTestId('basic-filter-popup-select-option--avatar'),
    ).toBeInTheDocument();
  });

  it('should render the icon+label component when optionType is iconLabel', () => {
    const { queryByTestId } = setup({
      optionType: 'iconLabel',
      label: 'Bob',
      value: 'bob',
      icon: '',
    });

    expect(
      queryByTestId('basic-filter-popup-select-option--icon-label'),
    ).toBeInTheDocument();
  });

  it('should default to icon+label component when optionType is invalid', () => {
    const { container } = setup({
      optionType: 'blablabla' as any,
      label: 'Bob',
      value: 'bob',
      icon: '',
    });

    // Assert that the container contains no children
    expect(container.childNodes.length).toBe(0);
  });
});
