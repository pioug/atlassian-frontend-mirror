import React from 'react';

import { mount } from 'enzyme';

import { UIController, ViewController } from '../../../index';
import NavigationProvider from '../../NavigationProvider';

const PageComponent = () => <div>Page content</div>;

const defaultProps = {
  cache: false,
  isDebugEnabled: false,
};

const mountWithContext = (tree, props = defaultProps) =>
  mount(<NavigationProvider {...props}>{tree}</NavigationProvider>);

describe('NavigationProvider', () => {
  it('should create instance of view controller by default', () => {
    const wrapper = mountWithContext(<PageComponent {...defaultProps} />);

    expect(wrapper.instance().viewController instanceof ViewController).toBe(
      true,
    );
  });

  it('should create instance of UI controller by default', () => {
    const wrapper = mountWithContext(<PageComponent {...defaultProps} />);

    expect(wrapper.instance().uiState instanceof UIController).toBe(true);
  });

  it('should change debug state on view controller instance if prop is updated', () => {
    const wrapper = mountWithContext(<PageComponent {...defaultProps} />);

    expect(wrapper.instance().viewController.isDebugEnabled).toBe(false);

    wrapper.setProps({ isDebugEnabled: true });

    expect(wrapper.instance().viewController.isDebugEnabled).toBe(true);
  });

  it('should inject ONLY view and UI controllers on provider component', () => {
    const wrapper = mountWithContext(<PageComponent {...defaultProps} />);

    expect(wrapper.find('Provider').get(0).props.inject.length).toBe(2);
  });

  it('should inject the same instance of view and UI controllers on provider component', () => {
    const wrapper = mountWithContext(<PageComponent {...defaultProps} />);

    const { uiState, viewController } = wrapper.instance();
    const [uiControllerProvider, viewControllerProvider] = wrapper
      .find('Provider')
      .get(0).props.inject;

    expect(viewController === viewControllerProvider).toBe(true);
    expect(uiState === uiControllerProvider).toBe(true);
  });
});
