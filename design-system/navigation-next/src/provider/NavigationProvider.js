import React, { Component } from 'react';

import { Provider } from 'unstated';

import { CONTENT_NAV_WIDTH } from '../common/constants';
import { UIController } from '../ui-controller';
import { ViewController } from '../view-controller';

const LS_KEY = 'ATLASKIT_NAVIGATION_UI_STATE';

const DEFAULT_UI_STATE = {
  isCollapsed: false,
  productNavWidth: CONTENT_NAV_WIDTH,
  isResizeDisabled: false,
};

function defaultGetCache() {
  try {
    const stored = localStorage.getItem(LS_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_UI_STATE;
  } catch {
    // Handle exception if localStorage isn't available
  }
  return DEFAULT_UI_STATE;
}

function defaultSetCache(state) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(state));
  } catch {
    // Handle exception if localStorage isn't available
  }
}

export default class NavigationProvider extends Component {
  static defaultProps = {
    cache: {
      get: defaultGetCache,
      set: defaultSetCache,
    },
    isDebugEnabled: false,
  };

  uiState;

  viewController;

  constructor(props) {
    super(props);

    const { cache, initialUIController, isDebugEnabled } = props;
    this.uiState = new UIController(initialUIController, cache);
    this.viewController = new ViewController({ isDebugEnabled });
  }

  componentDidUpdate(prevProps) {
    const { viewController } = this;
    const { isDebugEnabled } = this.props;
    if (isDebugEnabled !== prevProps.isDebugEnabled) {
      viewController.setIsDebugEnabled(!!isDebugEnabled);
    }
  }

  render() {
    const { children } = this.props;
    const { uiState, viewController } = this;

    return <Provider inject={[uiState, viewController]}>{children}</Provider>;
  }
}
