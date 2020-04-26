import React from 'react';
import { InjectedIntlProps } from 'react-intl';
import { ReactWrapper } from 'enzyme';
import createStub from 'raf-stub';
import { mountWithIntl } from '@atlaskit/editor-test-helpers';
import Textfield from '@atlaskit/textfield';
import FindReplace, { FindReplaceProps } from '../../../ui/FindReplace';
import Find from '../../../ui/Find';
import { Count } from '../../../ui/styles';
import Replace from '../../../ui/Replace';

describe('FindReplace', () => {
  let findReplace: ReactWrapper<FindReplaceProps & InjectedIntlProps>;
  const rafStub = createStub();
  const onFindSpy = jest.fn();
  const onFindNextSpy = jest.fn();
  const onFindPrevSpy = jest.fn();
  const onFindBlurSpy = jest.fn();
  const onFocusElementRefSetSpy = jest.fn();
  const onCancelSpy = jest.fn();
  const onReplaceSpy = jest.fn();
  const onReplaceAllSpy = jest.fn();
  const dispatchAnalyticsEventSpy = jest.fn();
  let rafSpy: jest.SpyInstance;

  const mountComponent = (props: Partial<FindReplaceProps> = {}) =>
    mountWithIntl<FindReplaceProps & InjectedIntlProps, any>(
      <FindReplace
        findText=""
        count={{ index: 0, total: 0 }}
        replaceText=""
        shouldFocus
        onFind={onFindSpy}
        onFindNext={onFindNextSpy}
        onFindPrev={onFindPrevSpy}
        onFindBlur={onFindBlurSpy}
        onFocusElementRefSet={onFocusElementRefSetSpy}
        onCancel={onCancelSpy}
        onReplace={onReplaceSpy}
        onReplaceAll={onReplaceAllSpy}
        dispatchAnalyticsEvent={dispatchAnalyticsEventSpy}
        {...props}
      />,
    );

  beforeAll(() => {
    rafSpy = jest
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation(rafStub.add);
  });

  afterEach(() => {
    onFindSpy.mockClear();
    onFindNextSpy.mockClear();
    onFindPrevSpy.mockClear();
    onFindBlurSpy.mockClear();
    onFocusElementRefSetSpy.mockClear();
    onCancelSpy.mockClear();
    onReplaceSpy.mockClear();
    onReplaceAllSpy.mockClear();
    dispatchAnalyticsEventSpy.mockClear();
  });

  afterAll(() => {
    rafSpy.mockRestore();
  });

  describe('Find', () => {
    it('should display search text', () => {
      findReplace = mountComponent({
        findText: 'quokka',
      });
      expect(
        findReplace
          .find(Find)
          .find(Textfield)
          .prop('defaultValue'),
      ).toBe('quokka');
    });

    it('should display num results', () => {
      findReplace = mountComponent({
        findText: 'quokka',
        count: { index: 2, total: 32 },
      });
      expect(findReplace.find(Count).text()).toBe('3/32');
    });

    it('should display "No results found" if no results', () => {
      findReplace = mountComponent({
        findText: 'quokka',
        count: { index: 0, total: 0 },
      });
      expect(findReplace.find(Count).text()).toBe('No results found');
    });

    it('should not display num results if no search text', () => {
      findReplace = mountComponent({
        findText: '',
        count: { index: 0, total: 0 },
      });
      expect(findReplace.find(Count).exists()).toBe(false);
    });

    it('should set focus to replace textfield when arrow down', () => {
      findReplace = mountComponent({
        findText: '',
        count: { index: 0, total: 0 },
      });
      const replaceTextfield: React.RefObject<HTMLElement> = findReplace.state(
        'replaceTextfieldRef',
      );
      const replaceTextfieldEl = replaceTextfield.current as HTMLElement;
      jest.spyOn(replaceTextfieldEl, 'focus');

      findReplace
        .find(Find)
        .find(Textfield)
        .find('input')
        .simulate('keydown', { key: 'ArrowDown' });

      expect(replaceTextfieldEl.focus).toHaveBeenCalled();
    });

    describe('when typing inside find textfield', () => {
      it('should call props.onFind', () => {
        findReplace = mountComponent();
        findReplace
          .find(Find)
          .find(Textfield)
          .find('input')
          .simulate('change', { target: { value: 'quokka' } });
        rafStub.flush();
        expect(onFindSpy).toHaveBeenCalledWith('quokka');
      });
    });

    describe('find next', () => {
      beforeEach(() => {
        findReplace = mountComponent({
          findText: 'quokka',
          count: { index: 0, total: 32 },
        });
      });

      it('should call props.onFindNext when click find next button', () => {
        findReplace.find('button[data-testid="Find next"]').simulate('click');
        expect(onFindNextSpy).toHaveBeenCalled();
      });

      it('should call props.onFindNext when hit enter inside find textfield', () => {
        findReplace
          .find(Find)
          .find(Textfield)
          .find('input')
          .simulate('keydown', { key: 'Enter' });
        expect(onFindNextSpy).toHaveBeenCalled();
      });

      it('is disabled when <= 1 results', () => {
        findReplace = mountComponent({
          findText: 'quokka',
          count: { index: 0, total: 0 },
        });
        const buttonEl = findReplace.find('button[data-testid="Find next"]');
        expect(buttonEl.props().disabled).toBe(true);
      });
    });

    describe('find previous', () => {
      beforeEach(() => {
        findReplace = mountComponent({
          findText: 'quokka',
          count: { index: 0, total: 32 },
        });
      });

      it('should call props.onFindPrev when click find prev button', () => {
        findReplace
          .find('button[data-testid="Find previous"]')
          .simulate('click');
        expect(onFindPrevSpy).toHaveBeenCalled();
      });

      it('should call props.onFindPrev when hit shift + enter inside find textfield', () => {
        findReplace
          .find(Find)
          .find(Textfield)
          .find('input')
          .simulate('keydown', { key: 'Enter', shiftKey: true });
        expect(onFindPrevSpy).toHaveBeenCalled();
      });

      it('is disabled when <= 1 results', () => {
        findReplace = mountComponent({
          findText: 'quokka',
          count: { index: 0, total: 0 },
        });
        const buttonEl = findReplace.find(
          'button[data-testid="Find previous"]',
        );
        expect(buttonEl.props().disabled).toBe(true);
      });
    });

    describe('cancel', () => {
      it('should call props.onCancel when click cancel button', () => {
        findReplace = mountComponent();
        findReplace.find('button[data-testid="Close"]').simulate('click');
        expect(onCancelSpy).toHaveBeenCalled();
      });
    });
  });

  describe('Replace', () => {
    beforeEach(() => {
      findReplace = mountComponent({
        findText: 'quokka',
        replaceText: 'bilby',
        count: { index: 0, total: 32 },
      });
    });

    it('should display replace text', () => {
      expect(
        findReplace
          .find(Replace)
          .find(Textfield)
          .prop('defaultValue'),
      ).toBe('bilby');
    });

    it('should fire analytics event when typing in replace field', () => {
      findReplace
        .find(Replace)
        .find(Textfield)
        .find('input')
        .simulate('change', { key: 'c' });
      expect(dispatchAnalyticsEventSpy).toHaveBeenCalledWith({
        eventType: 'track',
        action: 'changedReplacementText',
        actionSubject: 'findReplaceDialog',
      });
    });

    it('should set focus to find textfield when arrow up', () => {
      const findTextfield: React.RefObject<HTMLElement> = findReplace.state(
        'findTextfieldRef',
      );
      const findTextfieldEl = findTextfield.current as HTMLElement;
      jest.spyOn(findTextfieldEl, 'focus');

      findReplace
        .find(Replace)
        .find(Textfield)
        .find('input')
        .simulate('keydown', { key: 'ArrowUp' });

      expect(findTextfieldEl.focus).toHaveBeenCalled();
    });

    describe('replace', () => {
      it('should call props.onReplace when replace button clicked', () => {
        findReplace.find('button[data-testid="Replace"]').simulate('click');
        expect(onReplaceSpy).toHaveBeenCalledWith({
          replaceText: 'bilby',
          triggerMethod: 'button',
        });
      });

      it('should call props.onReplace when hit enter inside replace textfield', () => {
        findReplace
          .find(Replace)
          .find(Textfield)
          .find('input')
          .simulate('keydown', { key: 'Enter' });
        expect(onReplaceSpy).toHaveBeenCalledWith({
          replaceText: 'bilby',
          triggerMethod: 'keyboard',
        });
      });

      it('is disabled when < 1 results', () => {
        findReplace = mountComponent({
          findText: 'quokka',
          count: { index: 0, total: 0 },
        });
        const buttonEl = findReplace.find('button[data-testid="Replace"]');
        expect(buttonEl.props().disabled).toBe(true);
      });
    });

    describe('replace all', () => {
      it('should call props.onReplaceAll when replace all button clicked', () => {
        findReplace.find('button[data-testid="Replace all"]').simulate('click');
        expect(onReplaceAllSpy).toHaveBeenCalledWith({
          replaceText: 'bilby',
        });
      });

      it('is disabled when < 1 results', () => {
        findReplace = mountComponent({
          findText: 'quokka',
          count: { index: 0, total: 0 },
        });
        const buttonEl = findReplace.find('button[data-testid="Replace all"]');
        expect(buttonEl.props().disabled).toBe(true);
      });
    });
  });
});
