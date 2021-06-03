import { Container } from 'unstated';

import { CONTENT_NAV_WIDTH } from '../common/constants';

const defaultState = {
  isResizing: false,
  isResizeDisabled: false,
  isCollapsed: false,
  productNavWidth: CONTENT_NAV_WIDTH,
};

export default class UIController extends Container {
  getCache;

  setCache;

  isCollapsedStore;

  constructor(initialState, cache) {
    super();

    let cachedState = {};
    if (cache) {
      const { get, set } = cache;
      const retrievedCache = get();

      if (retrievedCache) {
        const { isCollapsed, productNavWidth } = retrievedCache;
        cachedState = { isCollapsed, productNavWidth };
      }

      this.getCache = get;
      this.setCache = set;
    }

    const state = {
      ...defaultState,
      ...cachedState,
      ...initialState,
    };

    let { isCollapsed } = state;

    // isResizeDisabled takes precedence over isCollapsed
    if (initialState && initialState.isResizeDisabled) {
      // Remember this so that we can reset it if resizing is enabled again.
      this.isCollapsedStore = isCollapsed;
      isCollapsed = false;
    }

    this.state = { ...state, isCollapsed };
  }

  storeState = (state) => {
    this.setState(state);
    const { isCollapsed, productNavWidth } = this.state;
    if (this.setCache) {
      this.setCache({ isCollapsed, productNavWidth });
    }
  };

  // ==============================
  // UI
  // ==============================

  collapse = () => {
    if (this.state.isResizeDisabled) {
      return;
    }
    this.storeState({ isCollapsed: true });
  };

  expand = () => {
    if (this.state.isResizeDisabled) {
      return;
    }
    this.storeState({ isCollapsed: false });
  };

  toggleCollapse = () => {
    const toggle = this.state.isCollapsed ? this.expand : this.collapse;
    toggle();
  };

  manualResizeStart = ({ productNavWidth, isCollapsed }) => {
    if (this.state.isResizeDisabled) {
      return;
    }
    this.storeState({
      isResizing: true,
      productNavWidth,
      isCollapsed,
    });
  };

  manualResizeEnd = ({ productNavWidth, isCollapsed }) => {
    if (this.state.isResizeDisabled) {
      return;
    }
    this.storeState({
      isResizing: false,
      productNavWidth,
      isCollapsed,
    });
  };

  enableResize = () => {
    const isCollapsed =
      typeof this.isCollapsedStore === 'boolean'
        ? this.isCollapsedStore
        : this.state.isCollapsed;

    // This is a page-level setting not a user preference so we don't cache
    // this.
    this.setState({ isCollapsed, isResizeDisabled: false });
  };

  disableResize = () => {
    // Remember this so that we can reset it if resizing is enabled again.
    this.isCollapsedStore = this.state.isCollapsed;

    // This is a page-level setting not a user preference so we don't cache
    // this.
    this.setState({ isCollapsed: false, isResizeDisabled: true });
  };
}
