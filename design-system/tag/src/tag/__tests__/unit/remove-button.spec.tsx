import React from 'react';

import { fireEvent, render } from '@testing-library/react';

import RemoveButton from '../../internal/removable/remove-button';

describe('<RemoveButton />', () => {
  it('should apply the given testId', () => {
    const { getByTestId } = render(<RemoveButton testId="remove-button" />);
    expect(getByTestId('remove-button')).toBeInTheDocument();
  });

  it('should have type="button"', () => {
    const { getByTestId } = render(<RemoveButton testId="remove-button" />);
    const removeButton = getByTestId('remove-button');
    expect(removeButton).toHaveAttribute('type', 'button');
  });

  it('should apply the given aria-label', () => {
    const { getByLabelText } = render(<RemoveButton aria-label="remove tag" />);
    expect(getByLabelText('remove tag')).toBeInTheDocument();
  });

  it('should apply the given onClick', () => {
    const onClick = jest.fn();
    const { getByTestId } = render(
      <RemoveButton onClick={onClick} testId="remove-button" />,
    );

    const removeButton = getByTestId('remove-button');
    fireEvent.click(removeButton);

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('should apply the given onFocus', () => {
    const onFocus = jest.fn();
    const { getByTestId } = render(
      <RemoveButton onFocus={onFocus} testId="remove-button" />,
    );

    const removeButton = getByTestId('remove-button');
    fireEvent.focus(removeButton);

    expect(onFocus).toHaveBeenCalledTimes(1);
  });

  it('should apply the given onBlur', () => {
    const onBlur = jest.fn();
    const { getByTestId } = render(
      <RemoveButton onBlur={onBlur} testId="remove-button" />,
    );

    const removeButton = getByTestId('remove-button');
    fireEvent.blur(removeButton);

    expect(onBlur).toHaveBeenCalledTimes(1);
  });

  it('should apply the given onKeyPress', () => {
    const onKeyPress = jest.fn();
    const { getByTestId } = render(
      <RemoveButton onKeyPress={onKeyPress} testId="remove-button" />,
    );

    const removeButton = getByTestId('remove-button');
    fireEvent.keyPress(removeButton, { key: 'Enter', keyCode: 13 });

    expect(onKeyPress).toHaveBeenCalledTimes(1);
  });

  it('should apply the given onMouseOver', () => {
    const onMouseOver = jest.fn();
    const { getByTestId } = render(
      // eslint-disable-next-line jsx-a11y/mouse-events-have-key-events
      <RemoveButton onMouseOver={onMouseOver} testId="remove-button" />,
    );

    const removeButton = getByTestId('remove-button');
    fireEvent.mouseOver(removeButton);

    expect(onMouseOver).toHaveBeenCalledTimes(1);
  });

  it('should apply the given onMouseOut', () => {
    const onMouseOut = jest.fn();
    const { getByTestId } = render(
      // eslint-disable-next-line jsx-a11y/mouse-events-have-key-events
      <RemoveButton onMouseOut={onMouseOut} testId="remove-button" />,
    );

    const removeButton = getByTestId('remove-button');
    fireEvent.mouseOut(removeButton);

    expect(onMouseOut).toHaveBeenCalledTimes(1);
  });
});
