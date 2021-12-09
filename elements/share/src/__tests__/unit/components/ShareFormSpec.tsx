import React from 'react';

import { shallow } from 'enzyme';
import { FormattedMessage } from 'react-intl-next';

import Button from '@atlaskit/button/custom-theme-button';
import { shallowWithIntl } from '@atlaskit/editor-test-helpers/enzyme-next';
import Form, { FormProps, HelperMessage } from '@atlaskit/form';
import ErrorIcon from '@atlaskit/icon/glyph/error';
import Tabs, { Tab, TabList } from '@atlaskit/tabs';
import Tooltip from '@atlaskit/tooltip';

import { CommentField } from '../../../components/CommentField';
import CopyLinkButton from '../../../components/CopyLinkButton';
import { FormFooter, ShareForm } from '../../../components/ShareForm';
import { ShareHeader } from '../../../components/ShareHeader';
import { UserPickerField } from '../../../components/UserPickerField';
import { messages } from '../../../i18n';
import { DialogContentState, ShareError } from '../../../types';
import { renderProp } from '../_testUtils';

const mockFormatMessage = (descriptor: any) => descriptor.defaultMessage;
const mockIntl = { formatMessage: mockFormatMessage };

const defaultProps = {
  cloudId: 'test-cloud-id',
};

jest.mock('react-intl-next', () => {
  return {
    ...(jest.requireActual('react-intl-next') as any),
    FormattedMessage: (descriptor: any) => (
      <span>{descriptor.defaultMessage}</span>
    ),
    injectIntl: (Node: any) => (props: any) => (
      <Node {...props} intl={mockIntl} />
    ),
  };
});

