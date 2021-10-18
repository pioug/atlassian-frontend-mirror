import {
  mountWithIntl,
  shallowWithIntl,
} from '@atlaskit/editor-test-helpers/enzyme';
import ShareIcon from '@atlaskit/icon/glyph/share';
import WorldIcon from '@atlaskit/icon/glyph/world';
import Popup from '@atlaskit/popup';
import Aktooltip from '@atlaskit/tooltip';
import { shallow, ShallowWrapper, ReactWrapper } from 'enzyme';
// AFP-2532 TODO: Fix automatic suppressions below
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { layers } from '@atlaskit/theme';
import React from 'react';
import { FormattedMessage, InjectedIntlProps, injectIntl } from 'react-intl';
import ShareButton, {
  Props as ShareButtonProps,
} from '../../../components/ShareButton';
import {
  defaultShareContentState,
  Props,
  ShareDialogWithTriggerInternal,
  State,
} from '../../../components/ShareDialogWithTrigger';
import { ShareData, ShareForm } from '../../../components/ShareForm';

import { messages } from '../../../i18n';
import {
  DialogPlacement,
  OBJECT_SHARED,
  RenderCustomTriggerButton,
  TooltipPosition,
} from '../../../types';
import { Omit, PropsOf } from '../_testUtils';
import mockPopper from '../_mockPopper';
import SplitButton from '../../../components/SplitButton';

jest.mock('../../../components/localStorageUtils.ts', () => {
  return {
    getIsOnboardingDismissed: jest.fn(() => {
      return 'no';
    }),
    setIsOnboardingDismissed: jest.fn(),
  };
});
mockPopper();

