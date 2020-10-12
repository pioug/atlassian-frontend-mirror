import React from 'react';
import { shallow } from 'enzyme';

import {
  FocusedTaskCloseAccount,
  Props,
  State,
} from '../../components/FocusedTaskCloseAccount';

import Footer from '../../components/Footer';

const defaultProps = {
  isOpen: false,
  onClose: jest.fn(),
  screens: ['a', 'b', 'c'],
  submitButton: <div id="submit" />,
  learnMoreLink: 'https://hello.atlassian.net',
};

const render = (props = {}) =>
  shallow<Props, State>(
    <FocusedTaskCloseAccount {...defaultProps} {...props} />,
  );

test('isOpen snapshot', () => {
  expect(render()).toMatchSnapshot();
});

describe('nextScreen()', () => {
  test('Goes to next screen', () => {
    const wrapper = render();

    expect(wrapper.state().currentScreenIdx).toBe(0);

    (wrapper.instance() as FocusedTaskCloseAccount).nextScreen();
    wrapper.update();

    expect(wrapper.state().currentScreenIdx).toBe(1);
  });

  test('No-op if on last screen', () => {
    const wrapper = render();
    const { screens } = defaultProps;
    const lastScreenIdx = screens.length - 1;

    wrapper.setState({ currentScreenIdx: lastScreenIdx });
    (wrapper.instance() as FocusedTaskCloseAccount).nextScreen();
    wrapper.update();

    expect(wrapper.state().currentScreenIdx).toBe(lastScreenIdx);
  });
});

describe('previousScreen()', () => {
  test('Goes to previous screen', () => {
    const wrapper = render();
    const { screens } = defaultProps;
    const lastScreenIdx = screens.length - 1;

    wrapper.setState({ currentScreenIdx: lastScreenIdx });
    (wrapper.instance() as FocusedTaskCloseAccount).previousScreen();
    wrapper.update();

    expect(wrapper.state().currentScreenIdx).toBe(lastScreenIdx - 1);
  });

  test('Goes to next screen', () => {
    const wrapper = render();
    (wrapper.instance() as FocusedTaskCloseAccount).previousScreen();
    wrapper.update();
    expect(wrapper.state().currentScreenIdx).toBe(0);
  });
});

describe('learnMoreLink display', () => {
  test('Learn more link is displayed when the link is passed in the props', () => {
    const wrapper = render();
    const footerSecondaryActions = wrapper
      .find(Footer)
      .prop('secondaryActions');

    const learnMoreWrapper = shallow(
      <div>{footerSecondaryActions}</div>,
    ).childAt(0);

    expect(learnMoreWrapper).toMatchSnapshot();
  });

  test('Learn more link is not displayed when the link is not passed in the props', () => {
    const wrapper = render({
      learnMoreLink: '',
    });
    const footerSecondaryActions = wrapper
      .find(Footer)
      .prop('secondaryActions');

    expect(footerSecondaryActions).toEqual('');
  });
});
