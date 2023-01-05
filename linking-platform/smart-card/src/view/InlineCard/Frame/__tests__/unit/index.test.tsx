import React from 'react';
import { mount } from 'enzyme';
import { render, screen, fireEvent } from '@testing-library/react';

import { Frame } from '../..';
import { WrapperSpan, WrapperAnchor } from '../../styled';

describe('Frame', () => {
  it('should not render interactive props when the frame is not clickable', () => {
    const element = mount(<Frame />);
    expect(element.find(WrapperSpan).props()).not.toEqual(
      expect.objectContaining({
        isInteractive: true,
        tabIndex: 0,
        role: 'button',
      }),
    );
  });

  it('should render interactive props when the frame is clickable', () => {
    const element = mount(
      <Frame
        onClick={() => {
          /* noop */
        }}
      />,
    );
    expect(element.find(WrapperAnchor).props()).toEqual(
      expect.objectContaining({
        isInteractive: true,
        tabIndex: 0,
        role: 'button',
      }),
    );
  });

  it('should call onClick when the card is clicked', () => {
    const onClick = jest.fn();
    render(<Frame onClick={onClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalled();
  });

  it('should call onClick when the space key is pressed', () => {
    const onClick = jest.fn();
    render(<Frame onClick={onClick} />);

    screen.getByRole('button').focus();

    fireEvent.keyPress(screen.getByRole('button'), {
      key: ' ',
      charCode: 32, // note: hacky — for unknown reasons the space event listener is not triggered without charCode
    });
    expect(onClick).toHaveBeenCalled();
  });

  it('should call onClick when the enter key is pressed', () => {
    const onClick = jest.fn();
    render(<Frame onClick={onClick} />);
    fireEvent.keyPress(screen.getByRole('button'), {
      keyCode: '13',
    });
    expect(onClick).toHaveBeenCalled();
  });
});