describe('ShareForm', () => {
  it.each`
    allowComment | submitButtonLabel
    ${true}      | ${undefined}
    ${true}      | ${'Invite'}
  `(
    'should render From with fields (allowComment $allowComment, submitButton $submitButtonLabel)',
    ({ allowComment, submitButtonLabel }) => {
      const mockLink = 'link';
      const loadOptions = jest.fn();
      const onSubmit = jest.fn();
      const component = shallow(
        <ShareForm
          {...defaultProps}
          copyLink={mockLink}
          loadOptions={loadOptions}
          onSubmit={onSubmit}
          title="some title"
          submitButtonLabel={submitButtonLabel}
          product="confluence"
        />,
      );

      const akForm = component.find<FormProps<{}>>(Form);
      expect(akForm).toHaveLength(1);
      expect(akForm.prop('onSubmit')).toBe(onSubmit);

      const formProps = {};
      const form = renderProp(akForm, 'children', { formProps })
        .dive()
        .dive()
        .find('form');
      expect(form).toHaveLength(1);
      expect(form.find(ShareHeader).prop('title')).toEqual('some title');

      const userPickerField = form.find(UserPickerField);
      expect(userPickerField).toHaveLength(1);
      expect(userPickerField.props()).toMatchObject({
        loadOptions,
      });
      expect(form.find(CommentField)).toHaveLength(allowComment ? 1 : 0);

      const footer = form.find(FormFooter);
      expect(footer).toHaveLength(1);
      const button = footer.find(Button);
      expect(button).toHaveLength(1);
      expect(button.props()).toMatchObject({
        appearance: 'primary',
        type: 'submit',
        isLoading: false,
        children: (
          <>
            {submitButtonLabel || <FormattedMessage {...messages.formSend} />}
          </>
        ),
      });
      const copyLinkButton = footer.find(CopyLinkButton).dive();
      expect(copyLinkButton.length).toBe(1);
      expect(copyLinkButton.prop('link')).toEqual(mockLink);

      const helperMessage = form.find(HelperMessage);
      expect(helperMessage).toHaveLength(0);
    },
  );

  describe('isSharing prop', () => {
    it('should set isLoading prop to true to the Send button', () => {
      const mockLink = 'link';
      const loadOptions = jest.fn();
      const wrapper = shallow(
        <ShareForm
          {...defaultProps}
          copyLink={mockLink}
          loadOptions={loadOptions}
          isSharing
          product="confluence"
        />,
      );

      const akForm = wrapper.find<FormProps<{}>>(Form);
      const form = renderProp(akForm, 'children', { formProps: {} })
        .dive()
        .dive()
        .find('form');
      const footer = form.find(FormFooter);
      expect(footer.find(Button).prop('isLoading')).toBeTruthy();
    });

    it('should set appearance prop to "primary" and isLoading prop to true to the Send button, and hide the tooltip', () => {
      const mockLink = 'link';
      const mockShareError: ShareError = { message: 'error' };
      const loadOptions = jest.fn();
      const wrapper = shallow(
        <ShareForm
          {...defaultProps}
          copyLink={mockLink}
          loadOptions={loadOptions}
          shareError={mockShareError}
          isSharing
          product="confluence"
        />,
      );

      const akForm = wrapper.find<FormProps<{}>>(Form);
      const form = renderProp(akForm, 'children', { formProps: {} })
        .dive()
        .dive()
        .find('form');
      const footer = form.find(FormFooter);
      expect(footer.find(Tooltip)).toHaveLength(0);
      expect(footer.find(Button).prop('isLoading')).toBeTruthy();
      expect(footer.find(Button).prop('appearance')).toEqual('primary');
    });
  });

  describe('isFetchingConfig prop', () => {
    it('should set isLoading prop to true to the UserPickerField', () => {
      const mockLink = 'link';
      const loadOptions = jest.fn();
      const wrapper = (shallowWithIntl as typeof shallow)(
        <ShareForm
          {...defaultProps}
          copyLink={mockLink}
          loadOptions={loadOptions}
          isFetchingConfig
          product="confluence"
        />,
      );

      const akForm = wrapper.find<FormProps<{}>>(Form);
      const form = renderProp(akForm, 'children', { formProps: {} })
        .dive()
        .dive()
        .find('form');
      const userPickerField = form.find(UserPickerField);
      expect(userPickerField.prop('isLoading')).toBeTruthy();
    });
  });

  describe('shareError prop', () => {
    it('should render Retry button with an ErrorIcon and Tooltip', () => {
      const mockShareError: ShareError = { message: 'error' };
      const wrapper = shallow(
        <ShareForm
          {...defaultProps}
          copyLink="link"
          loadOptions={jest.fn()}
          shareError={mockShareError}
          product="confluence"
        />,
      );

      const akForm = wrapper.find<FormProps<{}>>(Form);
      const form = renderProp(akForm, 'children', { formProps: {} })
        .dive()
        .dive()
        .find('form');
      const footer = form.find(FormFooter);
      const button = footer.find(Button);
      expect(button).toHaveLength(1);
      expect(button.prop('appearance')).toEqual('warning');

      const buttonLabel = button.find('strong').find(FormattedMessage);
      expect(buttonLabel).toHaveLength(1);
      expect(buttonLabel.props()).toMatchObject(messages.formRetry);

      const tooltip = form.find(Tooltip);
      expect(tooltip).toHaveLength(1);
      expect(tooltip.prop('content')).toEqual(
        <FormattedMessage {...messages.shareFailureMessage} />,
      );

      const errorIcon = tooltip.find(ErrorIcon);
      expect(errorIcon).toHaveLength(1);
    });
  });

  describe('shareFieldsFooter prop', () => {
    it('should render the shareForm with the fields footer content', () => {
      const wrapper = shallow(
        <ShareForm
          {...defaultProps}
          copyLink="link"
          loadOptions={jest.fn()}
          product="confluence"
          fieldsFooter={'Some message'}
        />,
      );

      const akForm = wrapper.find<FormProps<{}>>(Form);
      const form = renderProp(akForm, 'children', { formProps: {} })
        .dive()
        .dive()
        .find('form');
      expect(form.contains('Some message')).toBeTruthy();
    });
  });

  it('should set defaultValue', () => {
    const mockLink = 'link';
    const loadOptions = jest.fn();
    const defaultValue: DialogContentState = {
      users: [],
      comment: {
        format: 'plain_text',
        value: 'some comment',
      },
    };
    const component = shallow(
      <ShareForm
        {...defaultProps}
        copyLink={mockLink}
        loadOptions={loadOptions}
        title="some title"
        defaultValue={defaultValue}
        product="confluence"
      />,
    );
    const formProps = {};
    const akForm = component.find<FormProps<{}>>(Form);
    const form = renderProp(akForm, 'children', { formProps }).dive().dive();

    expect(form.find(UserPickerField).prop('defaultValue')).toBe(
      defaultValue.users,
    );
    expect(form.find(CommentField).prop('defaultValue')).toBe(
      defaultValue.comment,
    );
  });

  describe('isPublicLink prop', () => {
    it('should render Share button with the correct text', () => {
      const wrapper = shallow(
        <ShareForm
          {...defaultProps}
          copyLink="link"
          loadOptions={jest.fn()}
          isPublicLink={true}
          product="confluence"
        />,
      );

      const akForm = wrapper.find<FormProps<{}>>(Form);
      const form = renderProp(akForm, 'children', { formProps: {} })
        .dive()
        .dive()
        .find('form');
      const footer = form.find(FormFooter);
      const button = footer.find(Button);
      expect(button).toHaveLength(1);

      const buttonLabel = button.find(FormattedMessage);
      expect(buttonLabel).toHaveLength(1);
      expect(buttonLabel.props()).toMatchObject(messages.formSendPublic);
    });

    it('should pass value to CopyLinkButton', () => {
      const wrapper = shallow(
        <ShareForm
          {...defaultProps}
          copyLink="link"
          loadOptions={jest.fn()}
          isPublicLink={true}
          isDisabled={true}
          product="confluence"
        />,
      );

      const akForm = wrapper.find<FormProps<{}>>(Form);
      const form = renderProp(akForm, 'children', { formProps: {} })
        .dive()
        .dive()
        .find('form');

      const footer = form.find(FormFooter);
      expect(footer).toHaveLength(1);

      const copyLinkButton = footer.find(CopyLinkButton).dive();
      expect(copyLinkButton.length).toBe(1);
      expect(copyLinkButton.prop('isPublicLink')).toEqual(true);
      expect(copyLinkButton.prop('isDisabled')).toEqual(true);
    });
  });

  describe('showTitle prop', () => {
    it('should not render the share form header if showTitle is false', () => {
      const wrapper = (shallowWithIntl as typeof shallow)(
        <ShareForm
          {...defaultProps}
          title="Share"
          showTitle={false}
          copyLink="link"
          product="confluence"
        />,
      );

      const akForm = wrapper.find<FormProps<{}>>(Form);
      const form = renderProp(akForm, 'children', { formProps: {} })
        .dive()
        .dive()
        .find('form');
      const shareHeader = form.find(ShareHeader);
      expect(shareHeader).toHaveLength(0);
    });
  });

  describe('integrationMode prop', () => {
    it('should not render Tabs when integrationMode is not Tabs and shareIntegrations has content', () => {
      const wrapper = (shallowWithIntl as typeof shallow)(
        <ShareForm
          {...defaultProps}
          copyLink="link"
          product="confluence"
          integrationMode="off"
          shareIntegrations={[
            {
              type: 'Slack',
              Icon: () => <div />,
              Content: () => <div />,
            },
          ]}
        />,
      );

      const akForm = wrapper.find<FormProps<{}>>(Form);
      const form = renderProp(akForm, 'children', { formProps: {} })
        .dive()
        .dive()
        .find(Tabs);

      const tabs = form.find(Tabs);
      expect(tabs).toHaveLength(0);
    });
  });

  describe('shareIntegrations prop', () => {
    it('should not render Tabs when shareIntegrations array is empty', () => {
      const wrapper = (shallowWithIntl as typeof shallow)(
        <ShareForm
          {...defaultProps}
          copyLink="link"
          product="confluence"
          integrationMode="tabs"
          shareIntegrations={[]}
        />,
      );

      const akForm = wrapper.find<FormProps<{}>>(Form);
      const form = renderProp(akForm, 'children', { formProps: {} })
        .dive()
        .dive()
        .find(Tabs);

      const tabs = form.find(Tabs);
      expect(tabs).toHaveLength(0);
    });

    it('should render Integration Tab when shareIntegrations array is filled in', () => {
      const wrapper = (shallowWithIntl as typeof shallow)(
        <ShareForm
          {...defaultProps}
          title="Share"
          showTitle={false}
          copyLink="link"
          product="confluence"
          integrationMode="tabs"
          shareIntegrations={[
            {
              type: 'Slack',
              Icon: () => <div />,
              Content: () => <div />,
            },
          ]}
        />,
      );

      const akForm = wrapper.find<FormProps<{}>>(Form);
      const tabs = renderProp(akForm, 'children', { formProps: {} })
        .dive()
        .dive()
        .find(Tabs);

      const tabList = tabs.find(TabList);
      const childTabs = tabList.find(Tab);
      expect(childTabs).toHaveLength(2);
    });
  });
});

describe('helperMessage prop', () => {
  it('should pass helper message when the helperMessage prop is available', () => {
    const mockLink = 'link';
    const loadOptions = jest.fn();
    const onSubmit = jest.fn();
    const helperMessage = 'this is the helper message to be displayed';
    const shareForm = (shallowWithIntl as typeof shallow)(
      <ShareForm
        {...defaultProps}
        copyLink={mockLink}
        loadOptions={loadOptions}
        onSubmit={onSubmit}
        title="some title"
        product="confluence"
        helperMessage="this is the helper message to be displayed"
      />,
    );
    const akForm = shareForm.find<FormProps<{}>>(Form);
    const form = renderProp(akForm, 'children', { formProps: {} })
      .dive()
      .dive()
      .find('form');
    const userPickerField = form.find(UserPickerField);

    expect(userPickerField.props().helperMessage).toEqual(helperMessage);
  });
});
