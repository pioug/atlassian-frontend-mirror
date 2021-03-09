import React from 'react';
import { shallow, mount } from 'enzyme';

import Item, { ItemGroup } from '../../..';

import {
  GroupTitle,
  GroupTitleText,
  GroupTitleAfter,
} from '../../../styled/ItemGroup';

describe('@atlaskit/item - ItemGroup', () => {
  describe('props', () => {
    describe('children', () => {
      it('should render provided children', () => {
        const wrapper = shallow(
          <ItemGroup>
            <Item>Item one</Item>
            <Item>Item two</Item>
          </ItemGroup>,
        );
        expect(wrapper.find('[role="group"]').find(Item).length).toBe(2);
      });
    });
    describe('title', () => {
      it('should render title if provided', () => {
        const wrapper = mount(<ItemGroup title="Hello" />);
        expect(wrapper.find(GroupTitleText).text()).toBe('Hello');
      });
      it('should not render title if omitted', () => {
        const wrapper = mount(<ItemGroup />);
        expect(wrapper.find(GroupTitle).length).toBe(0);
      });
    });
    describe('elemAfter', () => {
      it('should not be rendered if title is omitted', () => {
        const wrapper = mount(<ItemGroup elemAfter="Hello" />);
        expect(wrapper.find(GroupTitleAfter).length).toBe(0);
      });
      it('should be rendered if title is provided', () => {
        const wrapper = mount(<ItemGroup elemAfter="Hello" title="Hello" />);
        expect(wrapper.find(GroupTitleAfter).length).toBe(1);
      });
      it('should accept a string value', () => {
        const wrapper = mount(<ItemGroup elemAfter="Hello there" title="Hi" />);
        expect(wrapper.find(GroupTitleAfter).text()).toBe('Hello there');
      });
      it('should accept a node value', () => {
        const wrapper = mount(
          <ItemGroup
            elemAfter={<span className="after-custom" />}
            title="Hi"
          />,
        );
        expect(wrapper.find('.after-custom').length).toBe(1);
      });
    });
  });

  describe('accessibility', () => {
    it('root element should have role="group" by default', () => {
      const wrapper = shallow(<ItemGroup />);
      expect(wrapper.prop('role')).toBe('group');
    });

    it('root element should apply role prop if supplied', () => {
      const wrapper = shallow(<ItemGroup role="menu" />);
      expect(wrapper.prop('role')).toBe('menu');
    });

    it('title should always have aria-hidden="true" because we use aria-label', () => {
      const wrapper = shallow(<ItemGroup title="Hello" />);
      expect(wrapper.find(GroupTitle).prop('aria-hidden')).toBe('true');
    });

    describe('root element aria-label', () => {
      it('label should be used even if title is provided', () => {
        const wrapper = shallow(<ItemGroup title="Hello" label="Bye" />);
        expect(wrapper.find('[aria-label]').prop('aria-label')).toBe('Bye');
      });

      it('title should be used when label is not provided', () => {
        const wrapper = shallow(<ItemGroup title="Hello" />);
        expect(wrapper.find('[aria-label]').prop('aria-label')).toBe('Hello');
      });

      it('it should default to empty string if there are no title and no label', () => {
        const wrapper = shallow(<ItemGroup />);
        expect(wrapper.find('[aria-label]').prop('aria-label')).toBe('');
      });

      it('aria-label should still be correct if passing a node', () => {
        const wrapper = shallow(
          <ItemGroup title={<span className="nodeClass">Hello</span>} />,
        );
        expect(wrapper.find('[aria-label]').prop('aria-label')).toBe('Hello');
      });

      it('aria-label should still be correct if passing a Formatted message in a component', () => {
        const projectName = 'Atlaskit';
        const wrapper = shallow(
          <ItemGroup
            title={
              <div>
                Hello <b>{projectName}</b>
              </div>
            }
          />,
        );
        expect(wrapper.find('[aria-label]').prop('aria-label')).toBe(
          'Hello Atlaskit',
        );
      });
    });
  });
});
