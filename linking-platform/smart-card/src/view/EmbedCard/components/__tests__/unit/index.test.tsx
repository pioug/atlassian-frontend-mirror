import React from 'react';
import { shallow } from 'enzyme';
import { ExpandedFrame } from '../../../components/ExpandedFrame';
import { Wrapper, LinkWrapper, IconWrapper, TextWrapper } from '../../styled';

describe('ExpandedFrame', () => {
  it('should render as a link when there is a href', () => {
    const element = shallow(<ExpandedFrame href="https://www.google.com/" />);
    expect(element.type()).toEqual(LinkWrapper);
  });

  it('should not render as a link when there is no href', () => {
    const element = shallow(<ExpandedFrame />);
    expect(element.type()).toEqual(Wrapper);
  });

  it('should not render an icon when isPlaceholder=true', () => {
    const element = shallow(
      <ExpandedFrame icon={<span />} isPlaceholder={true} />,
    );
    expect(element.find(IconWrapper).children()).toHaveLength(0);
  });

  it('should render an icon when isPlaceholder=false', () => {
    const element = shallow(
      <ExpandedFrame icon={<span />} isPlaceholder={false} />,
    );
    expect(element.find(IconWrapper).children()).toHaveLength(1);
  });

  it('should not render text when isPlaceholder=true', () => {
    const element = shallow(
      <ExpandedFrame text="foobar" isPlaceholder={true} />,
    );
    expect(element.find(TextWrapper).children()).toHaveLength(0);
  });

  it('should render text when isPlaceholder=false', () => {
    const element = shallow(
      <ExpandedFrame text="foobar" isPlaceholder={false} />,
    );
    expect(element.find(TextWrapper).children()).toHaveLength(1);
  });

  it('should not be interactive when isPlaceholder=true and href is defined', () => {
    const element = shallow(
      <ExpandedFrame isPlaceholder={true} href="htttps:///www.example.com/" />,
    );
    expect(element.first().prop('isInteractive')).toBeFalsy();
  });

  it('should not be interactive when isPlaceholder=true and onClick is defined', () => {
    const element = shallow(
      <ExpandedFrame isPlaceholder={true} onClick={jest.fn()} />,
    );
    expect(element.first().prop('isInteractive')).toBeFalsy();
  });

  it('should be interactive when isPlaceholder=false and href is defined', () => {
    const element = shallow(
      <ExpandedFrame isPlaceholder={false} href="htttps:///www.example.com/" />,
    );
    expect(element.first().prop('isInteractive')).toBeTruthy();
  });

  it('should be interactive when isPlaceholder=false and onClick is defined', () => {
    const element = shallow(
      <ExpandedFrame isPlaceholder={false} onClick={jest.fn()} />,
    );
    expect(element.first().prop('isInteractive')).toBeTruthy();
  });
});
