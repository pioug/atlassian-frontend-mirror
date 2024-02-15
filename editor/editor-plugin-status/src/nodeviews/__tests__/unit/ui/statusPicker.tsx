import React from 'react';

import {
  act,
  fireEvent as reactFireEvent,
  render,
} from '@testing-library/react';
import type { Stub } from 'raf-stub';
import createStub from 'raf-stub';
import { IntlProvider } from 'react-intl-next';

import type { AnalyticsEventPayload } from '@atlaskit/analytics-next';

import { FABRIC_CHANNEL } from '../../../../analytics';
import { StatusPickerWithoutAnalytcs as StatusPicker } from '../../../../ui/statusPicker';

describe('StatusPicker', () => {
  const closeStatusPicker = jest.fn();
  const createAnalyticsEvent = jest.fn();
  const onSelect = jest.fn();
  const onTextChanged = jest.fn();
  const onEnter = jest.fn();
  const fireEvent = jest.fn();
  const preventDefault = jest.fn();
  const stopPropagation = jest.fn();
  const stopImmediatePropagation = jest.fn();
  const event = {
    preventDefault,
    stopPropagation,
    nativeEvent: { stopImmediatePropagation },
  };

  beforeEach(() => {
    createAnalyticsEvent.mockReturnValue({
      fire: fireEvent,
    });
    document.body.innerHTML = "<div id='first'></div><div id='second'></div>";
  });

  afterEach(() => {
    createAnalyticsEvent.mockReset();
    fireEvent.mockReset();

    createAnalyticsEvent.mockReturnValue({
      fire: fireEvent,
    });
    preventDefault.mockReset();
    stopPropagation.mockReset();
    stopImmediatePropagation.mockReset();
    onEnter.mockReset();
    onSelect.mockReset();
    onTextChanged.mockReset();
    closeStatusPicker.mockReset();
  });

  const mountStatusPicker = () =>
    // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage, @atlaskit/design-system/ensure-design-token-usage/preview
    render(
      <StatusPicker
        target={document.getElementById('first')}
        closeStatusPicker={closeStatusPicker}
        onSelect={onSelect}
        onTextChanged={onTextChanged}
        onEnter={onEnter}
        isNew={true}
        createAnalyticsEvent={createAnalyticsEvent}
        defaultColor="purple"
        defaultText="Hello"
        defaultLocalId="12345"
      />,
      {
        wrapper: ({ children }) => {
          return <IntlProvider locale="en">{children}</IntlProvider>;
        },
      },
    );

  const createPayloadPopupOpened = (
    action: string,
    localId: string,
    selectedColor: string,
    textLength: number,
    state: string,
  ) => ({
    action,
    actionSubject: 'statusPopup',
    attributes: expect.objectContaining({
      componentName: 'status',
      localId,
      selectedColor,
      textLength,
      state,
    }),
  });

  const createPayloadPopupClosed = (
    action: string,
    localId: string,
    selectedColor: string,
    textLength: number,
    state: string,
  ) => ({
    action,
    actionSubject: 'statusPopup',
    attributes: expect.objectContaining({
      componentName: 'status',
      duration: expect.any(Number),
      inputMethod: 'blur',
      localId,
      selectedColor,
      state,
      textLength,
    }),
  });

  const assertAnalyticsPayload = (payload: AnalyticsEventPayload) => {
    expect(createAnalyticsEvent).toBeCalledWith(
      expect.objectContaining(payload),
    );
    expect(fireEvent).toBeCalledWith(FABRIC_CHANNEL);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const registerDocumentListeners = (map: Record<any, any> = {}) => {
    document.addEventListener = jest.fn((event, cb) => {
      map[event] = cb;
    });
  };

  describe('analytics', () => {
    it('should fire statusPopup.opened analytics when StatusPicker is mounted', () => {
      const wrapper = mountStatusPicker();
      wrapper.unmount();
      assertAnalyticsPayload(
        // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage, @atlaskit/design-system/ensure-design-token-usage/preview
        createPayloadPopupOpened('opened', '12345', 'purple', 5, 'new'),
      );
      assertAnalyticsPayload(
        // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage, @atlaskit/design-system/ensure-design-token-usage/preview
        createPayloadPopupClosed('closed', '12345', 'purple', 5, 'new'),
      );
    });

    it('should fire statusPopup.closed for previous Status instance and statusPopup.opened for the new Status', () => {
      const wrapper = mountStatusPicker();
      wrapper.rerender(
        // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage, @atlaskit/design-system/ensure-design-token-usage/preview
        <StatusPicker
          closeStatusPicker={closeStatusPicker}
          onSelect={onSelect}
          onTextChanged={onTextChanged}
          onEnter={onEnter}
          createAnalyticsEvent={createAnalyticsEvent}
          defaultColor={'red'}
          defaultText={'Boo'}
          defaultLocalId={'45678'}
          isNew={false}
          target={document.getElementById('second')}
        />,
      );
      wrapper.unmount();

      assertAnalyticsPayload(
        // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage, @atlaskit/design-system/ensure-design-token-usage/preview
        createPayloadPopupOpened('opened', '12345', 'purple', 5, 'new'),
      );
      assertAnalyticsPayload(
        // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage, @atlaskit/design-system/ensure-design-token-usage/preview
        createPayloadPopupClosed('closed', '12345', 'purple', 5, 'new'),
      );
      assertAnalyticsPayload(
        // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage, @atlaskit/design-system/ensure-design-token-usage/preview
        createPayloadPopupOpened('opened', '45678', 'red', 3, 'update'),
      );
      assertAnalyticsPayload(
        // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage, @atlaskit/design-system/ensure-design-token-usage/preview
        createPayloadPopupClosed('closed', '45678', 'red', 3, 'update'),
      );
    });
  });

  describe('StatusPicker callbacks', () => {
    let raf: Stub;
    beforeEach(() => {
      raf = createStub();
      jest.spyOn(global, 'requestAnimationFrame').mockImplementation(raf.add);
    });
    afterEach(() => jest.clearAllMocks());

    it('should fire props.onEnter callback when Enter is pressed in the input field', () => {
      const wrapper = mountStatusPicker();
      const input = wrapper.getByLabelText('Set a status');

      reactFireEvent.keyPress(input, {
        which: 'enter',
        key: 'Enter',
        keyCode: 13,
      });
      expect(onEnter).toHaveBeenCalled();
    });

    it('should fire props.onEnter callback when Escape is pressed in the input field', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const map: { keydown?: (event: any) => void } = {};
      registerDocumentListeners(map);

      mountStatusPicker();

      act(() => {
        raf.flush();
      });

      map.keydown?.({ code: 'Escape', preventDefault, stopPropagation });

      expect(preventDefault).toHaveBeenCalled();
      expect(onEnter).toHaveBeenCalled();
    });

    describe('close status picker', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let windowSpy: jest.MockInstance<any, any[]>;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let map: { click?: (event: any) => void } = {};
      let raf: Stub;
      beforeEach(() => {
        raf = createStub();
        jest.spyOn(global, 'requestAnimationFrame').mockImplementation(raf.add);
        windowSpy = jest.spyOn(window, 'getSelection');
        registerListenersAndMountPicker();
      });
      afterEach(() => jest.clearAllMocks());

      const registerListenersAndMountPicker = () => {
        map = {};
        registerDocumentListeners(map);
        mountStatusPicker();
      };

      it('should fire props.close callback when user clicks outside the popup', () => {
        windowSpy.mockImplementation(() => null);
        act(() => {
          raf.flush();
        });
        // simulate user clicking outside the popup
        map.click?.({ ...event, target: document.createElement('BUTTON') });
        expect(preventDefault).toHaveBeenCalled();
        expect(closeStatusPicker).toHaveBeenCalled();
      });

      it('should NOT fire props.close callback when user selecting text and mouseup outside popup', () => {
        windowSpy.mockImplementation(() => ({
          key: 'here',
        }));
        act(() => {
          raf.flush();
        });
        // simulate user clicking outside the popup
        map.click?.({ ...event, target: document.createElement('BUTTON') });
        expect(preventDefault).toHaveBeenCalled();
        expect(closeStatusPicker).not.toHaveBeenCalled();
      });
    });
  });
});
