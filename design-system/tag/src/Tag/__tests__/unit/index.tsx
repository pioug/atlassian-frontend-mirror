import React from 'react';
import { mount, shallow } from 'enzyme';

import Chrome from '../../../Chrome';
import Content from '../../../Content';
import Remove from '../../../RemoveButton';
import TagWithAnalytics, { TagWithoutAnalytics as Tag } from '../..';

import Before from '../../Before';
import Container from '../../Container';

declare var global: any;

describe('Tag component', () => {
  const atlassianHref = 'https://www.atlassian.com';
  const atlassianText = 'Atlassian';
  const bitbucketHref = 'https://bitbucket.org';
  const testProps = {
    text: atlassianText,
    href: atlassianHref,
    removeButtonText: 'Click to remove this tag!',
  };

  it('Test Tag with removable link', () => {
    const wrapper = mount(<Tag {...testProps} />);
    expect(wrapper.prop('href')).toBe(atlassianHref);
    expect(wrapper.find('a').text()).toBe(atlassianText);
    expect(wrapper.find(Chrome).prop('isRemovable')).toBe(true);
  });

  it('Tag with href renders when it has focus (AK-3953)', () => {
    const wrapper = mount(<Tag {...testProps} />);
    wrapper.find(Chrome).simulate('focus');
    expect(wrapper.find('a').prop('href')).toBe(atlassianHref);
  });

  it('onBeforeRemoveAction callback contract', () => {
    const onBeforeRemoveAction = jest.fn();
    const wrapper = mount(
      <Tag
        text="test"
        removeButtonText="Remove"
        onBeforeRemoveAction={onBeforeRemoveAction}
      />,
    );
    wrapper.find(Remove).simulate('click');
    expect(onBeforeRemoveAction).toHaveBeenCalledTimes(1);
  });

  it('onAfterRemoveAction callback contract', () => {
    const onAfterRemoveAction = jest.fn();
    const wrapper = mount(
      <Tag
        text="test"
        removeButtonText="Remove"
        onAfterRemoveAction={onAfterRemoveAction}
      />,
    );
    wrapper.find(Remove).simulate('click');
    wrapper.find(Container).simulate('animationEnd');
    expect(onAfterRemoveAction).toHaveBeenCalledTimes(1);
  });

  it('onAfterRemoveAction should not be called if onBeforeRemoveAction returns false', () => {
    const onAfterRemoveAction = jest.fn();
    const wrapper = mount(
      <Tag
        text="test"
        removeButtonText="Remove"
        onBeforeRemoveAction={() => false}
        onAfterRemoveAction={onAfterRemoveAction}
      />,
    );
    wrapper.find(Remove).simulate('click');
    expect(onAfterRemoveAction).not.toHaveBeenCalled();
  });

  it('set markedForRemoval via mouse events on remove button', () => {
    const wrapper = mount(<Tag text="test" removeButtonText="Remove" />);
    wrapper.find(Remove).simulate('mouseover');
    expect(wrapper.find(Chrome).prop('markedForRemoval')).toBe(true);
    wrapper.find(Remove).simulate('mouseout');
    expect(wrapper.find(Chrome).prop('markedForRemoval')).toBe(false);
  });

  it('remove via keypress on remove button', () => {
    const wrapper = mount(<Tag text="test" removeButtonText="foo" />);
    wrapper.find(Remove).simulate('keypress', { key: ' ' });
    wrapper.find(Remove).simulate('keypress', { key: 'Enter' });
    expect(wrapper.state('isRemoving')).toBe(true);
  });

  it('Tag allows us to set props', () => {
    const wrapper = mount(<Tag text={atlassianText} href={atlassianHref} />);
    expect(wrapper.prop('href')).toBe(atlassianHref);

    expect(wrapper.find('a').text()).toBe(atlassianText);

    wrapper.setProps({ href: bitbucketHref });
    expect(wrapper.prop('href')).toBe(bitbucketHref);
  });

  describe('appearance prop', () => {
    it('should set the isRounded prop of Chrome and Remove to true when set to "rounded"', () => {
      const wrapper = mount(
        <Tag appearance="rounded" text="foo" removeButtonText="foo" />,
      );
      expect(wrapper.find(Chrome).prop('isRounded')).toBe(true);
      expect(wrapper.find(Remove).prop('isRounded')).toBe(true);
    });

    it('should set the isRounded prop of Chrome and Remove to false when not set to "rounded"', () => {
      const wrapper = mount(
        <Tag appearance="default" text="foo" removeButtonText="foo" />,
      );
      expect(wrapper.find(Chrome).prop('isRounded')).toBe(false);
      expect(wrapper.find(Remove).prop('isRounded')).toBe(false);
    });
  });

  describe('elemBefore prop', () => {
    it('should render anything passed to it', () => {
      const wrapper = mount(
        <Tag text="foo" elemBefore={<div className="test" />} />,
      );
      expect(wrapper.find(Before).find('div.test').length).toBe(1);
    });

    it('should render the elemBefore before the content', () => {
      const wrapper = shallow(
        <Tag text="foo" elemBefore={<div className="test" />} />,
      );
      const chrome = wrapper.find(Chrome);
      expect(chrome.childAt(0).is(Before)).toBe(true);
      expect(chrome.childAt(1).is(Content)).toBe(true);
    });
  });

  describe('text prop', () => {
    it('should render text to a Content block', () => {
      const wrapper = mount(<Tag text="foo" />);
      expect(wrapper.find(Content).text()).toBe('foo');
    });
  });

  describe('href prop', () => {
    it('should cause an anchor to be rendered', () => {
      const wrapper = mount(<Tag text="foo" href="#" />);
      expect(wrapper.find(Content).find('a').length).toBe(1);
    });

    it('should reflect the href onto the anchor', () => {
      const wrapper = mount(<Tag text="foo" href="#" />);
      expect(wrapper.find(Content).find('a').prop('href')).toBe('#');
    });

    it('should set the isLink prop on Chrome', () => {
      const wrapper = mount(<Tag text="foo" href="#" />);
      expect(wrapper.find(Chrome).prop('isLink')).toBe(true);
    });
  });

  describe('removeButtonText prop', () => {
    it('should not render a button if not set', () => {
      const wrapper = mount(<Tag text="foo" />);
      expect(wrapper.find(Remove).length).toBe(0);
    });

    it('should render a button if set', () => {
      const wrapper = mount(<Tag text="foo" removeButtonText="removeMe" />);
      expect(wrapper.find(Remove).length).toBe(1);
    });

    it('should set the removeText prop of button if set', () => {
      const wrapper = mount(<Tag text="foo" removeButtonText="removeMe" />);
      expect(wrapper.find(Remove).prop('removeText')).toBe('removeMe');
    });
  });

  describe('onBeforeRemoveAction prop', () => {
    it('should be called if button is clicked', () => {
      const spy = jest.fn();
      const wrapper = mount(
        <Tag
          text="foo"
          removeButtonText="removeMe"
          onBeforeRemoveAction={spy}
        />,
      );
      wrapper.find('button').simulate('click');
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('onAfterRemoveAction prop', () => {
    it('should be called after remove animation is completed', () => {
      const spy = jest.fn();
      const wrapper = mount(
        <Tag
          text="foo"
          removeButtonText="removeMe"
          onAfterRemoveAction={spy}
        />,
      );
      wrapper.find('button').simulate('click');
      wrapper.find(Container).simulate('animationEnd');
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should not be called if onBeforeRemoveAction returns false', () => {
      const beforeRemove = () => false;
      const spy = jest.fn();
      const wrapper = mount(
        <Tag
          text="foo"
          removeButtonText="removeMe"
          onBeforeRemoveAction={beforeRemove}
          onAfterRemoveAction={spy}
        />,
      );
      wrapper.find('button').simulate('click');
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('color prop', () => {
    it('should render with a color option', () => {
      const wrapper = mount(<Tag text="default" color="purple" />);
      expect(wrapper.props().color).toBe('purple');
    });

    it('should render the standard color option if no color option is provided', () => {
      const wrapper = mount(<Tag text="default" />);
      expect(wrapper.props().color).toBe('standard');
    });

    it('should render the standard color option if missing color option is provided', () => {
      const wrapper = mount(<Tag text="gibberish" />);
      expect(wrapper.find(Chrome).props().color).toBe('standard');
    });
  });
});

describe('TagWithAnalytics', () => {
  beforeEach(() => {
    jest.spyOn(global.console, 'warn');
    jest.spyOn(global.console, 'error');
  });
  afterEach(() => {
    global.console.warn.mockRestore();
    global.console.error.mockRestore();
  });

  it('should mount without errors', () => {
    const testProps = {
      text: 'Atlassian',
      href: 'https://www.atlassian.com',
      removeButtonText: 'Click to remove this tag!',
    };
    mount(<TagWithAnalytics {...testProps} />);
    /* eslint-disable no-console */
    expect(console.warn).not.toHaveBeenCalled();
    expect(console.error).not.toHaveBeenCalled();
    /* eslint-enable no-console */
  });
});
