import { mount, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import Resizer from '../../components/js/Resizer';
import ResizerInner from '../../components/styled/ResizerInner';
import ResizerButton from '../../components/js/ResizerButton';
import WithElectronTheme from '../../theme/with-electron-theme';
import {
  standardOpenWidth as standardOpenWidthGenerator,
  globalOpenWidth as globalOpenWidthGenerator,
} from '../../shared-variables';
import { dispatchMouseEvent } from './_event-util';

configure({ adapter: new Adapter() });

const standardOpenWidth = standardOpenWidthGenerator(false);
const globalOpenWidth = globalOpenWidthGenerator(false);

const mountWithElectronTheme = children =>
  mount(<WithElectronTheme>{children}</WithElectronTheme>);

describe('<Resizer />', () => {
  describe('interacting', () => {
    let resizer;
    let resizeStartSpy;
    let resizeSpy;
    let resizeEndSpy;
    let resizeButtonSpy;
    beforeEach(() => {
      resizeStartSpy = jest.fn();
      resizeSpy = jest.fn();
      resizeEndSpy = jest.fn();
      resizeButtonSpy = jest.fn();

      resizer = mountWithElectronTheme(
        <Resizer
          onResizeStart={resizeStartSpy}
          onResize={resizeSpy}
          onResizeEnd={resizeEndSpy}
          onResizeButton={resizeButtonSpy}
        />,
      );
    });
    it('mousedown default is prevented', () => {
      const preventDefaultSpy = jest.fn();
      resizer.find(ResizerInner).simulate('mousedown', {
        screenX: 100,
        preventDefault: preventDefaultSpy,
      });
      expect(preventDefaultSpy).toHaveBeenCalled();
    });
    it('mousedown triggers onResizeStart', () => {
      resizer
        .find(ResizerInner)
        .simulate('mousedown', { screenX: 100, preventDefault: () => {} });
      expect(resizeStartSpy).toHaveBeenCalled();
      expect(resizeSpy).not.toHaveBeenCalled();
      expect(resizeEndSpy).not.toHaveBeenCalled();
    });
    it('mousemove triggers onResize', () => {
      resizer
        .find(ResizerInner)
        .simulate('mousedown', { screenX: 100, preventDefault: () => {} });
      dispatchMouseEvent('mousemove', { screenX: 200 });
      // Mouse move callbacks are wrapped with request animation frame so need
      // trigger a requestAnimationFrame step
      requestAnimationFrame.step();

      expect(resizeSpy).toHaveBeenCalled();
      expect(resizeEndSpy).not.toHaveBeenCalled();
    });
    it('mouseup triggers onResizeEnd', () => {
      resizer
        .find(ResizerInner)
        .simulate('mousedown', { screenX: 100, preventDefault: () => {} });
      dispatchMouseEvent('mouseup', { screenX: 200 });
      expect(resizeEndSpy).toHaveBeenCalled();
    });

    it('mouseup triggers onResizeButton if resizer was clicked instead of dragged', () => {
      resizer
        .find(ResizerInner)
        .simulate('mousedown', { screenX: 100, preventDefault: () => {} });
      dispatchMouseEvent('mouseup', { screenX: 100 });
      expect(resizeButtonSpy).toHaveBeenCalledWith(
        {
          isOpen: false,
          width: 64,
        },
        true,
      );
    });

    describe('onResizeEnd should be triggered when mousing over out of bounds elements', () => {
      it('should trigger an onResizeEnd when moving over an iframe', () => {
        resizer
          .find(ResizerInner)
          .simulate('mousedown', { screenX: 100, preventDefault: () => {} });
        dispatchMouseEvent('mouseout', {
          relatedTarget: document.createElement('iframe'),
        });
        expect(resizeEndSpy).toHaveBeenCalled();
      });
      it('should trigger an onResizeEnd when moving over an html element', () => {
        resizeEndSpy.mockReset();
        resizer
          .find(ResizerInner)
          .simulate('mousedown', { screenX: 100, preventDefault: () => {} });
        dispatchMouseEvent('mouseout', {
          relatedTarget: document.createElement('html'),
        });
        expect(resizeEndSpy).toHaveBeenCalled();
      });
      it('should trigger an onResizeEnd when moving out of the window (null)', () => {
        resizeEndSpy.mockReset();
        resizer
          .find(ResizerInner)
          .simulate('mousedown', { screenX: 100, preventDefault: () => {} });
        dispatchMouseEvent('mouseout', {
          relatedTarget: null,
        });
        expect(resizeEndSpy).toHaveBeenCalled();
      });
    });
    it('should not trigger onResizeEnd when mousing over a standard element', () => {
      resizeEndSpy.mockReset();
      resizer
        .find(ResizerInner)
        .simulate('mousedown', { screenX: 100, preventDefault: () => {} });
      dispatchMouseEvent('mouseout', {
        relatedTarget: document.createElement('div'),
      });
      expect(resizeEndSpy).not.toHaveBeenCalled();
    });
    it('should unbind all window listeners when resize ends', () => {
      const addSpy = jest.spyOn(window, 'addEventListener');
      const removeSpy = jest.spyOn(window, 'removeEventListener');

      // Clear any mock info from previous tests
      addSpy.mockReset();
      removeSpy.mockReset();

      resizer
        .find(ResizerInner)
        .simulate('mousedown', { screenX: 100, preventDefault: () => {} });

      // Filter out React 16 error boundary handlers.
      const addCalls = () =>
        addSpy.mock.calls.map(a => a[0]).filter(a => a !== 'error');
      const removeCalls = () =>
        removeSpy.mock.calls.map(a => a[0]).filter(a => a !== 'error');

      // Testing to ensure it was called
      expect(addCalls()).toEqual(['mousemove', 'mouseup', 'mouseout']);
      expect(removeCalls()).toEqual([]);

      dispatchMouseEvent('mouseup');

      expect(addCalls()).toEqual(removeCalls());

      // cleanup
      addSpy.mockRestore();
      removeSpy.mockRestore();
    });
  });

  describe('resizer button', () => {
    it('should not be visible if showResizeButton is false', () => {
      expect(
        mountWithElectronTheme(<Resizer showResizeButton={false} />).find(
          ResizerButton,
        ).length,
      ).toBe(0);
    });

    it('by default, <ResizerButton /> points left', () => {
      expect(
        mountWithElectronTheme(<Resizer />)
          .find(ResizerButton)
          .props().isPointingRight,
      ).toEqual(false);
    });
    it('when navigationWidth=0, <ResizerButton /> points right', () => {
      expect(
        mountWithElectronTheme(<Resizer navigationWidth={0} />)
          .find(ResizerButton)
          .props().isPointingRight,
      ).toEqual(true);
    });
    it(`when navigationWidth=${standardOpenWidth -
      1}, <ResizerButton /> points right`, () => {
      expect(
        mountWithElectronTheme(
          <Resizer navigationWidth={standardOpenWidth - 1} />,
        )
          .find(ResizerButton)
          .props().isPointingRight,
      ).toEqual(true);
    });
    it(`when navigationWidth=${standardOpenWidth}, <ResizerButton /> points left`, () => {
      expect(
        mountWithElectronTheme(<Resizer navigationWidth={standardOpenWidth} />)
          .find(ResizerButton)
          .props().isPointingRight,
      ).toEqual(false);
    });
    it(`when navigationWidth=${standardOpenWidth +
      100}, <ResizerButton /> points left`, () => {
      expect(
        mountWithElectronTheme(
          <Resizer navigationWidth={standardOpenWidth + 100} />,
        )
          .find(ResizerButton)
          .props().isPointingRight,
      ).toEqual(false);
    });
    it(`when navigationWidth=${standardOpenWidth -
      1}, clicking <ResizerButton /> triggers an expand to the open width`, done => {
      mountWithElectronTheme(
        <Resizer
          navigationWidth={standardOpenWidth - 1}
          onResizeButton={resizeState => {
            expect(resizeState).toEqual({
              isOpen: true,
              width: standardOpenWidth,
            });
            done();
          }}
        />,
      )
        .find(ResizerButton)
        .simulate('click');
    });
    it(`when navigationWidth=${standardOpenWidth}, clicking <ResizerButton /> triggers a collapse to the global open width`, done => {
      mountWithElectronTheme(
        <Resizer
          navigationWidth={standardOpenWidth}
          onResizeButton={(resizeState, resizerClick) => {
            expect(resizeState).toEqual({
              isOpen: false,
              width: globalOpenWidth,
            });
            expect(resizerClick).toBe(false);
            done();
          }}
        />,
      )
        .find(ResizerButton)
        .simulate('click');
    });
    it(`when navigationWidth=${standardOpenWidth +
      100}, clicking <ResizerButton /> triggers an expand to the open width`, done => {
      mountWithElectronTheme(
        <Resizer
          navigationWidth={standardOpenWidth + 100}
          onResizeButton={(resizeState, resizerClick) => {
            expect(resizeState).toEqual({
              isOpen: true,
              width: standardOpenWidth,
            });
            expect(resizerClick).toBe(false);
            done();
          }}
        />,
      )
        .find(ResizerButton)
        .simulate('click');
    });
  });
});
