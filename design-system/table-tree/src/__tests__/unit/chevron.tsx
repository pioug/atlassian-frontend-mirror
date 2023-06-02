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
    expect(button.getAttribute('aria-controls')).toBe(controlledId);
  });

  it('should give context of the row ID in the label', () => {
    const changedRowId = '100';
    const { getByLabelText } = render(<Chevron rowId={changedRowId} />);

    const chevronIconWithRowIdInLabel = getByLabelText(
      new RegExp(changedRowId),
    );
    expect(chevronIconWithRowIdInLabel).toBeInTheDocument();
  });

  it('should give context of the row content in the label', () => {
    const extendedLabel = 'Chapter 1: Clean Code';
    const { getByLabelText } = render(
      <Chevron rowId="1" extendedLabel={extendedLabel} />,
    );

    const chevronIconWithRowIdInLabel = getByLabelText(
      new RegExp(extendedLabel),
    );
    expect(chevronIconWithRowIdInLabel).toBeInTheDocument();
  });

  test('expanded', () => {
    const { getByLabelText, queryByLabelText } = render(
      <Chevron isExpanded={true} rowId="1" />,
    );

    const chevronLeftIcon = queryByLabelText(/Expand/);
    const chevronRightIcon = getByLabelText(/Collapse/);

    expect(chevronLeftIcon).not.toBeInTheDocument();
    expect(chevronRightIcon).toBeInTheDocument();
  });

  test('collapsed', () => {
    const { getByLabelText, queryByLabelText } = render(
      <Chevron isExpanded={false} rowId="1" />,
    );

    const chevronLeftIcon = getByLabelText(/Expand/);
    const chevronRightIcon = queryByLabelText(/Collapse/);

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
