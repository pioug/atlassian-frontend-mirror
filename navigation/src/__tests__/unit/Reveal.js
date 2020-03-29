import React, { PureComponent } from 'react';
import { shallow, mount, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Reveal from '../../components/js/Reveal';
import RevealInner from '../../components/styled/RevealInner';

configure({ adapter: new Adapter() });

class Child extends PureComponent {
  render() {
    return <div />;
  }
}

describe('Reveal', () => {
  describe('starting open without animation', () => {
    let wrapper;

    beforeEach(() => {
      wrapper = shallow(
        <Reveal shouldAnimate={false} openHeight={100} isOpen>
          <Child />
        </Reveal>,
      );
    });

    it('should render its children', () => {
      expect(wrapper.find(Child).length).toBe(1);
    });

    it('should not animate the growth of the children', () => {
      expect(wrapper.find(RevealInner).props().shouldAnimate).toBe(false);
    });

    it('should open to the open height', () => {
      expect(wrapper.find(RevealInner).props().openHeight).toBe(100);
    });
  });

  describe('starting open with animation', () => {
    it('should render its children', () => {
      const wrapper = mount(
        <Reveal openHeight={100} shouldAnimate isOpen>
          <Child />
        </Reveal>,
      );

      expect(wrapper.find(Child).length).toBe(1);
    });

    it('should start not open', () => {
      const wrapper = shallow(
        <Reveal openHeight={100} shouldAnimate isOpen>
          <Child />
        </Reveal>,
      );

      expect(wrapper.find(RevealInner).props().isOpen).toBe(false);
    });

    it('should then open async after mounting', () => {
      // override system clock
      jest.useFakeTimers();

      const wrapper = mount(
        <Reveal openHeight={100} shouldAnimate isOpen>
          <Child />
        </Reveal>,
      );

      expect(wrapper.find(RevealInner).props().isOpen).toBe(false);

      jest.runOnlyPendingTimers();
      requestAnimationFrame.step();
      wrapper.update();

      expect(wrapper.find(RevealInner).props().isOpen).toBe(true);

      // restore system clock
      jest.useRealTimers();
    });
  });

  describe('closing without animation', () => {
    it('should unmount its children', () => {
      const wrapper = mount(
        <Reveal isOpen shouldAnimate={false} openHeight={100}>
          <Child />
        </Reveal>,
      );

      expect(wrapper.find(Child).length).toBe(1);

      wrapper.setProps({
        isOpen: false,
      });

      expect(wrapper.find(Child).length).toBe(0);
    });
  });

  describe('closing with animation', () => {
    it('should not immediately remove the children', () => {
      const wrapper = shallow(
        <Reveal isOpen shouldAnimate openHeight={200}>
          <Child />
        </Reveal>,
      );

      wrapper.setProps({
        isOpen: false,
      });

      expect(wrapper.find(Child).length).toBe(1);
    });

    it('should remove children after closing', () => {
      const wrapper = mount(
        <Reveal isOpen shouldAnimate openHeight={200}>
          <Child />
        </Reveal>,
      );

      expect(wrapper.find(Child).length).toBe(1);

      wrapper.setProps({
        isOpen: false,
      });

      // mocking a transition end
      wrapper.find(RevealInner).simulate('transitionEnd');

      expect(wrapper.find(Child).length).toBe(0);
    });
  });

  describe('starting closed without animation', () => {
    it('should not render its children', () => {
      const wrapper = mount(
        <Reveal isOpen={false} shouldAnimate={false} openHeight={200}>
          <Child />
        </Reveal>,
      );

      expect(wrapper.find(Child).length).toBe(0);
    });
  });

  describe('starting closed with animation', () => {
    it('should not render its children', () => {
      const wrapper = mount(
        <Reveal isOpen={false} shouldAnimate={false} openHeight={200}>
          <Child />
        </Reveal>,
      );

      expect(wrapper.find(Child).length).toBe(0);
    });
  });
});
