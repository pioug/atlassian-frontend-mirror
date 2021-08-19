jest.mock('../../../../plugins/media/pm-plugins/alt-text/commands', () => ({
  closeMediaAltTextMenu: jest.fn(),
  updateAltText: jest.fn(() => jest.fn()),
}));

jest.mock('prosemirror-history', () => ({
  undo: jest.fn(() => () => {}),
  redo: jest.fn(() => () => {}),
}));

jest.mock('prosemirror-inputrules', () => ({
  ...jest.requireActual<Object>('prosemirror-inputrules'),
  undoInputRule: () => jest.fn(),
}));

import React from 'react';
import { mountWithIntl } from '@atlaskit/editor-test-helpers/enzyme';
import { EditorView } from 'prosemirror-view';
import AltTextEdit, {
  AltTextEditComponent,
  AltTextEditComponentState,
  MAX_ALT_TEXT_LENGTH,
} from '../../../../plugins/media/pm-plugins/alt-text/ui/AltTextEdit';
import { InjectedIntl, InjectedIntlProps } from 'react-intl';
import {
  EVENT_TYPE,
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
} from '../../../../plugins/analytics';
import { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import { ReactWrapper } from 'enzyme';
import PanelTextInput from '../../../../ui/PanelTextInput';
import { ErrorMessage } from '@atlaskit/editor-common';
import {
  closeMediaAltTextMenu,
  updateAltText,
} from '../../../../plugins/media/pm-plugins/alt-text/commands';

describe('AltTextEditComponent', () => {
  let createAnalyticsEvent: CreateUIAnalyticsEvent;
  let wrapper: ReactWrapper<InjectedIntlProps, AltTextEditComponentState, any>;
  beforeEach(() => {
    jest.clearAllMocks();
    createAnalyticsEvent = jest.fn().mockReturnValue({ fire() {} });
    wrapper = mountWithIntl(<AltTextEdit view={view} value="test" />);
  });

  afterEach(() => {
    if (wrapper && wrapper.length) {
      wrapper.unmount();
    }
  });

  const mockView = jest.fn(
    () =>
      (({
        state: { plugins: [] },
        dispatch: jest.fn(),
        someProp: jest.fn(),
      } as { state: {}; dispatch: Function }) as EditorView),
  );
  const view = new mockView();

  describe('fires respective alt text analytics events', () => {
    const defaultMediaEvent = {
      action: ACTION.EDITED,
      actionSubject: ACTION_SUBJECT.MEDIA,
      actionSubjectId: ACTION_SUBJECT_ID.ALT_TEXT,
      eventType: EVENT_TYPE.TRACK,
    };

    function setupWrapper(
      value: string,
    ): {
      view: EditorView<any>;
      wrapper: ReactWrapper<
        ReactIntl.InjectedIntlProps,
        AltTextEditComponentState,
        any
      >;
    } {
      const intl = {} as InjectedIntl;
      const wrapper = mountWithIntl<{}, AltTextEditComponentState>(
        <AltTextEditComponent
          view={view}
          value={value}
          intl={intl}
          createAnalyticsEvent={createAnalyticsEvent}
        />,
      );
      return { view, wrapper };
    }

    it('fires closed event after alt text component is removed', () => {
      const { wrapper } = setupWrapper('value');
      wrapper.unmount();
      expect(createAnalyticsEvent).toHaveBeenCalledWith({
        ...defaultMediaEvent,
        action: ACTION.CLOSED,
      });
    });

    it('fires cleared and edited events after clearing value and closing popup editor', () => {
      const { wrapper } = setupWrapper('value');
      // @ts-ignore
      wrapper.setProps({ value: '' });

      wrapper.unmount();
      expect(createAnalyticsEvent).toHaveBeenCalledWith({
        ...defaultMediaEvent,
        action: ACTION.CLEARED,
      });
      expect(createAnalyticsEvent).toHaveBeenCalledWith({
        ...defaultMediaEvent,
        action: ACTION.EDITED,
      });
      expect(createAnalyticsEvent).not.toHaveBeenCalledWith({
        ...defaultMediaEvent,
        action: ACTION.ADDED,
      });
    });

    it('fires edited event after updating value and closing popup editor', () => {
      const { wrapper } = setupWrapper('value');
      // @ts-ignore
      wrapper.setProps({ value: 'test changed' });

      wrapper.unmount();
      expect(createAnalyticsEvent).toHaveBeenCalledWith({
        ...defaultMediaEvent,
        action: ACTION.EDITED,
      });
      expect(createAnalyticsEvent).not.toHaveBeenCalledWith({
        ...defaultMediaEvent,
        action: ACTION.CLEARED,
      });
      expect(createAnalyticsEvent).not.toHaveBeenCalledWith({
        ...defaultMediaEvent,
        action: ACTION.ADDED,
      });
    });

    it('fires added event after updating value and closing popup editor', () => {
      const { wrapper } = setupWrapper('');

      // @ts-ignore
      wrapper.setProps({ value: 'value added' });

      wrapper.unmount();
      expect(createAnalyticsEvent).toHaveBeenCalledWith({
        ...defaultMediaEvent,
        action: ACTION.ADDED,
      });
      expect(createAnalyticsEvent).not.toHaveBeenCalledWith({
        ...defaultMediaEvent,
        action: ACTION.EDITED,
      });
      expect(createAnalyticsEvent).not.toHaveBeenCalledWith({
        ...defaultMediaEvent,
        action: ACTION.CLEARED,
      });
    });
  });

  describe('when the back button is clicked', () => {
    it('should call the closeMediaAltText command', () => {
      expect(wrapper.find('button[aria-label="Back"]').length).toEqual(1);
      wrapper.find('button[aria-label="Back"]').simulate('click');

      expect(closeMediaAltTextMenu).toBeCalledWith(view.state, view.dispatch);
      expect(updateAltText).not.toBeCalled();
    });
  });

  describe('when the clear text button is clicked', () => {
    it('should clear alt text and not call the closeMediaAltText command', () => {
      expect(
        wrapper.find('button[aria-label="Clear alt text"]').length,
      ).toEqual(1);
      wrapper.find('button[aria-label="Clear alt text"]').simulate('click');

      expect(closeMediaAltTextMenu).not.toBeCalled();
      expect(updateAltText).toBeCalledWith('');
    });
  });

  describe('when the esc key is pressed', () => {
    const KEY_CODE_ESCAPE = 27;

    it('should dispatch a handleKeyDown on the view', () => {
      wrapper.find('input').simulate('keydown', { keyCode: KEY_CODE_ESCAPE });

      expect(view.someProp).toBeCalledWith(
        'handleKeyDown',
        expect.any(Function),
      );
      expect(updateAltText).not.toBeCalled();
    });
  });

  describe('when onChange is called', () => {
    it('should call updateAltText command with the input text value', () => {
      const input = wrapper.find('input');
      // @ts-ignore
      input.instance().value = 'newvalue';
      input.simulate('change');

      expect(updateAltText).toBeCalledWith('newvalue');
    });

    describe('when new value is empty string', () => {
      it('should set state showClearTextButton=false', () => {
        const intl = {} as InjectedIntl;
        wrapper = mountWithIntl<{}, AltTextEditComponentState>(
          <AltTextEditComponent view={view} value={'test'} intl={intl} />,
        );
        expect(wrapper.state('showClearTextButton')).toBeTruthy();
        const input = wrapper.find('input');
        // @ts-ignore
        input.instance().value = '';
        input.simulate('change');

        expect(wrapper.state('showClearTextButton')).toBeFalsy();
      });
    });

    describe('when there was an empty string, and new text is nonempty', () => {
      it('should set state showClearTextButton=true', () => {
        const intl = {} as InjectedIntl;
        wrapper = mountWithIntl<{}, AltTextEditComponentState>(
          <AltTextEditComponent view={view} intl={intl} />,
        );
        expect(wrapper.state('showClearTextButton')).toBeFalsy();
        const input = wrapper.find('input');
        // @ts-ignore
        input.instance().value = 'newvalue';
        input.simulate('change');

        expect(wrapper.state('showClearTextButton')).toBeTruthy();
      });
    });
  });

  describe('when max length is set', () => {
    it('should ensure max length prop is passed to input', () => {
      const view = new mockView();
      const intl = {} as InjectedIntl;
      const wrapper = mountWithIntl<{}, AltTextEditComponentState>(
        <AltTextEditComponent view={view} intl={intl} />,
      );
      const input = wrapper.find('input');

      expect(input.prop('maxLength')).toBe(MAX_ALT_TEXT_LENGTH);
    });
  });

  describe('when onBlur is called', () => {
    it('should trim whitespace off the ends of alt-text', () => {
      wrapper = mountWithIntl(
        <AltTextEdit view={view} value="   trim whitespace around me   " />,
      );

      const input = wrapper.find('input');
      input.simulate('blur');

      expect(updateAltText).toBeCalledWith('trim whitespace around me');
    });
  });

  describe('when submit', () => {
    const KEY_CODE_ENTER = 13;

    it('should call updateAltText command with the input text value', () => {
      wrapper = mountWithIntl(<AltTextEdit view={view} value="test" />);

      wrapper.find('input').simulate('keydown', { keyCode: KEY_CODE_ENTER });

      expect(closeMediaAltTextMenu).toBeCalledWith(view.state, view.dispatch);
    });
  });

  describe('validation', () => {
    let wrapper: ReactWrapper<
        ReactIntl.InjectedIntlProps,
        AltTextEditComponentState,
        any
      >,
      validatorMock: jest.Mock<any, any>;

    beforeEach(() => {
      validatorMock = jest.fn();
    });

    describe('when validator editor prop is set', () => {
      beforeEach(() => {
        const intl = {} as InjectedIntl,
          value = 'test';
        wrapper = mountWithIntl<{}, AltTextEditComponentState>(
          <AltTextEditComponent
            view={view}
            value={value}
            intl={intl}
            altTextValidator={validatorMock}
            createAnalyticsEvent={createAnalyticsEvent}
          />,
        );

        //expect to call validator on init to check initial value
        expect(validatorMock).toHaveBeenCalled();
        validatorMock.mockReset();
      });

      it('calls validator on value change', () => {
        wrapper.find('input').simulate('change');
        expect(validatorMock).toHaveBeenCalled();
      });

      it('calls validator on blur', () => {
        wrapper.find('input').simulate('blur');
        expect(validatorMock).toHaveBeenCalled();
      });

      describe('when clearing the value using clear button', () => {
        beforeEach(() => {
          wrapper
            .find('button[data-testid="alt-text-clear-button"]')
            .simulate('click');
        });

        it('does not call validator, since we should forcefully allow empty value', () => {
          expect(validatorMock).not.toHaveBeenCalled();
          expect(wrapper.state('validationErrors')).toEqual([]);
        });
      });

      it('displays error message if validator returns error', () => {
        const validationErrors = ['error1', 'error2'];
        validatorMock.mockReturnValue(validationErrors);
        wrapper.find('input').simulate('change');

        expect(wrapper.state('validationErrors')).toEqual(validationErrors);
        expect(wrapper.find(ErrorMessage).length).toBe(2);
        expect(wrapper.find(ErrorMessage).at(0).text()).toBe(
          validationErrors[0],
        );
        expect(wrapper.find(ErrorMessage).at(1).text()).toBe(
          validationErrors[1],
        );
      });

      describe('when the clear text button is clicked', () => {
        it('should clear validation errors and input value', () => {
          const validationErrors = ['error1', 'error2'];
          validatorMock.mockReturnValue(validationErrors);
          wrapper.find('input').simulate('change');

          expect(wrapper.state('validationErrors')).toEqual(validationErrors);
          expect(wrapper.find(PanelTextInput).prop('defaultValue')).toBe(
            'test',
          );

          wrapper.find('button[aria-label="Clear alt text"]').simulate('click');

          expect(wrapper.state('validationErrors')).toHaveLength(0);
          expect(wrapper.find(ErrorMessage)).toHaveLength(0);
          expect(updateAltText).toBeCalledWith('');
          expect(wrapper.find(PanelTextInput).prop('defaultValue')).toBe('');
        });
      });

      it('does not display error message if validator returns empty value', () => {
        validatorMock.mockReturnValue([]);
        wrapper.find('input').simulate('change');
        expect(wrapper.state('validationErrors')).toEqual([]);
        expect(wrapper.find(ErrorMessage).length).toBe(0);
      });
    });
  });
});
