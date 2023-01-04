import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';

import Chevron from '../../components/internal/chevron';

const controlledId = 'controlled_element_id';

test('accessibility', () => {
  render(<Chevron ariaControls={controlledId} isExpanded={false} />);

  const button = screen.getByRole('button');
  expect(button).toBeInTheDocument();
  expect(button.getAttribute('aria-controls')).toBe(controlledId);
});

test('expanded', () => {
  render(<Chevron ariaControls={controlledId} isExpanded />);

  const chevronLeftIcon = screen.queryByLabelText('Expand');
  const chevronRightIcon = screen.getByLabelText('Collapse');

  expect(chevronLeftIcon).not.toBeInTheDocument();
  expect(chevronRightIcon).toBeInTheDocument();
});

test('collapsed', () => {
  render(<Chevron ariaControls={controlledId} isExpanded={false} />);

  const chevronLeftIcon = screen.getByLabelText('Expand');
  const chevronRightIcon = screen.queryByLabelText('Collapse');

  expect(chevronLeftIcon).toBeInTheDocument();
  expect(chevronRightIcon).not.toBeInTheDocument();
});

test('onExpandToggle', () => {
  const onExpandToggle = jest.fn();
  render(
    <Chevron
      ariaControls={controlledId}
      onExpandToggle={onExpandToggle}
      isExpanded={false}
    />,
  );

  const button = screen.getByRole('button');
  fireEvent.click(button);

  expect(onExpandToggle).toHaveBeenCalled();
});
