import ViewController from '../../ViewController';

const getItems = jest.fn(() => Promise.resolve([]));

const activeView = {
  id: 'view-id',
  type: 'product',
  data: [
    {
      id: 'another-view-id',
      items: [],
      nestedGroupKey: 'another-product',
      parentId: 'view-id',
      type: 'product',
    },
  ],
};

const view = {
  getItems,
  id: 'view-id',
  type: 'product',
};

const incomingView = {
  id: 'view-id',
  type: 'product',
};

describe('NavigationNext View Controller', () => {
  afterEach(() => {
    getItems.mockClear();
  });

  describe('Reducers', () => {
    it('should be able to add and remove view controller reducers', () => {
      const viewController = new ViewController({
        isDebugEnabled: true,
      });

      expect(viewController.reducers).toEqual({});

      const viewControllerReducer = (data) => data;
      const secondViewControllerReducer = (data) => data;
      viewController.addReducer('view-id', viewControllerReducer);
      viewController.addReducer('view-id', secondViewControllerReducer);

      expect(viewController.reducers).toEqual({
        'view-id': [viewControllerReducer, secondViewControllerReducer],
      });

      viewController.removeReducer('view-id', secondViewControllerReducer);
      expect(viewController.reducers).toEqual({
        'view-id': [viewControllerReducer],
      });

      viewController.removeReducer('view-id', viewControllerReducer);
      expect(viewController.reducers).toEqual({ 'view-id': [] });
    });

    it('should not change reducers if any reducer was added before remove function call', () => {
      const viewController = new ViewController({
        isDebugEnabled: true,
      });

      viewController.removeReducer('view-id', () => []);

      expect(viewController.reducers).toEqual({});
    });

    it('should not remove reducers if is not the same function reference', () => {
      const viewController = new ViewController({
        isDebugEnabled: true,
      });

      const viewControllerReducer = (data) => data;
      viewController.addReducer('view-id', viewControllerReducer);
      viewController.removeReducer('view-id', () => []);

      expect(viewController.reducers).toEqual({
        'view-id': [viewControllerReducer],
      });
    });
  });

  describe('Views', () => {
    it('should call method `getItems` in the given view object', () => {
      const viewController = new ViewController({
        isDebugEnabled: true,
      });
      viewController.addView(view);
      viewController.setView('view-id');

      expect(view.getItems).toHaveBeenCalled();
    });

    it('should add view as incoming when setView is called if view id with `getItems` promise was NOT solved', () => {
      const viewController = new ViewController({
        isDebugEnabled: true,
      });
      viewController.addView(view);
      viewController.setView('view-id');

      expect(viewController.state.incomingView).toMatchObject({
        id: view.id,
        type: view.type,
      });
    });

    it('should NOT add view as incoming when setView is called if view id with `getItems` is returning an empty list', () => {
      const viewController = new ViewController({
        isDebugEnabled: true,
      });

      viewController.addView({ ...view, getItems: () => [] });
      viewController.setView('view-id');

      expect(viewController.state.incomingView).toBe(null);
    });

    it('should add view as active when setView is called if view id with `getItems` promise and solved', async () => {
      const viewController = new ViewController({
        isDebugEnabled: true,
      });

      await viewController.addView(view);
      await viewController.setView('view-id');

      expect(viewController.state.activeView).toMatchObject({
        id: view.id,
        type: view.type,
      });
    });

    it('should add view as active when setView is called if view id with `getItems` is a function rather than a promise', () => {
      const viewController = new ViewController({
        isDebugEnabled: true,
      });

      const items = [{ type: 'Item', id: 'foo' }];

      viewController.addView({ ...view, getItems: () => items });
      viewController.setView('view-id');

      expect(viewController.state.activeView).toMatchObject({
        data: items,
        id: view.id,
        type: view.type,
      });
    });

    it('should provide an analyticsAttributes prop within activeView if a getAnalyticsAttributes prop has been provided when registering a view', () => {
      const viewController = new ViewController();

      const extraAttributes = { product: 'foo' };
      const items = [{ type: 'Item', id: 'bar' }];

      const getAnalyticsAttributes = jest.fn(() => extraAttributes);

      viewController.addView({
        ...view,
        getItems: () => items,
        getAnalyticsAttributes,
      });

      expect(getAnalyticsAttributes).not.toHaveBeenCalled();
      viewController.setView('view-id');
      expect(getAnalyticsAttributes).toHaveBeenCalledWith(items);
      expect(viewController.state.activeView).toMatchObject({
        analyticsAttributes: extraAttributes,
        data: items,
        id: view.id,
        type: view.type,
      });
    });

    it('should be able to add and remove views', () => {
      const viewController = new ViewController({
        isDebugEnabled: true,
      });

      expect(viewController.views).toEqual({});

      viewController.addView(view);
      viewController.setView('view-id');

      expect(viewController.views).toEqual({ [view.id]: { ...view } });

      viewController.removeView('view-id');

      expect(viewController.views).toEqual({});
      expect(viewController.reducers).toEqual({});
    });

    it('should not change views if any view was added before remove function call', () => {
      const viewController = new ViewController({
        isDebugEnabled: true,
      });
      expect(viewController.views).toEqual({});

      viewController.removeView('view-id');

      expect(viewController.views).toEqual({});
    });

    it('should not remove views if is not the same function reference', () => {
      const viewController = new ViewController({
        isDebugEnabled: true,
      });

      viewController.addView(view);
      viewController.setView('view-id');

      viewController.removeView('view-id');

      expect(viewController.views).toEqual({});
    });
  });

  it('should add incoming view as active view if the added and incoming view matches', () => {
    const viewController = new ViewController({
      isDebugEnabled: true,
    });

    viewController.addView(view);
    viewController.setView('view-id');

    viewController.state.activeView = { ...activeView, data: [] };
    viewController.state.incomingView = incomingView;
    viewController.addView(view);

    expect(viewController.state.activeView).toMatchObject({
      id: view.id,
      type: view.type,
    });
    expect(viewController.state.incomingView).toEqual(incomingView);
  });

  it('should reset the view if a view ID has been provided and it matches the active view', () => {
    const viewController = new ViewController({
      isDebugEnabled: true,
    });

    viewController.addView(view);
    viewController.setView('view-id');

    viewController.state.activeView = activeView;
    viewController.state.incomingView = incomingView;
    viewController.updateActiveView('view-id');

    const expectedData = {
      id: view.id,
      type: view.type,
      data: activeView.data,
    };

    expect(viewController.state.activeView).toMatchObject(expectedData);
    expect(viewController.state.incomingView).toEqual(incomingView);
  });

  it('should reset the view, active container and product If a view ID has NOT been provided', () => {
    const viewController = new ViewController({
      isDebugEnabled: true,
    });

    viewController.addView(view);
    viewController.setView('view-id');

    viewController.state.activeView = activeView;
    viewController.state.incomingView = incomingView;
    viewController.updateActiveView('');

    const expectedData = {
      id: view.id,
      type: view.type,
      data: activeView.data,
    };

    expect(viewController.state.activeView).toMatchObject(expectedData);
    expect(viewController.state.incomingView).toEqual(incomingView);
  });
});
