import React from 'react';
import { mount } from 'enzyme';
import { FileIdentifier } from '@atlaskit/media-client';
import {
  Navigation,
  NavigationBase,
  prevNavButtonId,
  nextNavButtonId,
} from '../../../navigation';
import ArrowLeftCircleIcon from '@atlaskit/icon/glyph/chevron-left-circle';
import ArrowRightCircleIcon from '@atlaskit/icon/glyph/chevron-right-circle';
import { KeyboardEventWithKeyCode } from '@atlaskit/media-test-helpers';

/**
 * Skipped two tests in here that are failing due to an issue with synthetic keyboard events
 * TODO: JEST-23 Fix these tests
 */
describe('Navigation', () => {
  const identifier: FileIdentifier = {
    id: 'some-id',
    occurrenceKey: 'some-custom-occurrence-key',
    mediaItemType: 'file',
  };

  const identifier2: FileIdentifier = {
    id: 'some-id-2',
    occurrenceKey: 'some-custom-occurrence-key',
    mediaItemType: 'file',
  };

  const identifier2Duplicated: FileIdentifier = {
    id: 'some-id-2',
    occurrenceKey: 'some-other-occurrence-key',
    mediaItemType: 'file',
  };

  const identifier3: FileIdentifier = {
    id: 'some-id-3',
    occurrenceKey: 'some-custom-occurrence-key',
    mediaItemType: 'file',
  };

  const nonFoundIdentifier: FileIdentifier = {
    id: 'some-other-id',
    occurrenceKey: 'some-custom-occurrence-key',
    mediaItemType: 'file',
  };

  const items = [identifier, identifier2, identifier3, identifier2Duplicated];

  function mountBaseComponent() {
    const createAnalyticsEventSpy = jest.fn();
    createAnalyticsEventSpy.mockReturnValue({ fire: jest.fn() });
    const el = mount(
      <NavigationBase
        createAnalyticsEvent={createAnalyticsEventSpy}
        items={[identifier, identifier2, identifier3]}
        selectedItem={identifier2}
        onChange={() => {}}
      />,
    );
    return { el, createAnalyticsEventSpy };
  }

  it('should show right arrow if there are items on the right', () => {
    const el = mount(
      <Navigation
        onChange={() => {}}
        items={items}
        selectedItem={identifier}
      />,
    );
    expect(el.find(ArrowRightCircleIcon)).toHaveLength(1);
  });

  it('should show left arrow if there are items on the left', () => {
    const el = mount(
      <Navigation
        onChange={() => {}}
        items={items}
        selectedItem={identifier3}
      />,
    );
    expect(el.find(ArrowLeftCircleIcon)).toHaveLength(1);
  });

  it('should not show arrows if there is only one item', () => {
    const el = mount(
      <Navigation
        onChange={() => {}}
        items={[identifier]}
        selectedItem={identifier}
      />,
    );
    expect(el.find(ArrowLeftCircleIcon)).toHaveLength(0);
    expect(el.find(ArrowRightCircleIcon)).toHaveLength(0);
  });

  it('should handle items with the same id', () => {
    const el = mount(
      <Navigation
        onChange={() => {}}
        items={items}
        selectedItem={identifier2Duplicated}
      />,
    );
    expect(el.find(ArrowLeftCircleIcon)).toHaveLength(1);
    expect(el.find(ArrowRightCircleIcon)).toHaveLength(1);
  });

  it('should show both arrows if there are items in both sides', () => {
    const el = mount(
      <Navigation
        onChange={() => {}}
        items={items}
        selectedItem={identifier2}
      />,
    );
    expect(el.find(ArrowLeftCircleIcon)).toHaveLength(1);
    expect(el.find(ArrowRightCircleIcon)).toHaveLength(1);
  });

  it('should call onChange callback when left arrow is clicked', () => {
    const onChange = jest.fn();
    const el = mount(
      <Navigation
        onChange={onChange}
        items={items}
        selectedItem={identifier2}
      />,
    );
    el.find(`[data-testid="${prevNavButtonId}"]`).first().simulate('click');
    expect(onChange).toBeCalledWith(identifier);
  });

  it('should call onChange callback when right arrow is clicked', () => {
    const onChange = jest.fn();
    const el = mount(
      <Navigation
        onChange={onChange}
        items={items}
        selectedItem={identifier}
      />,
    );
    el.find(`[data-testid="${nextNavButtonId}"]`).first().simulate('click');
    expect(onChange).toBeCalledWith(identifier2);
  });

  it('should not show any arrows if selectedItem is not found', () => {
    const onChange = jest.fn();
    const el = mount(
      <Navigation
        onChange={onChange}
        items={items}
        selectedItem={nonFoundIdentifier}
      />,
    );
    expect(el.find(ArrowRightCircleIcon)).toHaveLength(0);
    expect(el.find(ArrowLeftCircleIcon)).toHaveLength(0);
  });

  describe('Shortcuts', () => {
    it.skip('should call onChange callback when left ARROW key is pressed', () => {
      const onChange = jest.fn();
      mount(
        <Navigation
          onChange={onChange}
          items={items}
          selectedItem={identifier2}
        />,
      );
      const e = new KeyboardEventWithKeyCode('keydown', {
        bubbles: true,
        cancelable: true,
        keyCode: 37,
      });
      document.dispatchEvent(e);
      expect(onChange).toBeCalledWith(identifier);
    });

    it.skip('should call onChange callback when right ARROW key is pressed', () => {
      const onChange = jest.fn();
      mount(
        <Navigation
          onChange={onChange}
          items={items}
          selectedItem={identifier}
        />,
      );
      const e = new KeyboardEventWithKeyCode('keydown', {
        bubbles: true,
        cancelable: true,
        keyCode: 39,
      });
      document.dispatchEvent(e);
      expect(onChange).toBeCalledWith(identifier2);
    });
  });

  describe('Analytics', () => {
    it('should fire analytics on right arrow click', () => {
      const { el, createAnalyticsEventSpy } = mountBaseComponent();
      el.find(`[data-testid="${nextNavButtonId}"]`).first().simulate('click');
      expect(createAnalyticsEventSpy).toHaveBeenCalled();
    });

    it('should fire analytics on left arrow click', () => {
      const { el, createAnalyticsEventSpy } = mountBaseComponent();
      el.find(`[data-testid="${prevNavButtonId}"]`).first().simulate('click');
      expect(createAnalyticsEventSpy).toHaveBeenCalled();
    });
  });
});
