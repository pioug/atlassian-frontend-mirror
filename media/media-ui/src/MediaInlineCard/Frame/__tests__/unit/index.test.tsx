import React from 'react';
import { shallow } from 'enzyme';
import { Frame } from '../..';

describe('Frame', () => {
  it('should call onClick when the card is clicked', () => {
    const onClick = jest.fn();
    const element = shallow(<Frame onClick={onClick} />);
    element.simulate('click', {
      preventDefault: jest.fn(),
      stopPropagation: jest.fn(),
    });
    expect(onClick).toHaveBeenCalled();
  });

  it('should call onClick when the space key is pressed', () => {
    const onClick = jest.fn();
    const element = shallow(<Frame onClick={onClick} />);
    element.simulate('keypress', {
      key: ' ',
      preventDefault: jest.fn(),
      stopPropagation: jest.fn(),
    });
    expect(onClick).toHaveBeenCalled();
  });

  it('should call onClick when the enter key is pressed', () => {
    const onClick = jest.fn();
    const element = shallow(<Frame onClick={onClick} />);
    element.simulate('keypress', {
      key: 'Enter',
      preventDefault: jest.fn(),
      stopPropagation: jest.fn(),
    });
    expect(onClick).toHaveBeenCalled();
  });

  it('should prevent default on mousedown to avoid card losing focus when clicking it', () => {
    const mockedEvent = {
      preventDefault: jest.fn(),
    };

    const element = shallow(<Frame />);
    element.simulate('mousedown', mockedEvent);
    expect(mockedEvent.preventDefault).toHaveBeenCalled();
  });
});
