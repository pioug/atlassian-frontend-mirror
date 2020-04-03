import React from 'react';
import { mount } from 'enzyme';
import Pagination from '../../..';
import Page from '../../../components/Page';
import { LeftNavigator } from '../../../components/Navigators';
import { name } from '../../../version.json';

describe(`${name} - Pagination component`, () => {
  it('should not throw error on mount', () => {
    expect(() => {
      mount(<Pagination pages={[1, 2, 3]} />);
    }).not.toThrow();
  });
  describe('defaultSelectedIndex prop', () => {
    it('should select the passed in default selected index page', () => {
      const wrapper = mount(
        <Pagination pages={[1, 2, 3]} defaultSelectedIndex={2} />,
      );
      const pages = wrapper.find(Page);

      expect(pages.get(2).props.isSelected).toBe(true);
      // rest of the pages
      expect(pages.get(0).props.isSelected).toBe(false);
      expect(pages.get(1).props.isSelected).toBe(false);
    });

    it('should select the next page if defaultSelectedIndex is passed page', () => {
      const wrapper = mount(
        <Pagination pages={[1, 2, 3]} defaultSelectedIndex={2} />,
      );
      let pages = wrapper.find(Page);

      expect(pages.get(2).props.isSelected).toBe(true);
      // rest of the pages
      expect(pages.get(0).props.isSelected).toBe(false);
      expect(pages.get(1).props.isSelected).toBe(false);

      const leftNavigator = wrapper.find(LeftNavigator);
      leftNavigator.simulate('click');
      pages = wrapper.find(Page);

      expect(pages.get(1).props.isSelected).toBe(true);
      // rest of the pages
      expect(pages.get(0).props.isSelected).toBe(false);
      expect(pages.get(2).props.isSelected).toBe(false);
    });
  });

  describe('selectedIndex Prop', () => {
    it('should select the selected index', () => {
      const wrapper = mount(<Pagination pages={[1, 2, 3]} selectedIndex={1} />);
      let pages = wrapper.find(Page);

      expect(pages.get(1).props.isSelected).toBe(true);
      // rest of the pages
      expect(pages.get(0).props.isSelected).toBe(false);
      expect(pages.get(2).props.isSelected).toBe(false);

      //Update the selectedIndex
      wrapper.setProps({ selectedIndex: 2 });
      pages = wrapper.find(Page);
      expect(pages.get(2).props.isSelected).toBe(true);
      // rest of the pages
      expect(pages.get(0).props.isSelected).toBe(false);
      expect(pages.get(1).props.isSelected).toBe(false);
    });
  });

  describe('onChange Prop', () => {
    it('should call the onChange prop when page is changed', () => {
      const onChangeSpy = jest.fn();
      const wrapper = mount(
        <Pagination
          pages={[1, 2, 3]}
          onChange={onChangeSpy}
          defaultSelectedIndex={2}
        />,
      );
      //Update the selectedIndex
      const leftNavigator = wrapper.find(LeftNavigator);
      leftNavigator.simulate('click');
      expect(onChangeSpy).toHaveBeenCalled();
    });
  });

  describe('pageComponent prop', () => {
    it('should display the component passes in instead of the default page component', () => {
      const customComponent = ({ page }: { page: any }) => <div>{page}</div>;
      const wrapper = mount(
        <Pagination
          pages={[1, 2, 3]}
          components={{
            Page: customComponent,
          }}
          defaultSelectedIndex={2}
        />,
      );
      const customComponentCount = wrapper.find(customComponent);
      expect(customComponentCount.length).toBe(3);
    });
  });
  describe('previousPageComponent prop', () => {
    it('should display this new component instead of the default page component', () => {
      const customComponent = () => <div>Previous</div>;
      const wrapper = mount(
        <Pagination
          pages={[1, 2, 3]}
          components={{
            Previous: customComponent,
          }}
          defaultSelectedIndex={2}
        />,
      );
      const customComponentCount = wrapper.find(customComponent);
      expect(customComponentCount.length).toBe(1);
    });
  });

  describe('nextPageComponent prop', () => {
    it('should display this new component instead of the default page component', () => {
      const customComponent = () => <div>Next</div>;
      const wrapper = mount(
        <Pagination
          pages={[1, 2, 3]}
          components={{
            Next: customComponent,
          }}
          defaultSelectedIndex={2}
        />,
      );
      const customComponentCount = wrapper.find(customComponent);
      expect(customComponentCount.length).toBe(1);
    });
  });

  describe('max prop', () => {
    it('should display the number of pages as declared by max', () => {
      const wrapper = mount(
        <Pagination pages={[1, 2, 3, 4, 5, 6, 7, 8, 9]} max={5} />,
      );
      // There is one ellipsis component
      expect(wrapper.find(Page).length).toBe(4);
    });
  });
});
