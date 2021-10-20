import React from 'react';

import { act, cleanup, fireEvent, render } from '@testing-library/react';
import { mount } from 'enzyme';

import InlineDialogWithAnalytics from '../../../index';
import { InlineDialogWithoutAnalytics as InlineDialog } from '../../index';

declare var global: any;

jest.mock('popper.js', () => {
  // @ts-ignore requireActual property is missing from jest
  const PopperJS = jest.requireActual('popper.js');

  return class Popper {
    static placements = PopperJS.placements;

    constructor() {
      return {
        destroy: () => {},
        update: () => {},
      };
    }
  };
});

describe('inline-dialog', () => {
  afterEach(cleanup);
  describe('default', () => {
    it('should render any children passed to it', () => {
      const { queryByTestId } = render(
        <InlineDialog content={() => null}>
          <div data-testid="child-content">Click me!</div>
        </InlineDialog>,
      );

      expect(queryByTestId('child-content')).not.toBeNull();
    });
  });

  describe('isOpen', () => {
    const content = (
      <div data-testid="inline-dialog-content">
        <p>Hello!</p>
      </div>
    );
    it('should render the content if isOpen is set', () => {
      const { queryByTestId } = render(
        <InlineDialog content={content} isOpen>
          <div id="children" />
        </InlineDialog>,
      );

      expect(queryByTestId('inline-dialog-content')).not.toBeNull();
    });

    it('should not render the content if isOpen is not set', () => {
      const { queryByTestId } = render(
        <InlineDialog content={content}>
          <div id="children" />
        </InlineDialog>,
      );
      expect(queryByTestId('inline-dialog-content')).toBeNull();
    });
  });

  describe('onContentClick', () => {
    it('should be triggered when the content is clicked', () => {
      const spy = jest.fn();
      const dummyContent = (
        <div data-testid="dummy-content">This is some content</div>
      );
      const { getByTestId } = render(
        <InlineDialog onContentClick={spy} content={dummyContent} isOpen>
          <div>trigger</div>
        </InlineDialog>,
      );

      fireEvent.click(getByTestId('dummy-content'));
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
  describe('onContentFocus', () => {
    it('should be triggered when an element in the content is focused', () => {
      const spy = jest.fn();
      const dummyLink = (
        <a data-testid="dummy-link" href="/test">
          This is a dummy link
        </a>
      );

      const { getByTestId } = render(
        <InlineDialog onContentFocus={spy} content={dummyLink} isOpen>
          <div id="children" />
        </InlineDialog>,
      );

      getByTestId('dummy-link').focus();
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('onContentBlur', () => {
    it('should be triggered when an element in the content is blurred', () => {
      const spy = jest.fn();
      const dummyLink = (
        <a data-testid="dummy-link" href="/test">
          This is a dummy link
        </a>
      );
      const { getByTestId } = render(
        <InlineDialog onContentBlur={spy} content={dummyLink} isOpen>
          <div id="children" />
        </InlineDialog>,
      );

      fireEvent.blur(getByTestId('dummy-link'));
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('handleClickOutside', () => {
    describe('EventListeners', () => {
      let addSpy: jest.SpyInstance;
      let removeSpy: jest.SpyInstance;
      beforeEach(() => {
        addSpy = jest.spyOn(window, 'addEventListener');
        removeSpy = jest.spyOn(window, 'removeEventListener');
      });

      afterEach(jest.restoreAllMocks);

      it('should add event listener onOpen', () => {
        jest.useFakeTimers(); // mock timers

        const { getByTestId } = render(
          <InlineDialog content={() => null} isOpen testId="inline-dialog">
            <div id="children" />
          </InlineDialog>,
        );

        act(() => {
          jest.runAllTimers(); // trigger setTimeout
        });

        expect(getByTestId('inline-dialog')).toBeInTheDocument();
        expect(
          addSpy.mock.calls.filter(([event]) => event === 'click'),
        ).toHaveLength(1);
        expect(
          removeSpy.mock.calls.filter(([event]) => event === 'click'),
        ).toHaveLength(0);
      });

      it('should remove event listener onOpen => remove onClose', () => {
        jest.useFakeTimers(); // mock timers

        const { getByTestId, rerender } = render(
          <InlineDialog content={() => null} isOpen testId="inline-dialog">
            <div id="children" />
          </InlineDialog>,
        );

        act(() => {
          jest.runAllTimers(); // trigger setTimeout
        });

        expect(getByTestId('inline-dialog')).toBeInTheDocument();
        expect(
          addSpy.mock.calls.filter(([event]) => event === 'click'),
        ).toHaveLength(1);

        rerender(
          <InlineDialog content={() => null} testId="inline-dialog">
            <div id="children" />
          </InlineDialog>,
        );

        // no new event listeners added
        expect(
          addSpy.mock.calls.filter(([event]) => event === 'click'),
        ).toHaveLength(1);
        expect(
          removeSpy.mock.calls.filter(([event]) => event === 'click'),
        ).toHaveLength(1);
      });
    });

    it('should not trigger the onClose prop if event is defaultPrevented', () => {
      const defaultPreventedEvent = (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
      ) => {
        return event.preventDefault();
      };
      const spy = jest.fn();
      const { getByTestId } = render(
        <>
          <InlineDialog
            content={() => null}
            isOpen
            onClose={spy}
            testId="inline-dialog"
          >
            <div id="children" />
          </InlineDialog>
          <button
            type="button"
            onClick={defaultPreventedEvent}
            data-testid="outside-inline-dialog"
          />
        </>,
      );

      // click the outside element
      fireEvent.click(getByTestId('outside-inline-dialog'));

      expect(getByTestId('outside-inline-dialog')).toBeInTheDocument();
      expect(spy).not.toHaveBeenCalled();
    });

    it('should invoke onClose callback on page click by default', () => {
      const callback = jest.fn();
      jest.useFakeTimers(); // mock timers

      render(
        <InlineDialog content={() => null} onClose={callback} isOpen>
          <div id="children" />
        </InlineDialog>,
      );

      act(() => {
        jest.runAllTimers(); // trigger setTimeout
      });

      // click anywhere outside of inline dialog
      fireEvent.click(document.body);
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should NOT invoke onClose callback when isOpen is false', () => {
      const callback = jest.fn();
      render(
        <InlineDialog content={() => null} onClose={callback}>
          <div id="children" />
        </InlineDialog>,
      );

      // click anywhere outside of inline dialog
      fireEvent.click(document);
      expect(callback).not.toHaveBeenCalledTimes(1);
    });
  });
});

describe('InlineDialogWithAnalytics', () => {
  beforeEach(() => {
    jest.spyOn(global.console, 'warn');
    jest.spyOn(global.console, 'error');
  });
  afterEach(() => {
    global.console.warn.mockRestore();
    global.console.error.mockRestore();
  });

  it('should mount without errors', () => {
    mount(<InlineDialogWithAnalytics children={''} content={''} />);
    /* eslint-disable no-console */
    expect(console.warn).not.toHaveBeenCalled();
    expect(console.error).not.toHaveBeenCalled();
    /* eslint-enable no-console */
  });
});