describe('ShareDialogWithTrigger', () => {
  let mockCreateAnalyticsEvent: jest.Mock;
  let mockOnShareSubmit: jest.Mock = jest.fn();
  const mockLoadOptions = () => [];
  const mockShowFlags: jest.Mock = jest.fn();
  const mockOnDialogOpen: jest.Mock = jest.fn();
  const mockOnDialogClose: jest.Mock = jest.fn();
  const mockOnTriggerButtonClick: jest.Mock = jest.fn();

  function getWrapper(
    overrides: Partial<
      Omit<PropsOf<ShareDialogWithTriggerInternal>, 'intl'>
    > = {},
  ): ShallowWrapper<Props & InjectedIntlProps> {
    let props: Omit<PropsOf<ShareDialogWithTriggerInternal>, 'intl'> = {
      copyLink: 'copyLink',
      loadUserOptions: mockLoadOptions,
      onTriggerButtonClick: mockOnTriggerButtonClick,
      onDialogOpen: mockOnDialogOpen,
      onDialogClose: mockOnDialogClose,
      onShareSubmit: mockOnShareSubmit,
      shareContentType: 'page',
      showFlags: mockShowFlags,
      createAnalyticsEvent: mockCreateAnalyticsEvent,
      product: 'confluence',
      ...overrides,
    };

    const WithIntl = injectIntl(ShareDialogWithTriggerInternal);

    return shallowWithIntl<Props>(<WithIntl {...props} />);
  }

  function getMountWrapper(
    overrides: Partial<
      Omit<PropsOf<ShareDialogWithTriggerInternal>, 'intl'>
    > = {},
  ): ReactWrapper<Props & InjectedIntlProps, State, any> {
    let props: Omit<PropsOf<ShareDialogWithTriggerInternal>, 'intl'> = {
      copyLink: 'copyLink',
      loadUserOptions: mockLoadOptions,
      onTriggerButtonClick: mockOnTriggerButtonClick,
      onDialogOpen: mockOnDialogOpen,
      onDialogClose: mockOnDialogClose,
      onShareSubmit: mockOnShareSubmit,
      shareContentType: 'page',
      showFlags: mockShowFlags,
      createAnalyticsEvent: mockCreateAnalyticsEvent,
      product: 'confluence',
      ...overrides,
    };

    const WithIntl = injectIntl(ShareDialogWithTriggerInternal);

    return mountWithIntl<Props, State>(<WithIntl {...props} />);
  }

  beforeEach(() => {
    // @ts-ignore This violated type definition upgrade of @types/jest to v24.0.18 & ts-jest v24.1.0.
    //See BUILDTOOLS-210-clean: https://bitbucket.org/atlassian/atlaskit-mk-2/pull-requests/7178/buildtools-210-clean/diff
    mockCreateAnalyticsEvent = jest.fn<{}>().mockReturnValue({
      fire: jest.fn(),
    });
    mockOnShareSubmit.mockReset();
    mockShowFlags.mockReset();
    mockOnDialogOpen.mockReset();
    mockOnDialogClose.mockReset();
    mockOnTriggerButtonClick.mockReset();
  });

  describe('default', () => {
    it('should render', () => {
      const wrapper = getMountWrapper();
      expect(wrapper.find(Popup).length).toBe(1);
      expect(wrapper.find(Popup).prop('isOpen')).toBe(false);
      expect(wrapper.find(ShareForm).length).toBe(0);
      expect(wrapper.find(ShareButton).length).toBe(1);
    });
  });

  describe('onTriggerButtonClick prop', () => {
    it('passed function should be called when share button is clicked', () => {
      const wrapper = getMountWrapper();
      wrapper.find(ShareButton).simulate('click');
      expect(mockOnTriggerButtonClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('isDialogOpen state', () => {
    it('should be false by default', () => {
      const wrapper = getMountWrapper();
      expect((wrapper.state() as State).isDialogOpen).toBe(false);
    });

    it('should be passed into isOpen prop Popup and isSelected props in ShareButton', () => {
      const wrapper = getMountWrapper();
      let { isDialogOpen }: Partial<State> = wrapper.state();
      expect(isDialogOpen).toEqual(false);
      expect(wrapper.find(Popup).prop('isOpen')).toEqual(isDialogOpen);
      expect(wrapper.find(ShareButton).prop('isSelected')).toEqual(
        isDialogOpen,
      );

      (wrapper as any).setState({ isDialogOpen: !isDialogOpen });

      expect(wrapper.find(Popup).prop('isOpen')).toEqual(!isDialogOpen);
      expect(wrapper.find(ShareButton).prop('isSelected')).toEqual(
        !isDialogOpen,
      );
    });

    it('should be toggled if clicked on ShareButton', () => {
      const wrapper = getMountWrapper();
      expect((wrapper.state() as State).isDialogOpen).toEqual(false);
      wrapper.find(ShareButton).simulate('click');
      expect((wrapper.state() as State).isDialogOpen).toEqual(true);
      wrapper.find(ShareButton).simulate('click');
      expect((wrapper.state() as State).isDialogOpen).toEqual(false);
    });
  });

  describe('triggerButtonAppearance prop', () => {
    it('should pass to the value into ShareButton as appearance, and have a default value of "subtle"', () => {
      const wrapper = getMountWrapper();
      expect(wrapper.find(Popup).find(ShareButton).prop('appearance')).toEqual(
        'subtle',
      );

      const mockAppearance = 'primary';
      wrapper.setProps({ triggerButtonAppearance: mockAppearance });
      expect(wrapper.find(Popup).find(ShareButton).prop('appearance')).toEqual(
        mockAppearance,
      );
    });
  });

  describe('triggerButtonStyle prop', () => {
    it('should render only ShareIcon without text in the share button if the value is "icon-only"', () => {
      const wrapper = getMountWrapper({
        triggerButtonStyle: 'icon-only',
      });
      wrapper.setState({ isDialogOpen: true });
      expect(wrapper.find(Popup).find(ShareButton).prop('text')).toBeNull();
      const iconBefore = wrapper
        .find(Popup)
        .find(ShareButton)
        .prop('iconBefore');
      expect(iconBefore.type).toBe(ShareIcon);
      expect(iconBefore.props['label']).toBe('Share icon');
    });

    it('should render text in the share button if the value is "icon-with-text"', () => {
      const wrapper = getMountWrapper({
        triggerButtonStyle: 'icon-with-text',
      });
      wrapper.setState({ isDialogOpen: true });

      const text = wrapper.find(Popup).find(ShareButton).prop('text');
      expect(text.type).toBe(FormattedMessage);
      expect(text.props).toMatchObject(messages.shareTriggerButtonText);

      const iconBefore = wrapper
        .find(Popup)
        .find(ShareButton)
        .prop('iconBefore');
      expect(iconBefore.type).toBe(ShareIcon);
      expect(iconBefore.props['label']).toBe('Share icon');
    });

    it('should render only text without ShareIcon in the share button if the value is "text-only"', () => {
      const wrapper = getMountWrapper({
        triggerButtonStyle: 'text-only',
      });
      wrapper.setState({ isDialogOpen: true });

      const text = wrapper.find(Popup).find(ShareButton).prop('text');
      expect(text.type).toBe(FormattedMessage);
      expect(text.props).toMatchObject(messages.shareTriggerButtonText);

      expect(
        wrapper.find(Popup).find(ShareButton).prop('iconBefore'),
      ).toBeUndefined();
    });
  });

  describe('triggerButtonIcon prop', () => {
    it('should override the default icon when a new icon is passed', () => {
      const wrapper = getMountWrapper({
        triggerButtonIcon: WorldIcon,
      });
      wrapper.setState({ isDialogOpen: true });

      const iconBefore = wrapper
        .find(Popup)
        .find(ShareButton)
        .prop('iconBefore');
      expect(iconBefore.type).toBe(WorldIcon);
      expect(iconBefore.props['label']).toBe('Share icon');
    });

    it('should show the default icon when no icon is passed', () => {
      const wrapper = getMountWrapper();
      wrapper.setState({ isDialogOpen: true });

      const iconBefore = wrapper
        .find(Popup)
        .find(ShareButton)
        .prop('iconBefore');
      expect(iconBefore.type).toBe(ShareIcon);
      expect(iconBefore.props['label']).toBe('Share icon');
    });
  });

  describe('dialogPlacement prop', () => {
    it('should be passed into Popup component as placement prop', () => {
      const defaultPlacement: string = 'bottom-end';
      const wrapper = getMountWrapper();
      expect(wrapper.find(Popup).prop('placement')).toEqual(defaultPlacement);
      const newPlacement: DialogPlacement = 'bottom-start';
      wrapper.setProps({ dialogPlacement: newPlacement });
      expect(wrapper.find(Popup).prop('placement')).toEqual(newPlacement);
    });
  });

  describe('dialogZIndex prop', () => {
    it('should be passed into Popup component as zIndex element prop', () => {
      const zIndex = layers.modal();
      const wrapper = getWrapper();
      expect(wrapper.find(Popup).prop('zIndex')).toEqual(zIndex);
      const newZIndex: number = 500;
      wrapper.setProps({ dialogZIndex: newZIndex });
      expect(wrapper.find(Popup).prop('zIndex')).toEqual(newZIndex);
    });
  });

  describe('isDisabled prop', () => {
    it('should be passed into ShareButton', () => {
      let isDisabled: boolean = false;
      const wrapper = getMountWrapper({
        isDisabled,
      });
      let shareButtonProps: ShareButtonProps = wrapper
        .find(ShareButton)
        .props();
      expect(shareButtonProps.isDisabled).toEqual(isDisabled);

      wrapper.setProps({ isDisabled: !isDisabled });

      shareButtonProps = wrapper.find(ShareButton).props();
      expect(shareButtonProps.isDisabled).toEqual(!isDisabled);
    });
  });

  describe('renderCustomTriggerButton prop', () => {
    it('should render a ShareButton if children prop is not given', () => {
      const wrapper = getMountWrapper();
      expect(wrapper.find(ShareButton).length).toBe(1);
    });

    it('should call renderCustomTriggerButton prop if it is given', () => {
      const mockRenderCustomTriggerButton: jest.Mock = jest.fn(() => (
        <button />
      ));
      const wrapper = getMountWrapper({
        renderCustomTriggerButton: mockRenderCustomTriggerButton,
        shareFormTitle: 'Share this page',
      });
      expect(mockRenderCustomTriggerButton).toHaveBeenCalledTimes(1);
      expect(mockRenderCustomTriggerButton).toHaveBeenCalledWith(
        {
          error: (wrapper.state() as State).shareError,
          isSelected: (wrapper.state() as State).isDialogOpen,
          onClick: (wrapper.instance() as any).onTriggerClick,
        },
        {
          'aria-controls': undefined,
          'aria-expanded': false,
          'aria-haspopup': true,
          ref: expect.any(Function),
        },
      );
      expect(wrapper.find('button').length).toBe(1);
      expect(wrapper.find(ShareButton).length).toBe(0);
    });
  });

  describe('shareFormTitle prop', () => {
    it('should be passed to the ShareForm', () => {
      const wrapper = getMountWrapper({
        shareFormTitle: 'Share this page',
      });
      wrapper.setState({ isDialogOpen: true });

      const popupContent = shallow(wrapper.find(Popup).prop('content')());

      const ShareFormProps = popupContent.find(ShareForm).props();
      expect(ShareFormProps.title).toEqual('Share this page');
    });
  });

  describe('contentPermissions prop', () => {
    it('should be passed to the ShareForm', () => {
      const wrapper = getWrapper({
        contentPermissions: 'Anyone can join',
      });
      wrapper.setState({ isDialogOpen: true });

      const popupContent = shallow(wrapper.find(Popup).prop('content')());
      const ShareFormProps = popupContent.find(ShareForm).props();
      expect(ShareFormProps.contentPermissions).toEqual('Anyone can join');
    });
  });

  describe('isAutoOpenDialog prop', () => {
    it('should open dialog if isAutoOpenDialog is true', () => {
      const wrapper = getWrapper({
        isAutoOpenDialog: true,
      });

      expect((wrapper.state() as State).isDialogOpen).toEqual(true);
      expect(mockOnDialogOpen).toHaveBeenCalledTimes(1);
    });
  });

  describe('customFooter prop', () => {
    it('should render', () => {
      const wrapper = getWrapper({
        customFooter: 'Some message',
      });
      wrapper.setState({ isDialogOpen: true });
      const popupContent = shallow(wrapper.find(Popup).prop('content')());
      expect(popupContent.contains('Some message')).toBeTruthy();
    });
  });

  describe('SplitButton props and functions', () => {
    it('should render when shareIntegrations and shareIntegrationsHandler are passed', () => {
      const wrapper = getMountWrapper({
        shareIntegrations: [
          { type: 'Slack', Icon: () => <div />, Content: () => <div /> },
        ],
      });
      expect(wrapper.find(SplitButton)).toHaveLength(1);
    });
    it('should not render when shareIntegrations is an empty array', () => {
      const wrapper = getMountWrapper({
        shareIntegrations: [],
      });
      expect(wrapper.find(SplitButton)).toHaveLength(0);
    });
  });

  describe('handleOpenDialog', () => {
    it('should set the isDialogOpen state to true', () => {
      const wrapper = getMountWrapper();
      expect((wrapper.state() as State).isDialogOpen).toEqual(false);
      wrapper.find(ShareButton).simulate('click');
      expect((wrapper.state() as State).isDialogOpen).toEqual(true);
    });

    it('should call the onDialogOpen prop if present', () => {
      const wrapper = getMountWrapper();
      expect((wrapper.state() as State).isDialogOpen).toEqual(false);
      expect(mockOnDialogOpen).not.toHaveBeenCalled();

      wrapper.find(ShareButton).simulate('click');
      expect((wrapper.state() as State).isDialogOpen).toEqual(true);
      expect(mockOnDialogOpen).toHaveBeenCalledTimes(1);
    });

    it('should send an analytic event', () => {
      const wrapper = getMountWrapper();
      expect(mockCreateAnalyticsEvent).not.toHaveBeenCalled();

      wrapper.find(ShareButton).simulate('click');
      expect(mockCreateAnalyticsEvent).toHaveBeenCalledTimes(2);
      // Share button clicked event
      expect(mockCreateAnalyticsEvent.mock.calls[0][0]).toMatchObject({
        eventType: 'ui',
        action: 'clicked',
        actionSubject: 'button',
        actionSubjectId: 'share',
        attributes: {
          packageName: expect.any(String),
          packageVersion: expect.any(String),
        },
      });
      // Share modal screen event
      expect(mockCreateAnalyticsEvent.mock.calls[1][0]).toMatchObject({
        eventType: 'screen',
        name: 'shareModal',
        attributes: {
          packageName: expect.any(String),
          packageVersion: expect.any(String),
        },
      });
    });
  });

  describe('handleCloseDialog', () => {
    it('should set the isDialogOpen state to false', () => {
      const wrapper = getWrapper();
      wrapper.setState({ isDialogOpen: true });
      expect((wrapper.state() as State).isDialogOpen).toEqual(true);
      wrapper
        .find(Popup)
        .simulate('close', { isOpen: false, event: { type: 'submit' } });
      expect((wrapper.state() as State).isDialogOpen).toEqual(false);
      expect(mockOnDialogClose).toHaveBeenCalledTimes(1);
    });

    it('should be triggered when the Popup is closed', () => {
      const wrapper = getWrapper();
      const mockClickEvent: Partial<Event> = {
        target: document.createElement('div'),
        type: 'click',
      };
      wrapper.setState({ isDialogOpen: true });
      expect((wrapper.state() as State).isDialogOpen).toEqual(true);
      wrapper
        .find(Popup)
        .simulate('close', { isOpen: false, event: mockClickEvent });
      expect((wrapper.state() as State).isDialogOpen).toEqual(false);
      expect(mockOnDialogClose).toHaveBeenCalledTimes(1);
    });

    it('should call the onDialogClose prop if present', () => {
      const wrapper = getWrapper();
      wrapper.setState({ isDialogOpen: true });
      expect(mockOnDialogClose).not.toHaveBeenCalled();
      wrapper
        .find(Popup)
        .simulate('close', { isOpen: false, event: { type: 'submit' } });
      expect((wrapper.state() as State).isDialogOpen).toEqual(false);
      expect(mockOnDialogClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('handleKeyDown', () => {
    const mockTarget = document.createElement('div');

    function getWrapperWithRef() {
      const wrapper = getWrapper();
      (wrapper.instance() as any).containerRef = { current: mockTarget };
      wrapper.instance().forceUpdate();
      return wrapper;
    }

    it('should preventDefault if shouldCloseOnEscapePress is false, and dialog should stay open', () => {
      const wrapper = getWrapperWithRef();
      wrapper.setProps({ shouldCloseOnEscapePress: false });
      const escapeKeyDownEvent: Partial<KeyboardEvent> = {
        target: document.createElement('div'),
        type: 'keydown',
        key: 'Escape',
        stopPropagation: jest.fn(),
        preventDefault: jest.fn(),
        defaultPrevented: false,
      };
      const mockShareData: ShareData = {
        users: [
          { type: 'user', id: 'id', name: 'name' },
          { type: 'email', id: 'email', name: 'email' },
        ],
        comment: {
          format: 'plain_text',
          value: 'comment',
        },
      };
      wrapper.setState({
        isDialogOpen: true,
        ignoreIntermediateState: false,
        defaultValue: mockShareData,
        shareError: new Error('unable to share'),
      });
      wrapper
        .dive()
        .find('div')
        .first()
        .simulate('keydown', escapeKeyDownEvent);
      expect(escapeKeyDownEvent.preventDefault).toHaveBeenCalledTimes(1);
      expect((wrapper.state() as State).isDialogOpen).toBeTruthy();
      expect((wrapper.state() as State).ignoreIntermediateState).toBeFalsy();
      expect((wrapper.state() as State).shareError).toBeInstanceOf(Error);
    });

    it('should not preventDefault if shouldCloseOnEscapePress is true, and dialog should close', () => {
      const wrapper = getWrapperWithRef();
      wrapper.setProps({ shouldCloseOnEscapePress: true });
      const escapeKeyDownEvent: Partial<KeyboardEvent> = {
        target: document.createElement('div'),
        type: 'keydown',
        key: 'Escape',
        stopPropagation: jest.fn(),
        preventDefault: jest.fn(),
        defaultPrevented: true,
      };
      const mockShareData: ShareData = {
        users: [
          { type: 'user', id: 'id', name: 'name' },
          { type: 'email', id: 'email', name: 'email' },
        ],
        comment: {
          format: 'plain_text',
          value: 'comment',
        },
      };
      const state = {
        isDialogOpen: true,
        ignoreIntermediateState: false,
        defaultValue: mockShareData,
        shareError: new Error('unable to share'),
      };

      wrapper.setState(state);
      wrapper
        .dive()
        .find('div')
        .first()
        .simulate('keydown', escapeKeyDownEvent);
      expect(escapeKeyDownEvent.preventDefault).toHaveBeenCalledTimes(0);
      expect((wrapper.state() as State).ignoreIntermediateState).toBeTruthy();
      expect((wrapper.state() as State).shareError).toBeUndefined();
      expect((wrapper.state() as State).isDialogOpen).toBeFalsy();
    });

    it('should clear the state if an escape key is pressed down on the container regardless of the event.preventDefault value', () => {
      const wrapper = getWrapperWithRef();
      wrapper.setProps({ shouldCloseOnEscapePress: true });
      const escapeKeyDownEvent: Partial<KeyboardEvent> = {
        target: mockTarget,
        type: 'keydown',
        key: 'Escape',
        preventDefault: jest.fn(),
        defaultPrevented: true,
      };
      const mockShareData: ShareData = {
        users: [
          { type: 'user', id: 'id', name: 'name' },
          { type: 'email', id: 'email', name: 'email' },
        ],
        comment: {
          format: 'plain_text',
          value: 'comment',
        },
      };
      wrapper.setState({
        isDialogOpen: true,
        ignoreIntermediateState: false,
        defaultValue: mockShareData,
        shareError: new Error('unable to share'),
      });
      wrapper
        .dive()
        .find('div')
        .first()
        .simulate('keydown', escapeKeyDownEvent);
      // @atlaskit/popup will catch the ESC, and close the window, we only
      // .preventDefault() when we don't want to close the popup on ESC
      expect(escapeKeyDownEvent.preventDefault).toHaveBeenCalledTimes(0);
      expect((wrapper.state() as State).isDialogOpen).toBeFalsy();
      expect(mockOnDialogClose).toHaveBeenCalledTimes(1);
      expect((wrapper.state() as State).ignoreIntermediateState).toBeTruthy();
      expect((wrapper.state() as State).defaultValue).toEqual(
        defaultShareContentState,
      );
      expect((wrapper.state() as State).shareError).toBeUndefined();
    });
  });

  describe('handleShareSubmit', () => {
    it('should call onSubmit props with an object of users and comment as an argument', () => {
      // @ts-ignore This violated type definition upgrade of @types/jest to v24.0.18 & ts-jest v24.1.0.
      //See BUILDTOOLS-210-clean: https://bitbucket.org/atlassian/atlaskit-mk-2/pull-requests/7178/buildtools-210-clean/diff
      const mockOnSubmit = jest.fn<{}>().mockResolvedValue({});
      const values: ShareData = {
        users: [
          { type: 'user', id: 'id', name: 'name' },
          { type: 'email', id: 'email', name: 'email' },
        ],
        comment: {
          format: 'plain_text',
          value: 'comment',
        },
      };
      const mockState: Partial<State> = {
        isDialogOpen: true,
        isSharing: false,
        ignoreIntermediateState: false,
        defaultValue: defaultShareContentState,
      };
      const wrapper = getMountWrapper({
        onShareSubmit: mockOnSubmit,
      });
      // @ts-ignore - `isDialogOpen` - the given error 'boolean | undefined' is not assignable to type 'boolean',
      // whilst we're setting it to boolean above.
      wrapper.setState(mockState);

      const popupContent = shallow(wrapper.find(Popup).prop('content')());
      popupContent.find(ShareForm).simulate('submit', values);
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
      expect(mockOnSubmit).toHaveBeenCalledWith(values);
    });

    it('should close inline dialog and reset the state and call props.showFlags when onSubmit resolves a value', async () => {
      // @ts-ignore This violated type definition upgrade of @types/jest to v24.0.18 & ts-jest v24.1.0.
      //See BUILDTOOLS-210-clean: https://bitbucket.org/atlassian/atlaskit-mk-2/pull-requests/7178/buildtools-210-clean/diff
      const mockOnSubmit = jest.fn<{}>().mockResolvedValue({});
      const values: ShareData = {
        users: [
          { type: 'user', id: 'id', name: 'name' },
          { type: 'email', id: 'email@atlassian.com', name: 'email' },
        ],
        comment: {
          format: 'plain_text',
          value: 'comment',
        },
      };
      const mockState: Partial<State> = {
        isDialogOpen: true,
        isSharing: false,
        ignoreIntermediateState: false,
        defaultValue: values,
        shareError: { message: 'unable to share' },
      };
      const wrapper = getWrapper({
        onShareSubmit: mockOnSubmit,
      });
      wrapper.setState(mockState);

      mockShowFlags.mockReset();

      const popupContent = shallow(wrapper.find(Popup).prop('content')());
      popupContent.find(ShareForm).simulate('submit', values);
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
      expect(mockOnSubmit).toHaveBeenCalledWith(values);

      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(mockOnDialogClose).toHaveBeenCalledTimes(1);
      expect(wrapper.state('isDialogOpen')).toBeFalsy();
      expect(wrapper.state('defaultValue')).toEqual(defaultShareContentState);
      expect(wrapper.state('ignoreIntermediateState')).toBeTruthy();
      expect(wrapper.state('isDialogOpen')).toBeFalsy();
      expect(wrapper.state('isSharing')).toBeFalsy();
      expect(wrapper.state('shareError')).toBeUndefined();
      expect(mockShowFlags).toHaveBeenCalledTimes(1);
      expect(mockShowFlags).toHaveBeenCalledWith([
        {
          appearance: 'success',
          title: expect.objectContaining({
            ...messages.shareSuccessMessage,
            defaultMessage: expect.any(String),
          }),
          type: OBJECT_SHARED,
        },
      ]);
    });
  });

  describe('Aktooltip', () => {
    it('should be rendered if the props.triggerButtonStyle is `icon-only`', () => {
      const wrapper = getMountWrapper({
        triggerButtonStyle: 'icon-only',
      });
      expect(wrapper.find(Aktooltip)).toHaveLength(1);
      expect(wrapper.find(Aktooltip).find(ShareButton)).toHaveLength(1);

      wrapper.setProps({ triggerButtonStyle: 'icon-with-text' });
      expect(wrapper.find(Aktooltip)).toHaveLength(0);
      expect(wrapper.find(ShareButton)).toHaveLength(1);

      wrapper.setProps({ triggerButtonStyle: 'text-only' });
      expect(wrapper.find(Aktooltip)).toHaveLength(0);
      expect(wrapper.find(ShareButton)).toHaveLength(1);

      const MockCustomButton = () => <button />;
      const renderCustomTriggerButton: RenderCustomTriggerButton = ({
        onClick = () => {},
      }) => <MockCustomButton />;

      wrapper.setProps({
        triggerButtonStyle: 'icon-only',
        renderCustomTriggerButton,
      });

      expect(wrapper.find(Aktooltip)).toHaveLength(1);
      expect(wrapper.find(Aktooltip).find(MockCustomButton)).toHaveLength(1);
    });

    it('should digest props.triggerButtonTooltipText as content and props.triggerButtonTooltipPosition as position', () => {
      const wrapper = getMountWrapper({
        triggerButtonStyle: 'icon-only',
      });
      expect((wrapper.find(Aktooltip).props() as any).content).toEqual('Share');
      expect((wrapper.find(Aktooltip).props() as any).position).toEqual('top');

      const customTooltipText = 'Custom Share';
      const customTooltipPosition: TooltipPosition = 'mouse';

      wrapper.setProps({
        triggerButtonTooltipText: customTooltipText,
        triggerButtonTooltipPosition: customTooltipPosition,
      });

      expect((wrapper.find(Aktooltip).props() as any).content).toEqual(
        'Custom Share',
      );
      expect((wrapper.find(Aktooltip).props() as any).position).toEqual(
        'mouse',
      );
    });
  });

  describe('bottomMessage', () => {
    it('should display the bottom message', () => {
      const wrapper = getWrapper({
        bottomMessage: 'Some message',
      });
      wrapper.setState({ isDialogOpen: true });
      const popupContent = shallow(wrapper.find(Popup).prop('content')());
      expect(popupContent.contains('Some message')).toBeTruthy();
    });
  });
});
