import React from 'react';
import { mount } from 'enzyme';
import { Frame } from '../..';
import { Wrapper } from '../../styled';

describe('Frame', () => {
  it('should not render interactive props when the frame is not clickable', () => {
    const element = mount(<Frame />);
    expect(element.find(Wrapper).props()).not.toEqual(
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
    expect(element.find(Wrapper).props()).toEqual(
      expect.objectContaining({
        isInteractive: true,
        tabIndex: 0,
        role: 'button',
      }),
    );
  });

  it('should call onClick when the card is clicked', () => {
    const onClick = jest.fn();
    const element = mount(<Frame onClick={onClick} />);
    element.simulate('click', {
      preventDefault: jest.fn(),
      stopPropagation: jest.fn(),
    });
    expect(onClick).toHaveBeenCalled();
  });

  it('should call onClick when the space key is pressed', () => {
    const onClick = jest.fn();
    const element = mount(<Frame onClick={onClick} />);
    element.simulate('keypress', {
      key: ' ',
      preventDefault: jest.fn(),
      stopPropagation: jest.fn(),
    });
    expect(onClick).toHaveBeenCalled();
  });

  it('should call onClick when the enter key is pressed', () => {
    const onClick = jest.fn();
    const element = mount(<Frame onClick={onClick} />);
    element.simulate('keypress', {
      key: 'Enter',
      preventDefault: jest.fn(),
      stopPropagation: jest.fn(),
    });
    expect(onClick).toHaveBeenCalled();
  });
});
