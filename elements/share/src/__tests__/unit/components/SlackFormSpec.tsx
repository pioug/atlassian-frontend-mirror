import Button from '@atlaskit/button/custom-theme-button';
import Form, { FormFooter, Field } from '@atlaskit/form';
import ErrorIcon from '@atlaskit/icon/glyph/error';
import Tooltip from '@atlaskit/tooltip';
import AsyncSelect from '@atlaskit/select';
import { shallow } from 'enzyme';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { CommentField } from '../../../components/CommentField';
import { SlackForm } from '../../../components/SlackForm';
import SlackButton from '../../../components/SlackButton';
import { defaultSlackContentState } from '../../../components/ShareDialogWithTrigger';
import { messages } from '../../../i18n';
import { ConfigResponse, ShareError, ProductName } from '../../../types';
import { renderProp } from '../_testUtils';

describe('SlackForm', () => {
  const mockFetchSlackConversations: jest.Mock = jest.fn();
  const defaultSlackProps = {
    product: 'confluence' as ProductName,
    slackTeams: [],
    isFetchingSlackConversations: false,
    isFetchingSlackTeams: false,
    slackConversations: [],
    fetchSlackConversations: mockFetchSlackConversations,
  };

  it.each`
    allowComment | submitButtonLabel
    ${true}      | ${undefined}
    ${false}     | ${undefined}
    ${true}      | ${'Invite'}
  `(
    'should render From with fields (allowComment $allowComment, submitButton $submitButtonLabel)',
    ({ allowComment, submitButtonLabel }) => {
      const loadOptions = jest.fn();
      const onSubmit = jest.fn();
      const config: ConfigResponse = {
        mode: 'EXISTING_USERS_ONLY',
        allowComment,
      };
      const component = shallow(
        <SlackForm
          loadOptions={loadOptions}
          onSubmit={onSubmit}
          config={config}
          {...defaultSlackProps}
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

      const fieldProps = {};
      const meta = { valid: true };
      const formFields = form.find(Field);
      expect(formFields).toHaveLength(2);
      formFields.forEach(fieldElement => {
        const asyncSelectField = renderProp(fieldElement, 'children', {
          fieldProps,
          meta,
        }).find(AsyncSelect);

        expect(asyncSelectField).toHaveLength(1);
      });

      expect(form.find(CommentField)).toHaveLength(allowComment ? 1 : 0);

      const footer = form.find(FormFooter);
      expect(footer).toHaveLength(1);
      const button = footer.find(SlackButton);
      expect(button).toHaveLength(1);
    },
  );

  describe('isSharing prop', () => {
    it('should set isLoading prop to true to the Send button', () => {
      const loadOptions = jest.fn();
      const wrapper = shallow(
        <SlackForm
          loadOptions={loadOptions}
          isSharing
          {...defaultSlackProps}
        />,
      );

      const akForm = wrapper.find<any>(Form);
      const form = renderProp(akForm, 'children', { formProps: {} })
        .dive()
        .dive()
        .find('form');
      const footer = form.find(FormFooter);
      expect(footer.find(SlackButton).prop('isLoading')).toBeTruthy();
    });
  });

  describe('shareError prop', () => {
    it('should render Retry button with an ErrorIcon and Tooltip', () => {
      const mockShareError: ShareError = { message: 'error' };
      const wrapper = shallow(
        <SlackForm
          loadOptions={jest.fn()}
          shareError={mockShareError}
          {...defaultSlackProps}
        />,
      );

      const akForm = wrapper.find<any>(Form);
      const form = renderProp(akForm, 'children', { formProps: {} })
        .dive()
        .dive()
        .find('form');
      const footer = form.find(FormFooter);
      const button = footer.find(SlackButton);
      expect(button).toHaveLength(1);
      expect(button.prop('appearance')).toEqual('warning');
      expect(button.prop('text')).toEqual(
        <FormattedMessage {...messages.formRetry} />,
      );

      const tooltip = form.find(Tooltip);
      expect(tooltip).toHaveLength(1);
      expect(tooltip.prop('content')).toEqual(
        <FormattedMessage {...messages.shareFailureMessage} />,
      );

      const errorIcon = tooltip.find(ErrorIcon);
      expect(errorIcon).toHaveLength(1);
    });
  });

  it('should set defaultValue', () => {
    const loadOptions = jest.fn();
    const config: ConfigResponse = {
      mode: 'EXISTING_USERS_ONLY',
      allowComment: true,
    };
    const component = shallow(
      <SlackForm
        loadOptions={loadOptions}
        defaultValue={defaultSlackContentState}
        config={config}
        {...defaultSlackProps}
      />,
    );
    const formProps = {};
    const akForm = component.find<any>(Form);
    const form = renderProp(akForm, 'children', { formProps }).dive().dive();

    expect(form.find(CommentField).prop('defaultValue')).toBe(
      defaultSlackContentState.comment,
    );
  });

  describe('Back button', () => {
    it('should call toggleSlackToShare prop if Back button is clicked', () => {
      const loadOptions = jest.fn();
      const mockToggleShareToSlack = jest.fn();

      const wrapper = shallow(
        <SlackForm
          loadOptions={loadOptions}
          isSharing
          toggleShareToSlack={mockToggleShareToSlack}
          {...defaultSlackProps}
        />,
      );

      const akForm = wrapper.find<any>(Form);
      const form = renderProp(akForm, 'children', { formProps: {} })
        .dive()
        .dive();

      const backButton = form.find(Button);

      backButton.simulate('click');

      expect(mockToggleShareToSlack).toHaveBeenCalledTimes(1);
    });
  });

  describe('isFetchingConfig prop', () => {
    it('should set isLoading prop to true to the all Select fields', () => {
      const loadOptions = jest.fn();
      const wrapper = shallow(
        <SlackForm
          loadOptions={loadOptions}
          isFetchingConfig
          {...defaultSlackProps}
        />,
      );

      const akForm = wrapper.find<any>(Form);
      const form = renderProp(akForm, 'children', { formProps: {} })
        .dive()
        .dive()
        .find('form');

      const fieldProps = {};
      const meta = { valid: true };
      const formFields = form.find(Field);

      formFields.forEach(fieldElement => {
        const asyncSelectField = renderProp(fieldElement, 'children', {
          fieldProps,
          meta,
        }).find(AsyncSelect);

        expect(asyncSelectField.prop('isLoading')).toBeTruthy();
      });
    });
  });
  describe('isFetchingSlackTeams prop', () => {
    it('should set isLoading prop to true to the Workspace selector', () => {
      const loadOptions = jest.fn();
      const wrapper = shallow(
        <SlackForm
          {...defaultSlackProps}
          loadOptions={loadOptions}
          isFetchingSlackTeams={true}
        />,
      );

      const akForm = wrapper.find<any>(Form);
      const form = renderProp(akForm, 'children', { formProps: {} })
        .dive()
        .dive()
        .find('form');

      const fieldProps = {};
      const meta = { valid: true };
      const formFields = form.find(Field);
      expect(formFields.length).toEqual(2);

      const workspaceSelector = renderProp(formFields.at(0), 'children', {
        fieldProps,
        meta,
      }).find(AsyncSelect);

      expect(workspaceSelector.prop('isLoading')).toBeTruthy();
    });
  });
});
