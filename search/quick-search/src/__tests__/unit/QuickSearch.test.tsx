import React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import keycode from 'keycode';
import PropTypes from 'prop-types';
import { QuickSearch, ResultItemGroup, PersonResult } from '../..';
import AkSearch from '../../components/Search/Search';
import ResultItem from '../../components/ResultItem/ResultItem';

import {
  QS_ANALYTICS_EV_CLOSE,
  QS_ANALYTICS_EV_KB_CTRLS_USED,
  QS_ANALYTICS_EV_OPEN,
  QS_ANALYTICS_EV_QUERY_ENTERED,
  QS_ANALYTICS_EV_SUBMIT,
} from '../../components/constants';

const noOp = () => {};

const isInputFocused = (wrapper: ReactWrapper) =>
  wrapper.find('input').getDOMNode() === document.activeElement;

describe('<QuickSearch />', () => {
  const onAnalyticsEventSpy = jest.fn();
  const onClickSpy = jest.fn();

  const exampleChildren = [
    <ResultItemGroup key={0} title="test group 1">
      <PersonResult key={1} resultId="1" name="one" onClick={onClickSpy} />
      <PersonResult key={2} resultId="2" name="two" onClick={onClickSpy} />
    </ResultItemGroup>,
    <ResultItemGroup key={1} title="test group 2">
      <PersonResult resultId="3" name="three" onClick={onClickSpy} />
    </ResultItemGroup>,
  ];

  let rootElement: HTMLElement | undefined;
  let wrapper: ReactWrapper;
  let searchInput: ReactWrapper;
  let onSearchSubmitSpy: Object;

  const render = (props?: any, attachToDom = false) => {
    onSearchSubmitSpy = jest.fn();
    wrapper = mount(
      <QuickSearch
        {...props}
        onSearchInput={noOp}
        onSearchSubmit={onSearchSubmitSpy}
      >
        {(props && props.children) || exampleChildren}
      </QuickSearch>,
      {
        context: { onAnalyticsEvent: onAnalyticsEventSpy },
        childContextTypes: { onAnalyticsEvent: PropTypes.func },
        attachTo: attachToDom ? rootElement : undefined,
      },
    );
    searchInput = wrapper.find(AkSearch).find('input').last();
  };

  /**
   * Some of these tests check the focused element via `document.activeElement`.
   *
   * The default `mount()` method mounts into a div but doesn't attach it to the DOM.
   *
   * In order for `document.activeElement` to function as intended we need to explicitly
   * mount it into the DOM. We do this using the `attachTo` property.
   *
   * We mount to a div instead of `document.body` directly to avoid a react render warning.
   */
  beforeAll(() => {
    rootElement = document.createElement('div');
    document.body.appendChild(rootElement);
  });

  afterEach(() => {
    onAnalyticsEventSpy.mockReset();
    onClickSpy.mockReset();
  });

  afterAll(() => {
    if (rootElement) {
      document.body.removeChild(rootElement);
      rootElement = undefined;
    }
  });

  it('should contain a Search component', () => {
    render({});
    expect(wrapper.find(AkSearch)).toHaveLength(1);
    wrapper.unmount();
  });

  describe('(Prop) children', () => {
    beforeEach(() => {
      render({});
    });
    afterEach(() => {
      wrapper.unmount();
    });
    it('should render its children', () => {
      render({ children: <div id="child" /> });
      expect(wrapper.find('div#child').exists()).toBe(true);
    });

    it('should support non-component children', () => {
      render({ children: 'child' });
      // Modified as per BUILDTOOLS-220: expect.hasAssertions(), please modify accordingly.
      expect(wrapper.children).toBeDefined();
      /* Expect that no errors occur while parsing children */
    });

    it('should support non-component grandchildren', () => {
      render({ children: <div>grandchild</div> });
      // Modified as per BUILDTOOLS-220: expect.hasAssertions(), please modify accordingly.
      expect(wrapper.find('div').exists()).toBe(true);
      expect(wrapper.find('div').children).toBeDefined();
      /* Expect that no errors occur while parsing children */
    });
  });

  describe('Analytics events', () => {
    const getLastEventFired = () => {
      const calls = onAnalyticsEventSpy.mock.calls;
      return calls[calls.length - 1];
    };

    const expectEventFiredLastToBe = (name: string, partialPayload?: any) => {
      expect(getLastEventFired()[0]).toBe(name);
      if (partialPayload) {
        expect(getLastEventFired()[1]).toMatchObject(partialPayload);
      }
    };

    describe('mounting', () => {
      beforeEach(() => {
        render({});
      });
      it('should fire event on mount', () => {
        expectEventFiredLastToBe(QS_ANALYTICS_EV_OPEN);
        wrapper.unmount();
      });

      it('should fire event on unmount', () => {
        wrapper.unmount();
        expectEventFiredLastToBe(QS_ANALYTICS_EV_CLOSE);
      });
    });

    describe('user interaction', () => {
      beforeEach(() => {
        render({});
      });
      afterEach(() => {
        wrapper.unmount();
      });

      describe('submit/click event', () => {
        it('should fire event on result click', () => {
          const result = wrapper.find(ResultItem).first();
          result.simulate('click');
          expectEventFiredLastToBe(QS_ANALYTICS_EV_SUBMIT);
        });

        it('should carry payload of resultCount, queryLength, index and type', () => {
          const result = wrapper.find(ResultItem).first();
          result.simulate('click');
          const eventData = getLastEventFired()[1];
          expect(eventData).toMatchObject({
            index: expect.any(Number),
            queryLength: expect.any(Number),
            resultCount: expect.any(Number),
            type: expect.any(String),
          });
        });

        it('should fire submit analytics on shortcut submit', () => {
          searchInput.simulate('keydown', {
            key: 'Enter',
            keyCode: keycode('enter'),
            shiftKey: true,
          });
          expectEventFiredLastToBe(QS_ANALYTICS_EV_SUBMIT, {
            newTab: false, // enter always open in the same tab
            resultCount: 3,
            method: 'shortcut',
          });
        });
      });

      describe('submit/keyboard event', () => {
        it('should fire event on submit ENTER key stroke when an item is selected', () => {
          wrapper.setProps({ selectedResultId: '1' });
          searchInput.simulate('keydown', {
            key: 'Enter',
            keyCode: keycode('enter'),
          });
          expectEventFiredLastToBe(QS_ANALYTICS_EV_SUBMIT);
        });

        it('should NOT fire event on submit ENTER key stroke when composing using an IME', () => {
          wrapper.setProps({ selectedResultId: '1' });
          searchInput.simulate('keydown', { key: 'Enter', keyCode: 229 });
          expectEventFiredLastToBe(QS_ANALYTICS_EV_OPEN);
        });

        it('should carry payload of resultCount, queryLength, index and type when an item is selected', () => {
          wrapper.setProps({ selectedResultId: '1' });
          searchInput.simulate('keydown', {
            key: 'Enter',
            keyCode: keycode('enter'),
          });
          const eventData = getLastEventFired()[1];
          expect(eventData).toMatchObject({
            index: expect.any(Number),
            queryLength: expect.any(Number),
            resultCount: expect.any(Number),
            type: expect.any(String),
          });
        });
      });

      describe('keyboard-controls-used event', () => {
        it('ArrowUp', () => {
          searchInput.simulate('keydown', {
            key: 'ArrowUp',
            keyCode: keycode('up'),
          });
          expectEventFiredLastToBe(QS_ANALYTICS_EV_KB_CTRLS_USED);
        });

        it('ArrowUp while composing using an IME', () => {
          searchInput.simulate('keydown', { key: 'ArrowUp', keyCode: 229 });
          expectEventFiredLastToBe(QS_ANALYTICS_EV_OPEN);
        });

        it('ArrowDown', () => {
          searchInput.simulate('keydown', {
            key: 'ArrowDown',
            keyCode: keycode('down'),
          });
          expectEventFiredLastToBe(QS_ANALYTICS_EV_KB_CTRLS_USED);
        });

        it('ArrowDown while composing using an IME', () => {
          searchInput.simulate('keydown', { key: 'ArrowDown', keyCode: 229 });
          expectEventFiredLastToBe(QS_ANALYTICS_EV_OPEN);
        });

        it('Enter (when a result is selected)', () => {
          wrapper.setProps({ selectedResultId: '1' });
          searchInput.simulate('keydown', {
            key: 'Enter',
            keyCode: keycode('enter'),
          });
          const calls = onAnalyticsEventSpy.mock.calls;
          // -2 because the MOST recent event should be the submit event
          expect(calls[calls.length - 2][0]).toBe(
            QS_ANALYTICS_EV_KB_CTRLS_USED,
          );
        });

        it('should fire event every press', () => {
          searchInput.simulate('keydown', {
            key: 'ArrowUp',
            keyCode: keycode('up'),
          });
          searchInput.simulate('keydown', {
            key: 'ArrowUp',
            keyCode: keycode('up'),
          });
          searchInput.simulate('keydown', {
            key: 'ArrowUp',
            keyCode: keycode('up'),
          });
          const kbCtrlsUsedEventsFired = onAnalyticsEventSpy.mock.calls.filter(
            (call) => call[0] === QS_ANALYTICS_EV_KB_CTRLS_USED,
          );
          expect(kbCtrlsUsedEventsFired).toHaveLength(3);
        });
      });

      describe('query-entered event', () => {
        it('should fire when search term is entered', () => {
          wrapper.setProps({ value: 'hello' });
          expectEventFiredLastToBe(QS_ANALYTICS_EV_QUERY_ENTERED);
        });

        it('should not fire if previous search term was not empty', () => {
          // Set up non-empty-query state.
          render();
          wrapper.setProps({ value: 'hello' });
          // Clear events fired from mounting
          onAnalyticsEventSpy.mockReset();

          wrapper.setProps({ value: 'goodbye' });
          expect(onAnalyticsEventSpy).not.toHaveBeenCalled();
        });

        it('should only fire once per mount', () => {
          wrapper.setProps({ value: 'hello' });
          expectEventFiredLastToBe(QS_ANALYTICS_EV_QUERY_ENTERED);
          onAnalyticsEventSpy.mockReset();

          wrapper.setProps({ value: '' });
          wrapper.setProps({ value: 'is anybody home?' });
          wrapper.setProps({ value: '' });
          wrapper.setProps({ value: 'HELLOOO?' });
          expect(onAnalyticsEventSpy).not.toHaveBeenCalled();
        });
      });
    });
  });

  describe('Keyboard controls', () => {
    let originalWindowLocation = window.location;
    let locationAssignSpy: jest.Mock<{}>;

    beforeAll(() => {
      delete window.location;
      window.location = Object.assign({}, window.location, {
        assign: jest.fn(),
      });
    });

    beforeEach(() => {
      locationAssignSpy = jest.fn();
      window.location.assign = locationAssignSpy;
      render({}, true);
    });

    afterEach(() => {
      wrapper.unmount();
    });

    afterAll(() => {
      window.location = originalWindowLocation;
    });
    it('should select the first result on first DOWN keystroke', () => {
      wrapper
        .find(AkSearch)
        .find('input')
        .simulate('keydown', { key: 'ArrowDown', keyCode: keycode('down') });

      wrapper.update();
      expect(
        wrapper
          .find(ResultItem)
          .filterWhere((n) => !!n.prop('isSelected'))
          .prop('text'),
      ).toBe('one');
      expect(isInputFocused(searchInput)).toBe(true);
    });

    it('should select the next result on a subsequent DOWN keystroke', () => {
      wrapper
        .find(AkSearch)
        .find('input')
        .simulate('keydown', { key: 'ArrowDown', keyCode: keycode('down') })
        .simulate('keydown', { key: 'ArrowDown', keyCode: keycode('down') });

      wrapper.update();
      expect(
        wrapper
          .find(ResultItem)
          .filterWhere((n) => !!n.prop('isSelected'))
          .prop('text'),
      ).toBe('two');
      expect(isInputFocused(searchInput)).toBe(true);
    });

    it('should select the previous result on UP keystroke', () => {
      searchInput.simulate('keydown', {
        key: 'ArrowDown',
        keyCode: keycode('down'),
      });
      searchInput.simulate('keydown', {
        key: 'ArrowDown',
        keyCode: keycode('down'),
      });
      searchInput.simulate('keydown', {
        key: 'ArrowUp',
        keyCode: keycode('up'),
      });
      wrapper.update();
      expect(
        wrapper
          .find(ResultItem)
          .filterWhere((n) => !!n.prop('isSelected'))
          .prop('text'),
      ).toBe('one');
      expect(isInputFocused(searchInput)).toBe(true);
    });

    it('should wrap around to the top when traversing forward past the last result', () => {
      searchInput.simulate('keydown', {
        key: 'ArrowDown',
        keyCode: keycode('down'),
      });
      searchInput.simulate('keydown', {
        key: 'ArrowDown',
        keyCode: keycode('down'),
      });
      searchInput.simulate('keydown', {
        key: 'ArrowDown',
        keyCode: keycode('down'),
      });
      searchInput.simulate('keydown', {
        key: 'ArrowDown',
        keyCode: keycode('down'),
      });
      wrapper.update();
      expect(
        wrapper
          .find(ResultItem)
          .filterWhere((n) => !!n.prop('isSelected'))
          .prop('text'),
      ).toBe('one');
      expect(isInputFocused(searchInput)).toBe(true);
    });

    it('should wrap around to the end when traversing backward past the first result', () => {
      searchInput.simulate('keydown', {
        key: 'ArrowDown',
        keyCode: keycode('down'),
      });
      searchInput.simulate('keydown', {
        key: 'ArrowUp',
        keyCode: keycode('up'),
      });
      expect(
        wrapper
          .find(ResultItem)
          .filterWhere((n) => !!n.prop('isSelected'))
          .prop('text'),
      ).toBe('three');
      expect(isInputFocused(searchInput)).toBe(true);
    });

    it('should select the last result when traversing backward when no result is selected', () => {
      searchInput.simulate('keydown', {
        key: 'ArrowDown',
        keyCode: keycode('down'),
      });
      searchInput.simulate('keydown', {
        key: 'ArrowUp',
        keyCode: keycode('up'),
      });
      expect(
        wrapper
          .find(ResultItem)
          .filterWhere((n) => !!n.prop('isSelected'))
          .prop('text'),
      ).toBe('three');
      expect(isInputFocused(searchInput)).toBe(true);
    });

    it('should call window.location.assign() with item`s href property', () => {
      try {
        const url = 'http://www.atlassian.com';
        wrapper.setProps({
          children: (
            <ResultItemGroup title="test group 2">
              <PersonResult resultId="b" name="test" href={url} />
            </ResultItemGroup>
          ),
          selectedResultId: 'b',
        });
        searchInput.simulate('keydown', {
          key: 'Enter',
          keyCode: keycode('enter'),
        });
        wrapper.update();
        expect(locationAssignSpy).toHaveBeenCalledWith(url);
      } finally {
        locationAssignSpy.mockRestore();
      }
    });

    it('should trigger the onClick handler with the same parameters when a result is submitted via keyboards as when clicked', () => {
      searchInput.simulate('keydown', {
        key: 'Enter',
        keyCode: keycode('enter'),
      });
      // @ts-ignore - args property not recognised
      const paramsKeyboard = onClickSpy.args;
      onClickSpy.mockClear();
      wrapper.find(ResultItem).at(0).simulate('click');
      // @ts-ignore - args property not recognised
      expect(onClickSpy.args).toEqual(paramsKeyboard);
    });

    it('should run the onSearchSubmit callback prop on ENTER keystroke (when no item is selected)', () => {
      searchInput.simulate('keydown', {
        key: 'Enter',
        keyCode: keycode('enter'),
      });
      wrapper.update();
      expect(onSearchSubmitSpy).toHaveBeenCalledTimes(1);
      expect(isInputFocused(searchInput)).toBe(true);
    });

    it('should run the onSearchSubmit callback prop on Shift+ENTER keystroke (even when an item is selected)', () => {
      wrapper.setProps({ selectedResultId: '1' });
      searchInput.simulate('keydown', {
        key: 'Enter',
        keyCode: keycode('enter'),
        shiftKey: true,
      });
      wrapper.update();
      expect(onSearchSubmitSpy).toHaveBeenCalledTimes(1);
      expect(isInputFocused(searchInput)).toBe(true);
    });

    it("should run the onClick callback with the result's data on ENTER keystroke (when an item is selected)", () => {
      wrapper.setProps({ selectedResultId: '1' });
      searchInput.simulate('keydown', {
        key: 'Enter',
        keyCode: keycode('enter'),
      });
      wrapper.update();
      expect(onClickSpy).toHaveBeenCalledTimes(1);
      expect(isInputFocused(searchInput)).toBe(true);
    });

    it('should remove any selection when query changes', () => {
      const newChildren = (
        <ResultItemGroup title="test group 2">
          <PersonResult key={1} resultId="4" name="four" />
          <PersonResult key={2} resultId="5" name="five" />
        </ResultItemGroup>
      );
      wrapper.setProps({ children: newChildren });
      wrapper.update();
      expect(
        wrapper.find(ResultItem).filterWhere((n) => !!n.prop('isSelected')),
      ).toHaveLength(0);
      expect(isInputFocused(searchInput)).toBe(true);
    });

    it('should let mouseEnter override keyboard selection', () => {
      // First result is selected by default as established by previous test.
      // Mouse over the third result.
      wrapper.find(ResultItem).at(2).find(ResultItem).simulate('mouseenter');
      expect(
        wrapper
          .find(ResultItem)
          .filterWhere((n) => !!n.prop('isSelected'))
          .prop('text'),
      ).toBe('three');
    });

    it('should clear selection onMouseLeave', () => {
      wrapper.find(ResultItem).at(2).find(ResultItem).simulate('mouseleave');
      expect(
        wrapper.find(ResultItem).filterWhere((n) => !!n.prop('isSelected')),
      ).toHaveLength(0);
    });

    it('should remove selection on search input blur', () => {
      searchInput.simulate('blur');
      expect(wrapper.find(ResultItem).length).toBeGreaterThan(0);
      expect(
        wrapper.find(ResultItem).filterWhere((n) => !!n.prop('isSelected')),
      ).toHaveLength(0);
    });

    it('should autocomplete when Tab is pressed', () => {
      render({ autocompleteText: 'autocomplete' });
      searchInput.simulate('keydown', { key: 'Tab' });

      expect(wrapper.find(AkSearch).prop('value')).toBe('autocomplete ');
    });

    it('should autocomplete when ArrowRight is pressed', () => {
      render({ autocompleteText: 'autocomplete' });
      searchInput.simulate('keydown', { key: 'ArrowRight' });

      expect(wrapper.find(AkSearch).prop('value')).toBe('autocomplete ');
    });

    it('should not autocomplete when Tab is pressed repeatedly', () => {
      render({ autocompleteText: 'autocomplete' });
      searchInput.simulate('keydown', { key: 'Tab' });
      expect(wrapper.find(AkSearch).prop('value')).toBe('autocomplete ');
      searchInput.simulate('keydown', { key: 'Tab' });
      expect(wrapper.find(AkSearch).prop('value')).toBe('autocomplete ');
    });
  });

  it('should pass through the linkComponent prop', () => {
    render({});
    const MyLinkComponent = () => <div />;
    wrapper.setProps({ linkComponent: MyLinkComponent });
    wrapper.update();
    expect(wrapper.find(ResultItem).first().prop('linkComponent')).toBe(
      MyLinkComponent,
    );
    wrapper.unmount();
  });
});
