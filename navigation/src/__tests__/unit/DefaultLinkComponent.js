import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import DefaultLinkComponent from '../../components/js/DefaultLinkComponent';

configure({ adapter: new Adapter() });

describe('<DefaultLinkComponent />', () => {
  describe('props', () => {
    it('should pass on href to the a tag', () => {
      expect(
        shallow(<DefaultLinkComponent href="foo" />)
          .find('a')
          .props().href,
      ).toBe('foo');
    });
    it('should pass on className to the a tag', () => {
      expect(
        shallow(<DefaultLinkComponent href="foo" className="foo" />)
          .find('a')
          .props().className,
      ).toBe('foo');
    });
    it('should pass on mouseDown to the a tag', () => {
      const mouseDown = jest.fn();
      shallow(<DefaultLinkComponent href="foo" onMouseDown={mouseDown} />)
        .find('a')
        .simulate('mouseDown');
      expect(mouseDown).toHaveBeenCalled();
    });
    it('should pass on onClick to the a tag', () => {
      const onClick = jest.fn();
      shallow(<DefaultLinkComponent href="foo" onClick={onClick} />)
        .find('a')
        .simulate('click');
      expect(onClick).toHaveBeenCalled();
    });
    it('renders children directly when no href is given', () => {
      expect(
        shallow(
          <DefaultLinkComponent>
            <span>foo</span>
          </DefaultLinkComponent>,
        ).find('a').length,
      ).toBe(0);
    });
  });
});
