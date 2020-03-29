import { shallow, mount, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import styled from 'styled-components';
import ContainerNavigation from '../../components/js/ContainerNavigation';
import { globalSecondaryActions } from '../../shared-variables';
import { isCollapsed } from '../../theme/util';
import * as presets from '../../theme/presets';
import Reveal from '../../components/js/Reveal';
import GlobalNavigationSecondaryContainer from '../../components/styled/GlobalNavigationSecondaryContainer';
import GlobalSecondaryActions from '../../components/js/GlobalSecondaryActions';
import ScrollHintScrollContainer from '../../components/styled/ScrollHintScrollContainer';

configure({ adapter: new Adapter() });

describe('<ContainerNavigation />', () => {
  describe('props', () => {
    it('should default theme to presets.container', () => {
      expect(mount(<ContainerNavigation />).props().theme).toBe(
        presets.container,
      );
    });

    it('should supply the scrollRef when the scrollable container nav element', () => {
      const myRef = () => {};
      const wrapper = mount(<ContainerNavigation scrollRef={myRef} />);
      expect(wrapper.find(ScrollHintScrollContainer).prop('innerRef')).toBe(
        myRef,
      );
    });
  });

  describe('behaviour', () => {
    describe('putting isCollapsed on the theme', () => {
      it('should set isCollapsed to false when not collapsed', () => {
        const stub = jest.fn(() => 'block');
        const Item = styled.div`
          display: ${({ theme }) => stub(isCollapsed(theme))};
        `;

        mount(
          <ContainerNavigation isCollapsed={false}>
            <Item />
          </ContainerNavigation>,
        );

        expect(stub).toHaveBeenCalledWith(false);
      });

      it('should set isCollapsed to true when it is collapsed', () => {
        const stub = jest.fn(() => '');
        const Item = styled.div`
          display: ${({ theme }) => stub(isCollapsed(theme))};
        `;

        mount(
          <ContainerNavigation isCollapsed>
            <Item />
          </ContainerNavigation>,
        );
        expect(stub).toHaveBeenCalledWith(true);
      });
    });

    it('collapses the container header when closed', () => {
      const headerComponent = jest.fn();
      shallow(
        <ContainerNavigation isCollapsed headerComponent={headerComponent} />,
      );
      expect(headerComponent).toHaveBeenCalledWith({ isCollapsed: true });
    });
  });

  describe('revealing the global primary actions', () => {
    let wrapper;

    beforeEach(() => {
      wrapper = mount(<ContainerNavigation />);
    });

    it('should not animate the global primary actions on initial render', () => {
      expect(
        wrapper
          .find(Reveal)
          .first()
          .props().shouldAnimate,
      ).toBe(false);
    });

    it('should animate the global primary actions after any change', () => {
      wrapper.setProps({ showGlobalActions: true });
      expect(
        wrapper
          .find(Reveal)
          .first()
          .props().shouldAnimate,
      ).toBe(true);
    });
  });

  describe('revealing the global secondary actions', () => {
    let wrapper;
    let globalSecondaryReveal;

    beforeEach(() => {
      wrapper = mount(<ContainerNavigation />);
      globalSecondaryReveal = wrapper
        .find(GlobalNavigationSecondaryContainer)
        .find(Reveal);
    });

    it('should not animate the global secondary actions on initial render', () => {
      expect(globalSecondaryReveal.prop('shouldAnimate')).toBe(false);
    });

    it('should animate the global secondary actions after any change', () => {
      wrapper.setProps({ showGlobalActions: true });
      wrapper.update();
      const updatedGlobalSecondaryReveal = wrapper
        .find(GlobalNavigationSecondaryContainer)
        .find(Reveal);
      expect(updatedGlobalSecondaryReveal.prop('shouldAnimate')).toBe(true);
    });

    it('should set the global secondary actions container height based on the number of actions', () => {
      const expectedHeight = childCount =>
        globalSecondaryActions.height(childCount).outer;
      let updatedGlobalSecondaryReveal = wrapper
        .find(GlobalNavigationSecondaryContainer)
        .find(Reveal);
      expect(updatedGlobalSecondaryReveal.prop('openHeight')).toBe(
        expectedHeight(0),
      );
      wrapper.setProps({ globalSecondaryActions: [<div />, <div />] });
      wrapper.update();
      updatedGlobalSecondaryReveal = wrapper
        .find(GlobalNavigationSecondaryContainer)
        .find(Reveal);
      expect(updatedGlobalSecondaryReveal.prop('openHeight')).toBe(
        expectedHeight(2),
      );
      wrapper.setProps({ globalSecondaryActions: [<div />, <div />, <div />] });
      wrapper.update();
      updatedGlobalSecondaryReveal = wrapper
        .find(GlobalNavigationSecondaryContainer)
        .find(Reveal);
      expect(updatedGlobalSecondaryReveal.prop('openHeight')).toBe(
        expectedHeight(3),
      );
    });

    it('should only render GlobalSecondaryActions if showGlobalActions is true and globalSecondaryActions has item(s)', () => {
      expect(wrapper.find(GlobalSecondaryActions).length).toBe(0);

      wrapper.setProps({ showGlobalActions: true });
      expect(wrapper.find(GlobalSecondaryActions).length).toBe(0);

      wrapper.setProps({ globalSecondaryActions: [<div />] });
      expect(wrapper.find(GlobalSecondaryActions).length).toBe(1);
    });
  });
});
