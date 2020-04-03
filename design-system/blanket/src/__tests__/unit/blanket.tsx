import React from 'react';
import { mount } from 'enzyme';

import BlanketWithAnalytics, {
  BlanketWithoutAnalytics as Blanket,
} from '../../Blanket';
import { opacity } from '../../styled';

describe('ak-blanket', () => {
  describe('exports', () => {
    it('should export a base component', () => {
      expect(Blanket).toBeInstanceOf(Object);
    });
  });

  it('should be possible to create a component', () => {
    expect(mount(<Blanket />)).not.toBe(undefined);
  });

  describe('props', () => {
    describe('isTinted', () => {
      it('should be false by default', () => {
        expect(mount(<Blanket />).prop('isTinted')).toBe(false);
      });

      it('should get tint styling when prop set', () => {
        const props = { isTinted: true };
        expect(opacity(props)).toBe(1);
      });

      it('should not get tint styling when prop set to false', () => {
        const props = { isTinted: false };
        expect(opacity(props)).toBe(0);
      });
    });

    describe('canClickThrough', () => {
      it('should be false by default', () => {
        expect(mount(<Blanket />).prop('canClickThrough')).toBe(false);
      });
      it('when canClickThrough is true, onBlanketClicked should not be triggered', () => {
        const spy = jest.fn();
        const wrapper = mount(
          <Blanket canClickThrough onBlanketClicked={spy} />,
        );
        wrapper.simulate('click');
        expect(spy).toHaveBeenCalledTimes(0);
      });
    });

    describe('onBlanketClicked', () => {
      it('should trigger when blanket clicked', () => {
        const spy = jest.fn();
        const wrapper = mount(<Blanket onBlanketClicked={spy} />);
        wrapper.simulate('click');
        expect(spy).toHaveBeenCalledTimes(1);
      });
    });
  });
});

describe('BlanketWithAnalytics', () => {
  beforeEach(() => {
    jest.spyOn(global.console, 'warn');
    jest.spyOn(global.console, 'error');
  });
  afterEach(() => {
    (global.console.warn as jest.Mock).mockRestore();
    (global.console.error as jest.Mock).mockRestore();
  });

  it('should mount without errors', () => {
    mount(<BlanketWithAnalytics />);
    /* eslint-disable no-console */
    expect(console.warn).not.toHaveBeenCalled();
    expect(console.error).not.toHaveBeenCalled();
    /* eslint-enable no-console */
  });
});
