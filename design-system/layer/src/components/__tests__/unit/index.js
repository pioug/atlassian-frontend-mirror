import React from 'react';
import { shallow, mount } from 'enzyme';
import createStub from 'raf-stub';

import Layer from '../../..';
import ContentContainer from '../../../styledContentContainer';

jest.mock('popper.js', () => {
  const PopperJS = jest.requireActual('popper.js');

  return class Popper {
    static placements = PopperJS.placements;

    constructor() {
      return {
        destroy: () => {},
        scheduleUpdate: () => {},
      };
    }
  };
});

/* There is a lot in Layer that can not be tested easily in JSDom. Most of it should already be
   tested in Popper itself, but we should really have some sort of sanity checks for things like
   flipping behaviour.

   This file simply unit tests everything that can be unit tested. Browser and sanity checking will
   be done as a part of AK-1098 */

describe('Layer', () => {
  let stub;
  let rafSpy;

  beforeEach(() => {
    stub = createStub();
    rafSpy = jest
      .spyOn(global, 'requestAnimationFrame')
      .mockImplementation(stub.add);
  });

  afterEach(() => {
    rafSpy.mockRestore();
  });

  it('should be possible to create a component', () => {
    const wrapper = shallow(<Layer />);
    expect(wrapper).not.toBe(undefined);
  });

  describe('children', () => {
    it('should be rendered by Layer', () => {
      const wrapper = shallow(
        <Layer>
          <div id="target">Target</div>
        </Layer>,
      );
      expect(wrapper.find('#target').length).toBe(1);
    });

    // This is to avoid the layer appearing in the wrong part of the screen while Popper.js detects
    // where the content should be positioned.
    it('should be rendered with opacity:0 until Popper extracts styles', () => {
      const wrapper = mount(
        <Layer>
          <div id="target">Target</div>
        </Layer>,
      );
      expect(
        wrapper.find(ContentContainer).find('div[style]').props().style.opacity,
      ).toBe(0);

      const dummyPopperState = {
        offsets: {
          popper: {
            left: 0,
            top: 0,
          },
        },
      };

      wrapper.instance().extractStyles(dummyPopperState);
      stub.step();
      wrapper.update();

      expect(
        wrapper.find(ContentContainer).find('div[style]').props().style.opacity,
      ).toBe(undefined);
    });
  });

  describe('content prop', () => {
    const content = <div id="content">Some Content</div>;

    it('should be rendered by Layer', () => {
      const wrapper = shallow(<Layer content={content} />);
      expect(wrapper.find('#content').length).toBe(1);
    });
  });

  describe('state', () => {
    const content = <div id="content">Some Content</div>;

    it('cssPosition and transform should be reflected on the popper div', () => {
      const wrapper = shallow(
        <Layer content={content}>
          <div>Something to align to</div>
        </Layer>,
      );

      wrapper.setState({
        cssPosition: 'fixed',
        transform: 'translate3d(13px, 13px, 0px)',
      });

      const contentParent = wrapper.find('#content').parent();

      expect(contentParent.prop('style').position).toBe('fixed');
      expect(contentParent.prop('style').transform).toBe(
        'translate3d(13px, 13px, 0px)',
      );
    });

    it('flipped should cause onFlippedChange callback to be called', () => {
      const spy = jest.fn();
      const wrapper = mount(
        <Layer onFlippedChange={spy} content={content}>
          <div>Foo</div>
        </Layer>,
      );
      const state = {
        flipped: true,
        actualPosition: 'top left',
        originalPosition: 'bottom left',
      };

      expect(wrapper.state('flipped')).toBe(false);
      wrapper.setState(state);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(state);
    });

    it('hasExtractedStyles should cause onPositioned callback to be called', () => {
      const spy = jest.fn();
      const wrapper = mount(
        <Layer onPositioned={spy} content={content}>
          <div>Foo</div>
        </Layer>,
      );

      expect(wrapper.state('hasExtractedStyles')).toBe(false);
      wrapper.setState({ hasExtractedStyles: true });

      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});
