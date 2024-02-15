import React from 'react';

import { fireEvent, render } from '@testing-library/react';

import Chevron from '../../components/internal/chevron';

describe('Chevron', () => {
  const controlledId = 'controlled_element_id';

  it('should have aria-controls', () => {
    const { getByRole } = render(
      <Chevron ariaControls={controlledId} rowId="1" />,
    );

    const button = getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-controls', controlledId);
  });

  it('should give context of the row ID in the label', () => {
    const changedRowId = '100';
    const { getByText } = render(<Chevron rowId={changedRowId} />);

    const chevronIconWithRowIdInLabel = getByText(new RegExp(changedRowId));
    expect(chevronIconWithRowIdInLabel).toBeInTheDocument();
  });

  it('should give context of the row content in the label', () => {
    const extendedLabel = 'Chapter 1: Clean Code';
    const { getByText } = render(
      <Chevron rowId="1" extendedLabel={extendedLabel} />,
    );

    const labelElement = getByText(new RegExp(extendedLabel));
    expect(labelElement).toBeInTheDocument();
  });

  test('expanded', () => {
    const { getByText, queryByText } = render(
      <Chevron isExpanded={true} rowId="1" />,
    );

    const chevronLeftIconLabel = queryByText(/Expand/);
    const chevronRightIconLabel = getByText(/Collapse/);

    expect(chevronLeftIconLabel).not.toBeInTheDocument();
    expect(chevronRightIconLabel).toBeInTheDocument();
  });

  test('collapsed', () => {
    const { getByText, queryByText } = render(
      <Chevron isExpanded={false} rowId="1" />,
    );

    const chevronLeftIcon = getByText(/Expand/);
    const chevronRightIcon = queryByText(/Collapse/);

    expect(chevronLeftIcon).toBeInTheDocument();
    expect(chevronRightIcon).not.toBeInTheDocument();
  });

  test('onExpandToggle', () => {
    const onExpandToggle = jest.fn();
    const { getByRole } = render(
      <Chevron onExpandToggle={onExpandToggle} rowId="1" />,
    );

    const button = getByRole('button');
    fireEvent.click(button);

    expect(onExpandToggle).toHaveBeenCalled();
  });
});
