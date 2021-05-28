import React from 'react';
import { InjectedIntlProps } from 'react-intl';
import { ReactWrapper } from 'enzyme';
import { mountWithIntl } from '@atlaskit/editor-test-helpers/enzyme';
import { mockAddEventListener } from '@atlaskit/editor-test-helpers/mock-add-event-listener';

import FindReplaceToolbarButton, {
  FindReplaceToolbarButtonProps,
} from '../../../ui/FindReplaceToolbarButton';
import FindReplace from '../../../ui/FindReplace';

describe('FindReplaceToolbarButton', () => {
  let findReplaceToolbarButton: ReactWrapper<
    FindReplaceToolbarButtonProps & InjectedIntlProps
  >;
  const mountComponent = (props: Partial<FindReplaceToolbarButtonProps> = {}) =>
    mountWithIntl<FindReplaceToolbarButtonProps & InjectedIntlProps, any>(
      <FindReplaceToolbarButton
        findText=""
        index={0}
        isActive
        numMatches={0}
        replaceText=""
        shouldFocus
        shouldMatchCase
        onToggleMatchCase={jest.fn()}
        onActivate={jest.fn()}
        onCancel={jest.fn()}
        onFind={jest.fn()}
        onFindBlur={jest.fn()}
        onFindNext={jest.fn()}
        onFindPrev={jest.fn()}
        onReplace={jest.fn()}
        onReplaceAll={jest.fn()}
        takeFullWidth={false}
        {...props}
      />,
    );

  describe('when isActive=true', () => {
    it('displays find/replace component', () => {
      findReplaceToolbarButton = mountComponent({ isActive: true });
      expect(findReplaceToolbarButton.find(FindReplace).exists()).toBe(true);
    });

    describe('and toolbar button clicked', () => {
      const onCancelSpy = jest.fn();

      afterEach(() => {
        onCancelSpy.mockClear();
      });

      it('calls props.onCancel', () => {
        findReplaceToolbarButton = mountComponent({
          isActive: true,
          onCancel: onCancelSpy,
        });
        findReplaceToolbarButton
          .find('button[aria-haspopup]')
          .simulate('click');
        expect(onCancelSpy).toHaveBeenCalled();
      });
    });

    describe('and escape key pressed down', () => {
      const onCancelSpy = jest.fn();

      afterEach(() => {
        onCancelSpy.mockClear();
      });

      it('calls props.onCancel', () => {
        const { trigger, spy } = mockAddEventListener();
        findReplaceToolbarButton = mountComponent({
          isActive: true,
          onCancel: onCancelSpy,
        });
        trigger('keydown', { code: 'Escape' });
        expect(onCancelSpy).toHaveBeenCalled();
        spy.mockRestore();
      });
    });
  });

  describe('when isActive=false', () => {
    it('hides find/replace component', () => {
      findReplaceToolbarButton = mountComponent({ isActive: false });
      expect(findReplaceToolbarButton.find(FindReplace).exists()).toBe(false);
    });

    describe('and toolbar button clicked', () => {
      const onActivateSpy = jest.fn();

      afterEach(() => {
        onActivateSpy.mockClear();
      });

      it('calls props.onActivate', () => {
        findReplaceToolbarButton = mountComponent({
          isActive: false,
          onActivate: onActivateSpy,
        });
        findReplaceToolbarButton
          .find('button[aria-haspopup]')
          .simulate('click');
        expect(onActivateSpy).toHaveBeenCalled();
      });
    });

    describe('and escape key pressed down', () => {
      const onCancelSpy = jest.fn();

      afterEach(() => {
        onCancelSpy.mockClear();
      });

      it('does not call props.onCancel', () => {
        const { trigger, spy } = mockAddEventListener();
        findReplaceToolbarButton = mountComponent({
          isActive: false,
          onCancel: onCancelSpy,
        });
        trigger('keydown', { code: 'Escape' });
        expect(onCancelSpy).not.toHaveBeenCalled();
        spy.mockRestore();
      });
    });
  });
});
