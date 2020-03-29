import React from 'react';
import { shallow, mount, ReactWrapper, ShallowWrapper } from 'enzyme';
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';
import ChevronUpIcon from '@atlaskit/icon/glyph/chevron-up';
import CrossIcon from '@atlaskit/icon/glyph/cross';
import { FlagWithoutAnalytics as Flag } from '../../Flag';
import Container, {
  Description,
  DismissButton,
  Title,
} from '../../Flag/styledFlag';
import { FlagProps } from '../../../types';

describe('Flag', () => {
  const generateFlag = (extraProps?: Partial<FlagProps>) => (
    <Flag id="" icon={<div />} title="Flag" {...extraProps} />
  );

  describe('rendering', () => {
    it('should instantiate', () => {
      const wrapper = shallow(generateFlag());
      expect(wrapper.exists()).toBe(true);
    });

    it('icon prop element should be rendered to correct location', () => {
      const wrapper = shallow(generateFlag({ icon: <span id="test-icon" /> }));
      expect(wrapper.find('#test-icon').exists()).toBe(true);
    });

    it('title prop text should be rendered to correct location', () => {
      const wrapper = shallow(generateFlag({ title: 'Oh hi!' }));
      expect(
        wrapper
          .find(Title)
          .childAt(0)
          .text(),
      ).toBe('Oh hi!');
    });
  });

  describe('description prop', () => {
    let flag: ReactWrapper;

    beforeEach(() => {
      flag = mount(generateFlag());
    });

    it('description element should not be rendered if description prop is empty', () => {
      flag.setProps({ description: '' });
      expect(flag.find(Description).exists()).toBe(false);
    });

    it('description element should not be rendered if description prop not passed', () => {
      expect(flag.find(Description).exists()).toBe(false);
    });

    it('description prop text should be rendered to correct location', () => {
      flag.setProps({ description: 'Oh hi!' });
      expect(flag.find(Description).exists()).toBe(true);
      expect(flag.find(Description).text()).toBe('Oh hi!');
    });

    it('should accept JSX in description', () => {
      flag.setProps({
        description: (
          <span>
            Check this <a href="https://google.com">link</a> out
          </span>
        ),
      });
      expect(
        flag
          .find(Description)
          .find('span > a')
          .exists(),
      ).toBe(true);
    });
  });

  describe('appearance prop', () => {
    describe('basic appearance tests', () => {
      let flag: ShallowWrapper;

      beforeEach(() => {
        flag = shallow(generateFlag());
      });

      it('should default to normal appearance', () => {
        expect(flag.prop('appearance')).toBe('normal');
      });

      it('should apply supplied appearance to root element', () => {
        flag.setProps({ appearance: 'warning' });
        expect(flag.find(Container).prop('appearance')).toBe('warning');
      });
    });

    describe('non-bold (normal) appearance', () => {
      let flag: ReactWrapper;

      beforeEach(() => {
        flag = mount(generateFlag({ appearance: 'normal' }));
      });

      it('should not render dismiss icon if isDismissAllowed is false or if no onDismissed callback is provided', () => {
        expect(flag.find(CrossIcon).exists()).toBe(false);
        flag.setProps({ isDismissAllowed: true, onDismissed: null });
        expect(flag.find(CrossIcon).exists()).toBe(false);
        flag.setProps({ isDismissAllowed: false, onDismissed: () => {} });
        expect(flag.find(CrossIcon).exists()).toBe(false);
      });

      it('should render dismiss icon if isDismissAllowed', () => {
        flag.setProps({ isDismissAllowed: true, onDismissed: () => {} });
        expect(flag.find(CrossIcon).exists()).toBe(true);
      });
    });

    describe('bold appearances', () => {
      let flag: ReactWrapper;

      beforeEach(() => {
        flag = mount(
          generateFlag({ appearance: 'info', isDismissAllowed: true }),
        );
      });

      it('should default to being not expanded', () => {
        expect(flag.state('isExpanded')).toBe(false);
      });

      it('should set isExpanded to true when icon clicked', () => {
        flag.setProps({ description: 'Hello' });
        flag.find(DismissButton).simulate('click');
        expect(flag.state('isExpanded')).toBe(true);
      });

      it('should render a chevron-down icon if not expanded', () => {
        flag.setProps({ description: 'Hello' });
        expect(flag.state('isExpanded')).toBe(false);
        expect(flag.find(ChevronDownIcon).exists()).toBe(true);
      });

      it('should render a chevron-up icon if expanded', () => {
        flag.setProps({ description: 'Hello' });
        flag.setState({ isExpanded: true });
        expect(flag.find(ChevronUpIcon).exists()).toBe(true);
      });

      it('should set aria-expanded to false if not expanded', () => {
        flag.setProps({ description: 'Hello' });
        const dismissProps = flag.find(DismissButton).props();
        expect(dismissProps['aria-expanded']).toBe(false);
      });

      it('should set aria-expanded to true if expanded', () => {
        flag.setProps({ description: 'Hello' });
        flag.setState({ isExpanded: true });
        const dismissProps = flag.find(DismissButton).props();
        expect(dismissProps['aria-expanded']).toBe(true);
      });

      it('should only render an expand button if either description or actions props are set', () => {
        expect(flag.find(DismissButton).exists()).toBe(false);

        flag.setProps({ actions: [], description: 'Hello' });
        expect(flag.find(DismissButton).exists()).toBe(true);

        flag.setProps({
          actions: [{ content: 'Hello', onClick: () => {} }],
          description: null,
        });
        expect(flag.find(DismissButton).exists()).toBe(true);
      });

      it('should un-expand an expanded bold flag when the description and actions props are removed', () => {
        flag.setProps({
          description: 'Hello',
          actions: [{ content: 'Hello', onClick: () => {} }],
        });
        expect(flag.state('isExpanded')).toBe(false);
        flag.find(DismissButton).simulate('click');
        expect(flag.state('isExpanded')).toBe(true);

        flag.setProps({ description: 'Hello', actions: [] });
        expect(flag.state('isExpanded')).toBe(true);

        flag.setProps({ description: null, actions: [] });
        expect(flag.state('isExpanded')).toBe(false);
      });
    });

    describe('flag actions', () => {
      it('onDismissed should be called with flag id as param when dismiss icon clicked', () => {
        const spy = jest.fn();
        const wrapper = mount(
          generateFlag({
            id: 'a',
            isDismissAllowed: true,
            onDismissed: spy,
          }),
        );
        wrapper.find(DismissButton).simulate('click');
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith('a');
      });

      it('Dismiss button should not be rendered if isDismissAllowed is omitted', () => {
        const spy = jest.fn();
        const wrapper = mount(
          generateFlag({
            id: 'a',
            onDismissed: spy,
          }),
        );
        expect(wrapper.find(DismissButton).exists()).toBe(false);
        expect(spy).not.toHaveBeenCalled();
      });
    });
  });
});

describe('FlagWithAnalytics', () => {
  beforeEach(() => {
    jest.spyOn(global.console, 'warn');
    jest.spyOn(global.console, 'error');
  });
  afterEach(() => {
    //@ts-ignore no mockRestore on warn
    global.console.warn.mockRestore();
    //@ts-ignore no mockRestore on error
    global.console.error.mockRestore();
  });

  it('should mount without errors', () => {
    mount(<Flag title="hi" id="" icon={<span>hi</span>} />);
    /* eslint-disable no-console */
    expect(console.warn).not.toHaveBeenCalled();
    expect(console.error).not.toHaveBeenCalled();
    /* eslint-enable no-console */
  });
});
