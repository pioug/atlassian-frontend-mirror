import React from 'react';
import { InjectedIntlProps } from 'react-intl';
import { ReactWrapper } from 'enzyme';
import { mountWithIntl } from '@atlaskit/editor-test-helpers/enzyme';
import Textfield from '@atlaskit/textfield';
import FindReplace, { FindReplaceProps } from '../../../ui/FindReplace';
import Find from '../../../ui/Find';
import { Count } from '../../../ui/styles';
import Replace from '../../../ui/Replace';

describe('FindReplace', () => {
  let findReplace: ReactWrapper<FindReplaceProps & InjectedIntlProps>;
  const onFindSpy = jest.fn();
  const onFindNextSpy = jest.fn();
  const onFindPrevSpy = jest.fn();
  const onFindBlurSpy = jest.fn();
  const onCancelSpy = jest.fn();
  const onReplaceSpy = jest.fn();
  const onReplaceAllSpy = jest.fn();
  const onToggleMatchCaseSpy = jest.fn();
  const dispatchAnalyticsEventSpy = jest.fn();

  const mountComponent = (props: Partial<FindReplaceProps> = {}) =>
    mountWithIntl<FindReplaceProps & InjectedIntlProps, any>(
      <FindReplace
        findText=""
        count={{ index: 0, total: 0 }}
        replaceText=""
        shouldFocus
        allowMatchCase
        shouldMatchCase={false}
        onToggleMatchCase={onToggleMatchCaseSpy}
        onFind={onFindSpy}
        onFindNext={onFindNextSpy}
        onFindPrev={onFindPrevSpy}
        onFindBlur={onFindBlurSpy}
        onCancel={onCancelSpy}
        onReplace={onReplaceSpy}
        onReplaceAll={onReplaceAllSpy}
        dispatchAnalyticsEvent={dispatchAnalyticsEventSpy}
        {...props}
      />,
    );

  const getInput = (component: typeof Find | typeof Replace) =>
    findReplace.find(component).find(Textfield).find('input');

  const getInputNode = (component: typeof Find | typeof Replace) =>
    findReplace
      .find(component)
      .find(Textfield)
      .find('input')
      .getDOMNode() as HTMLInputElement;

  const compose = (wrapper: ReactWrapper, steps: string[]) => {
    const currentText = (wrapper.find('input').getDOMNode() as HTMLInputElement)
      .value;
    wrapper.simulate('compositionstart');

    steps.forEach((step) => {
      wrapper.simulate('compositionupdate', { data: currentText + step });
      wrapper.simulate('change', { target: { value: currentText + step } });
    });

    return () => {
      const result =
        currentText + (steps.length > 0 ? steps[steps.length - 1] : '');
      wrapper.simulate('compositionend', {
        data: result,
        target: { value: result },
      });
    };
  };

  const simulateChangeEvent = (
    component: typeof Find | typeof Replace,
    data: any,
  ) => {
    getInput(component).simulate('change', data);
  };

  const simulateKeydownEvent = (
    component: typeof Find | typeof Replace,
    data: any,
  ) => {
    getInput(component).simulate('keydown', data);
  };

  afterEach(() => {
    onFindSpy.mockClear();
    onFindNextSpy.mockClear();
    onFindPrevSpy.mockClear();
    onFindBlurSpy.mockClear();
    onCancelSpy.mockClear();
    onReplaceSpy.mockClear();
    onReplaceAllSpy.mockClear();
    dispatchAnalyticsEventSpy.mockClear();
    if (findReplace) {
      findReplace.unmount();
    }
  });

  describe('Find', () => {
    it('should display search text', () => {
      findReplace = mountComponent({
        findText: 'quokka',
      });
      expect(getInputNode(Find).value).toBe('quokka');
    });

    it('should display num results', () => {
      findReplace = mountComponent({
        findText: 'quokka',
        count: { index: 2, total: 32 },
      });
      expect(findReplace.find(Count).text()).toBe('3 of 32');
    });

    it('should display "No results" if no results', () => {
      findReplace = mountComponent({
        findText: 'quokka',
        count: { index: 0, total: 0 },
      });
      expect(findReplace.find(Count).text()).toBe('No results');
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
      const input = getInputNode(Replace);
      jest.spyOn(input, 'focus');

      simulateKeydownEvent(Find, { key: 'ArrowDown' });
      expect(input.focus).toHaveBeenCalled();
    });

    describe('when typing inside find textfield', () => {
      it('should call props.onFind', () => {
        findReplace = mountComponent();
        simulateChangeEvent(Find, { target: { value: 'quokka' } });
        expect(onFindSpy).toHaveBeenCalledWith('quokka');
      });
    });

    describe('when Match Case button clicked', () => {
      const matchCaseBtnSelector = 'button[data-testid="Match case"]';
      beforeEach(() => {
        findReplace = mountComponent({
          findText: 'rokka',
        });
      });
      afterEach(() => {
        onFindSpy.mockClear();
        onToggleMatchCaseSpy.mockClear();
      });
      it('should call props.onFind', () => {
        findReplace.find(matchCaseBtnSelector).simulate('click');
        expect(onFindSpy).toHaveBeenCalledWith('rokka');
      });
      it('should call props.onToggleMatchCase', () => {
        findReplace.find(matchCaseBtnSelector).simulate('click');
        expect(onToggleMatchCaseSpy).toHaveBeenCalledTimes(1);
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
        simulateKeydownEvent(Find, { key: 'Enter' });
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
        simulateKeydownEvent(Find, { key: 'Enter', shiftKey: true });
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

    describe('composition', () => {
      let endComposition: () => void;

      beforeEach(() => {
        findReplace = mountComponent({ count: { index: 0, total: 32 } });

        endComposition = compose(
          findReplace.find(Find).find(Textfield).find('input'),
          ['k', 'か', 'かy', 'かよ', 'かよう', 'かようb', 'かようび'],
        );
      });

      describe('find', () => {
        it('does not call props.onFind while composing', () => {
          expect(onFindSpy).not.toHaveBeenCalled();
        });

        it('calls props.onFind on composition end', () => {
          endComposition();
          expect(onFindSpy).toHaveBeenCalledWith('かようび');
        });

        it('calls props.onFind with whole word if compose in parts', () => {
          endComposition();
          findReplace.setProps({ findText: 'かようび' });
          endComposition = compose(
            findReplace.find(Find).find(Textfield).find('input'),
            [
              'g',
              'げ',
              'げt',
              'げts',
              'げつ',
              'げつy',
              'げつよ',
              'げつよう',
              'げつようb',
              'げつようび',
            ],
          );
          endComposition();
          expect(onFindSpy).toHaveBeenCalledWith('かようびげつようび');
        });
      });

      describe('find next', () => {
        it('does not call props.onFindNext when user clicks find next button while composing', () => {
          findReplace.find('button[data-testid="Find next"]').simulate('click');
          expect(onFindNextSpy).not.toHaveBeenCalled();
        });

        it('does not call props.onFindNext when user hits enter while composing', () => {
          simulateKeydownEvent(Find, { key: 'Enter' });
          expect(onFindNextSpy).not.toHaveBeenCalled();
        });
      });

      describe('find previous', () => {
        it('does not call props.onFindPrev when user clicks find prev button while composing', () => {
          findReplace
            .find('button[data-testid="Find previous"]')
            .simulate('click');
          expect(onFindPrevSpy).not.toHaveBeenCalled();
        });

        it('does not call props.onFindPrev when user hits shift + enter while composing', () => {
          simulateKeydownEvent(Find, { key: 'Enter', shiftKey: true });
          expect(onFindNextSpy).not.toHaveBeenCalled();
        });
      });

      describe('arrow down', () => {
        it('does not focus replace textfield while composing', () => {
          const input = getInputNode(Find);
          jest.spyOn(input, 'focus');

          simulateKeydownEvent(Find, { key: 'ArrowDown' });
          expect(input.focus).not.toHaveBeenCalled();
        });
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
      expect(getInputNode(Replace).value).toBe('bilby');
    });

    it('should fire analytics event when typing in replace field', () => {
      simulateChangeEvent(Replace, { target: { value: 'c' } });
      expect(dispatchAnalyticsEventSpy).toHaveBeenCalledWith({
        eventType: 'track',
        action: 'changedReplacementText',
        actionSubject: 'findReplaceDialog',
      });
    });

    it('should set focus to find textfield when arrow up', () => {
      const input = getInputNode(Find);
      jest.spyOn(input, 'focus');

      simulateKeydownEvent(Replace, { key: 'ArrowUp' });
      expect(input.focus).toHaveBeenCalled();
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
        simulateKeydownEvent(Replace, { key: 'Enter' });
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

    describe('composition', () => {
      let endComposition: () => void;

      beforeEach(() => {
        findReplace = mountComponent({
          findText: 'すいようび',
          replaceText: '',
          count: { index: 0, total: 32 },
        });
        endComposition = compose(
          findReplace.find(Replace).find(Textfield).find('input'),
          ['k', 'か', 'かy', 'かよ', 'かよう', 'かようb', 'かようび'],
        );
      });

      describe('replace', () => {
        it('does not fire analytics while composing in replace textfield', () => {
          expect(dispatchAnalyticsEventSpy).not.toHaveBeenCalled();
        });

        it('fires analytics after composition end', () => {
          endComposition();
          expect(dispatchAnalyticsEventSpy).toHaveBeenCalledWith({
            eventType: 'track',
            action: 'changedReplacementText',
            actionSubject: 'findReplaceDialog',
          });
        });

        describe('when click replace button', () => {
          it('does not call props.onReplace while composing', () => {
            findReplace.find('button[data-testid="Replace"]').simulate('click');
            expect(onReplaceSpy).not.toHaveBeenCalled();
          });

          it('calls props.onReplace after composition end', () => {
            endComposition();
            findReplace.find('button[data-testid="Replace"]').simulate('click');
            expect(onReplaceSpy).toHaveBeenCalledWith({
              replaceText: 'かようび',
              triggerMethod: 'button',
            });
          });

          it('calls props.onReplace with whole word if compose in parts', () => {
            endComposition();
            findReplace.setProps({ replaceText: 'かようび' });
            endComposition = compose(
              findReplace.find(Replace).find(Textfield).find('input'),
              [
                'g',
                'げ',
                'げt',
                'げts',
                'げつ',
                'げつy',
                'げつよ',
                'げつよう',
                'げつようb',
                'げつようび',
              ],
            );
            endComposition();
            findReplace.find('button[data-testid="Replace"]').simulate('click');
            expect(onReplaceSpy).toHaveBeenCalledWith({
              replaceText: 'かようびげつようび',
              triggerMethod: 'button',
            });
          });
        });

        describe('when hit enter key inside replace textfield', () => {
          it('does not call props.onReplace when hit enter inside replace textfield while composing', () => {
            simulateKeydownEvent(Replace, { key: 'Enter' });
            expect(onReplaceSpy).not.toHaveBeenCalled();
          });

          it('calls props.onReplace when hit enter inside replace textfield after composition end', () => {
            endComposition();
            simulateKeydownEvent(Replace, { key: 'Enter' });
            expect(onReplaceSpy).toHaveBeenCalledWith({
              replaceText: 'かようび',
              triggerMethod: 'keyboard',
            });
          });

          it('calls props.onReplace with whole word if compose in parts', () => {
            endComposition();
            findReplace.setProps({ replaceText: 'かようび' });
            endComposition = compose(
              findReplace.find(Replace).find(Textfield).find('input'),
              [
                'g',
                'げ',
                'げt',
                'げts',
                'げつ',
                'げつy',
                'げつよ',
                'げつよう',
                'げつようb',
                'げつようび',
              ],
            );
            endComposition();
            simulateKeydownEvent(Replace, { key: 'Enter' });
            expect(onReplaceSpy).toHaveBeenCalledWith({
              replaceText: 'かようびげつようび',
              triggerMethod: 'keyboard',
            });
          });
        });
      });

      describe('replace all', () => {
        it('does not call props.onReplaceAll while composing', () => {
          findReplace
            .find('button[data-testid="Replace all"]')
            .simulate('click');
          expect(onReplaceAllSpy).not.toHaveBeenCalled();
        });

        it('calls props.onReplaceAll after composition end', () => {
          endComposition();
          findReplace
            .find('button[data-testid="Replace all"]')
            .simulate('click');
          expect(onReplaceAllSpy).toHaveBeenCalledWith({
            replaceText: 'かようび',
          });
        });
      });

      describe('arrow up', () => {
        it('does not focus find textfield while composing', () => {
          const input = getInputNode(Find);
          jest.spyOn(input, 'focus');

          simulateKeydownEvent(Replace, { key: 'ArrowUp' });
          expect(input.focus).not.toHaveBeenCalled();
        });
      });
    });
  });
});
