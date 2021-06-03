import { Container } from 'unstated';

const defaultProps = {
  isDebugEnabled: false,
};

export default class ViewController extends Container {
  state = {
    activeView: null,
    incomingView: null,
  };

  reducers = {};

  views = {};

  isDebugEnabled = false;

  constructor({ isDebugEnabled } = defaultProps) {
    super();

    if (typeof isDebugEnabled !== 'undefined') {
      this.isDebugEnabled = isDebugEnabled;
    }
  }

  /**
   * Helper function for reducing a view's data and updating the state.
   */
  _updateViewController = (view, initialData) => {
    const { id, type, getAnalyticsAttributes } = view;
    const reducers = this.reducers[id] || [];
    const data = reducers.reduce((d, reducer) => reducer(d), initialData);
    const analyticsAttributes = getAnalyticsAttributes
      ? getAnalyticsAttributes(data)
      : undefined;

    this.setState({
      activeView: { id, type, data, analyticsAttributes },
      incomingView: null,
    });
  };

  /**
   * Add a reducer to the view with the given ID.
   */
  addReducer = (viewId, reducer) => {
    const reducersForView = [...(this.reducers[viewId] || []), reducer];
    this.reducers = { ...this.reducers, [viewId]: reducersForView };

    // If we're adding a reducer to the active view we'll want to force an
    // update so that the reducer gets applied.
    this.updateActiveView(viewId);
  };

  /**
   * Remove a reducer from the view with the given ID.
   */
  removeReducer = (viewId, reducer) => {
    const reducersForView = this.reducers[viewId];
    if (!reducersForView) {
      return;
    }

    const newReducers = reducersForView.filter((r) => r !== reducer);
    this.reducers = { ...this.reducers, [viewId]: newReducers };

    // If we're removing a reducer from the active view we'll want to force an
    // update so that the data gets re-evaluated.
    this.updateActiveView(viewId);
  };

  /**
   * Register a view. You must provide an `id`, the `type` of view ('product' or
   * 'container'), and a `getItems` function which should return either an array
   * of data, or a Promise which will resolve to an array of data.
   */
  addView = (view) => {
    const { id } = view;
    this.views = { ...this.views, [id]: view };

    // We need to call setView again for the following cases:
    // 1. The added view matches the active view (if it returns a Promise we
    //    want to temporarily enter a loading state while it resolves).
    // 2. The added view matches the expected incoming view and we want to
    //    resolve it.
    const { activeView, incomingView } = this.state;
    if (
      (activeView && id === activeView.id) ||
      (incomingView && id === incomingView.id)
    ) {
      this.setView(id);
    }
  };

  /**
   * Un-register a view. If the view being removed is active it will remain so
   * until a different view is set.
   */
  removeView = (viewId) => {
    delete this.views[viewId];
  };

  /**
   * Set the registered view with the given ID as the active view.
   */
  setView = (viewId) => {
    const view = this.views[viewId];

    // The view has been added
    if (view) {
      const { id, type, getItems } = view;
      const returnedItems = getItems();

      // This view returned a Promise
      if (returnedItems instanceof Promise) {
        // Enter a temporary loading state
        this.setState({ incomingView: { id, type } });

        // Wait for the Promise to resolve
        returnedItems.then((data) => {
          this._updateViewController(view, data);
        });
        return;
      }

      // The view returned data
      this._updateViewController(view, returnedItems);
      return;
    }

    // The view has not been added yet. We enter an indefinite loading state
    // until the view is added or another view is set.
    this.setState({ incomingView: { id: viewId, type: null } });
  };

  /**
   * Will re-resolve the active view and re-reduce its data. Accepts an optional
   * view ID to only re-resolve if the given ID matches the active view.
   */
  updateActiveView = (maybeViewId) => {
    const { activeView } = this.state;

    if (!activeView) {
      return;
    }

    if (maybeViewId && maybeViewId === activeView.id) {
      this.setView(maybeViewId);
      return;
    }

    if (!maybeViewId) {
      this.setView(activeView.id);
    }
  };

  /**
   * Set whether the view controller is in debug mode.
   */
  setIsDebugEnabled = (isDebugEnabled) => {
    this.isDebugEnabled = isDebugEnabled;
  };
}
