import UIController from '../../UIController';

const initialState = {
  isCollapsed: true,
  isResizeDisabled: false,
  productNavWidth: 100,
};

const cacheController = {
  get: jest.fn(),
  set: jest.fn(),
};

describe('NavigationNext UI Controller: UIController', () => {
  afterEach(() => {
    cacheController.get.mockRestore();
    cacheController.set.mockRestore();
  });

  describe('Caching the UI state', () => {
    it('should add the default state if a cache controller was not passed', () => {
      const uiController = new UIController(initialState, false);
      expect(uiController.state).toEqual({
        isCollapsed: true,
        isResizeDisabled: false,
        isResizing: false,
        productNavWidth: 100,
      });
    });

    it('should add the cache controller functions into the controller', () => {
      const uiController = new UIController(initialState, cacheController);

      expect(uiController.getCache === cacheController.get).toBe(true);
      expect(uiController.setCache === cacheController.set).toBe(true);
    });

    it('should store the collapsed state and the width of the navigation in the cache', () => {
      const uiController = new UIController(initialState, cacheController);
      uiController.storeState(uiController.state);

      const { isCollapsed, productNavWidth } = initialState;
      expect(cacheController.set).toHaveBeenCalledWith({
        isCollapsed,
        productNavWidth,
      });
    });

    it('should retrieve the collapsed state and the width of the navigation from the cache', () => {
      const mockCache = {
        get: () => ({
          isCollapsed: false,
          productNavWidth: 200,
          // Although this function returns a value for isResizing, it should be
          // ignored
          isResizing: true,
        }),
        set: () => {},
      };

      const uiController = new UIController({}, mockCache);
      expect(uiController.state).toMatchObject({
        isCollapsed: false,
        productNavWidth: 200,
        isResizing: false,
      });
    });
  });

  it('should toggle collapse state if `toggleCollapse` is called', () => {
    const uiController = new UIController(initialState, cacheController);

    uiController.toggleCollapse();

    expect(uiController.state.isCollapsed).toEqual(false);

    uiController.toggleCollapse();

    expect(uiController.state.isCollapsed).toEqual(true);
    expect(cacheController.set).toHaveBeenCalled();
  });

  it('should manually start the resize event', () => {
    const uiController = new UIController(initialState, cacheController);
    const resizeData = {
      productNavWidth: 200,
      isCollapsed: false,
    };

    uiController.manualResizeStart(resizeData);

    expect(uiController.state).toMatchObject({
      ...resizeData,
      isResizing: true,
    });
  });

  it('should manually stop the resize event', () => {
    const uiController = new UIController(initialState, cacheController);
    const resizeData = {
      productNavWidth: 200,
      isCollapsed: false,
    };

    uiController.manualResizeEnd(resizeData);

    expect(uiController.state).toMatchObject({
      ...resizeData,
      isResizing: false,
    });
  });

  describe('Disabling expanding, collapsing, and resizing', () => {
    describe('Initialising the state', () => {
      it('should default to false', () => {
        const uiController = new UIController({}, false);
        expect(uiController.state.isResizeDisabled).toBe(false);
      });

      it('should take precedence over the initial isCollapsed value', () => {
        const uiController = new UIController(
          { isCollapsed: true, isResizeDisabled: true },
          false,
        );
        expect(uiController.state).toMatchObject({
          isCollapsed: false,
          isResizeDisabled: true,
        });
      });
    });

    describe('#disableResize()', () => {
      it('should set state.isResizeDisabled to true', () => {
        const uiController = new UIController({}, false);
        uiController.disableResize();
        expect(uiController.state.isResizeDisabled).toEqual(true);
      });

      it('should always set state.isCollapsed to false', () => {
        const uiController = new UIController({ isCollapsed: true }, false);
        expect(uiController.state.isCollapsed).toEqual(true);
        uiController.disableResize();
        expect(uiController.state.isCollapsed).toEqual(false);
      });
    });

    describe('#enableResize()', () => {
      it('should set state.isResizeDisabled to false', () => {
        const uiController = new UIController(
          { isResizeDisabled: true },
          false,
        );
        expect(uiController.state.isResizeDisabled).toEqual(true);
        uiController.enableResize();
        expect(uiController.state.isResizeDisabled).toEqual(false);
      });

      it('should restore the isCollapsed state that was set before .disableResize() was called', () => {
        const uiController = new UIController({ isCollapsed: true }, false);
        uiController.disableResize();
        expect(uiController.state.isCollapsed).toEqual(false);
        uiController.enableResize();
        expect(uiController.state.isCollapsed).toEqual(true);
      });

      it('should restore the isCollapsed state that it was initialised with', () => {
        const uiController = new UIController(
          { isCollapsed: true, isResizeDisabled: true },
          false,
        );
        expect(uiController.state.isCollapsed).toEqual(false);
        uiController.enableResize();
        expect(uiController.state.isCollapsed).toEqual(true);

        // Initialised from cache
        const uiControllerWithCache = new UIController(
          { isResizeDisabled: true },
          {
            get: () => ({
              isCollapsed: true,
              isResizing: false,
              productNavWidth: 240,
            }),
            set: () => {},
          },
        );
        expect(uiControllerWithCache.state.isCollapsed).toEqual(false);
        uiControllerWithCache.enableResize();
        expect(uiControllerWithCache.state.isCollapsed).toEqual(true);
      });
    });

    describe('Preventing imperative methods from updating the state', () => {
      let uiController;
      let stateSnapshot;
      beforeEach(() => {
        uiController = new UIController({ isResizeDisabled: true }, false);
        stateSnapshot = { ...uiController.state };
      });

      it('should prevent calls to .collapse() from updating the state', () => {
        uiController.collapse();
        expect(uiController.state).toEqual(stateSnapshot);
      });

      it('should prevent calls to .expand() from updating the state', () => {
        uiController.expand();
        expect(uiController.state).toEqual(stateSnapshot);
      });

      it('should prevent calls to .toggleCollapse() from updating the state', () => {
        uiController.toggleCollapse();
        expect(uiController.state).toEqual(stateSnapshot);
      });

      it('should prevent calls to .manualResizeStart() from updating the state', () => {
        uiController.manualResizeStart({
          productNavWidth: 0,
          isCollapsed: false,
        });
        expect(uiController.state).toEqual(stateSnapshot);
      });

      it('should prevent calls to .manualResizeEnd() from updating the state', () => {
        uiController.manualResizeEnd({
          productNavWidth: 0,
          isCollapsed: false,
        });
        expect(uiController.state).toEqual(stateSnapshot);
      });
    });
  });
});
