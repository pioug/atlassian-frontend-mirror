import Button from '@atlaskit/button/custom-theme-button';
import Form, { HelperMessage } from '@atlaskit/form';
import ErrorIcon from '@atlaskit/icon/glyph/error';
import Tooltip from '@atlaskit/tooltip';
import { shallow } from 'enzyme';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { CommentField } from '../../../components/CommentField';
import CopyLinkButton from '../../../components/CopyLinkButton';
import { FormFooter, ShareForm } from '../../../components/ShareForm';
import { ShareHeader } from '../../../components/ShareHeader';
import { UserPickerField } from '../../../components/UserPickerField';
import { messages } from '../../../i18n';
import { ConfigResponse, DialogContentState, ShareError } from '../../../types';
import { renderProp } from '../_testUtils';

describe('ShareForm', () => {
  it.each`
    allowComment | submitButtonLabel
    ${true}      | ${undefined}
    ${false}     | ${undefined}
    ${true}      | ${'Invite'}
  `(
    'should render From with fields (allowComment $allowComment, submitButton $submitButtonLabel)',
    ({ allowComment, submitButtonLabel }) => {
      const mockLink = 'link';
      const loadOptions = jest.fn();
      const onSubmit = jest.fn();
      const config: ConfigResponse = {
        mode: 'EXISTING_USERS_ONLY',
        allowComment,
      };
      const component = shallow(
        <ShareForm
          copyLink={mockLink}
          loadOptions={loadOptions}
          onSubmit={onSubmit}
          title="some title"
          config={config}
          submitButtonLabel={submitButtonLabel}
          product="confluence"
          slackTeams={[]}
        />,
      );

      const akForm = component.find<any>(Form);
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
        config,
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
          copyLink={mockLink}
          loadOptions={loadOptions}
          isSharing
          product="confluence"
          slackTeams={[]}
        />,
      );

      const akForm = wrapper.find<any>(Form);
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
          copyLink={mockLink}
          loadOptions={loadOptions}
          shareError={mockShareError}
          isSharing
          product="confluence"
          slackTeams={[]}
        />,
      );

      const akForm = wrapper.find<any>(Form);
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
      const wrapper = shallow(
        <ShareForm
          copyLink={mockLink}
          loadOptions={loadOptions}
          isFetchingConfig
          product="confluence"
          slackTeams={[]}
        />,
      );

      const akForm = wrapper.find<any>(Form);
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
          copyLink="link"
          loadOptions={jest.fn()}
          shareError={mockShareError}
          product="confluence"
          slackTeams={[]}
        />,
      );

      const akForm = wrapper.find<any>(Form);
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
          copyLink="link"
          loadOptions={jest.fn()}
          product="confluence"
          slackTeams={[]}
          fieldsFooter={'Some message'}
        />,
      );

      const akForm = wrapper.find<any>(Form);
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
    const config: ConfigResponse = {
      mode: 'EXISTING_USERS_ONLY',
      allowComment: true,
    };
    const component = shallow(
      <ShareForm
        copyLink={mockLink}
        loadOptions={loadOptions}
        title="some title"
        defaultValue={defaultValue}
        config={config}
        product="confluence"
        slackTeams={[]}
      />,
    );
    const formProps = {};
    const akForm = component.find<any>(Form);
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
          copyLink="link"
          loadOptions={jest.fn()}
          isPublicLink={true}
          product="confluence"
          slackTeams={[]}
        />,
      );

      const akForm = wrapper.find<any>(Form);
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
          copyLink="link"
          loadOptions={jest.fn()}
          isPublicLink={true}
          isDisabled={true}
          product="confluence"
          slackTeams={[]}
        />,
      );

      const akForm = wrapper.find<any>(Form);
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
});
