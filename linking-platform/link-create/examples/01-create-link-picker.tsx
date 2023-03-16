import React, { SyntheticEvent, useMemo, useState } from 'react';

import { IntlProvider } from 'react-intl-next';

import LoadingButton from '@atlaskit/button/loading-button';
import Button from '@atlaskit/button/standard-button';
import Form from '@atlaskit/form';
import { LinkPicker } from '@atlaskit/link-picker';
import { CardClient, SmartCardProvider } from '@atlaskit/link-provider';
import { ModalBody, ModalFooter } from '@atlaskit/modal-dialog';
import Popup from '@atlaskit/popup';
import {
  LinkPickerCreateOnSubmitHandler,
  LinkPickerCreateOnSubmitParameter,
  useLinkPickerCreate,
} from '@atlassian/link-picker-plugins';
import { mockEndpoints } from '@atlassian/recent-work-client/mocks';

import LinkCreate, { Select, TextField, useLinkCreateCallback } from '../src';
import { LinkCreateCallbackProvider } from '../src/controllers/callback-context';
import { FormProps, Option, Validator } from '../src/ui/types';
import { validateFormData } from '../src/utils';

const smartCardClient = new CardClient('staging');

mockEndpoints();

enum Fields {
  Title = 'title',
  Space = 'space',
  ParentPage = 'parent_page',
}
/** Used for demonstrating async form validation */
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const validators: Validator<Fields>[] = [
  {
    fieldName: Fields.Title,
    isInvalid: val => Promise.resolve(val.length < 5),
    errorMessage:
      '[example error] Page title is too short (less than 5 letters). Please try again.',
  },
  {
    fieldName: Fields.Title,
    isInvalid: async title => {
      await sleep(500);
      return title === 'title';
    },
    errorMessage:
      '[example error] Page already exists with that title, please use a new one.',
  },
];

const ConfluenceCreationForm = ({ validators }: FormProps<Fields>) => {
  const { onCreate, onFailure, onCancel } = useLinkCreateCallback();
  // TODO
  onFailure;

  const handleSubmit = async (data: Record<string, unknown>) => {
    const errors = await validateFormData({ data, validators });
    if (errors.title !== undefined) {
      return errors;
    }
    if (onCreate) {
      // TODO in
      // https://product-fabric.atlassian.net/browse/EDM-5666
      console.log('Form result:', { data });
      onCreate('https://www.atlassian.com');
    }
  };

  /** Example space options */
  const spaceOptions: Option[] = [
    { label: 'Personal Space', value: 'personal' },
    { label: 'Linking Platform', value: 'linking-platform' },
  ];

  return (
    <Form<Record<string, unknown>> onSubmit={handleSubmit}>
      {({ submitting, formProps }) => (
        <form {...formProps} name="confluence-creation-form">
          <ModalBody>
            <Select
              name={Fields.Space}
              title={'Space'}
              options={spaceOptions}
              defaultOption={spaceOptions.find(
                o => o.value === 'linking-platform',
              )}
            ></Select>
            <Select
              title={'Parent Page'}
              // Could could be disabled until space selected, then loaded in.
              options={[
                { label: 'Blog post A', value: 'blog-post-a' },
                { label: 'Blog post B', value: 'blog-post-b' },
              ]}
              name={Fields.ParentPage}
            ></Select>
            <TextField name={Fields.Title} label={'Title'}></TextField>
          </ModalBody>
          <ModalFooter>
            <Button appearance="subtle" onClick={onCancel}>
              Cancel
            </Button>
            <LoadingButton
              appearance="primary"
              type="submit"
              isLoading={submitting}
            >
              Next
            </LoadingButton>
          </ModalFooter>
        </form>
      )}
    </Form>
  );
};

const confluencePageLinkCreatePlugin = {
  group: {
    label: 'Confluence',
    key: 'confluence',
    icon: 'beautiful',
  },
  key: 'confluence-page',
  label: 'Page',
  icon: 'beautiful',
  form: <ConfluenceCreationForm validators={validators} />,
};

function LinkPickerCreate() {
  const [showPicker, setShowPicker] = useState(true);
  const [link, setLink] = useState<LinkPickerCreateOnSubmitParameter>({
    url: '',
    displayText: null,
    title: null,
    meta: {
      inputMethod: 'manual',
    },
  });

  const linkPickerCreateconfigs = useMemo(
    () => [
      {
        product: 'confluence',
        activityClientEndpoint:
          'https://start.stg.atlassian.com/gateway/api/graphql',
        aggregatorUrl:
          'https://pug.jira-dev.com/gateway/api/xpsearch-aggregator',
        cloudId: 'DUMMY-a5a01d21-1cc3-4f29-9565-f2bb8cd969f5',
        create: confluencePageLinkCreatePlugin,
      },
    ],
    [],
  );

  const handleToggle = () => setShowPicker(!showPicker);
  const handleClick = (e: SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowPicker(true);
  };

  const onCancel = () => setShowPicker(false);
  const onSubmit: LinkPickerCreateOnSubmitHandler = payload => {
    setLink(payload);
    setShowPicker(false);
  };

  const { createProps, pickerProps } = useLinkPickerCreate(
    onSubmit,
    onCancel,
    linkPickerCreateconfigs,
  );

  return (
    <div className="example" style={{ padding: 50 }}>
      <div style={{ paddingBottom: 20 }}>
        <a id="test-link" href={link.url} target="_blank" onClick={handleClick}>
          {link.displayText || link.url}
        </a>
      </div>
      <Popup
        isOpen={showPicker && !createProps.active}
        autoFocus={false}
        onClose={onCancel}
        content={({ update }) => (
          //....
          <LinkPicker
            {...pickerProps}
            url={link.url}
            displayText={link.displayText}
            onContentResize={update}
          />
        )}
        placement="right-start"
        trigger={props => (
          <Button
            {...props}
            testId="trigger"
            appearance="primary"
            isSelected={showPicker}
            onClick={handleToggle}
          >
            toggle
          </Button>
        )}
      />
      <LinkCreate {...createProps} />
    </div>
  );
}

export default function Create() {
  return (
    <SmartCardProvider client={smartCardClient}>
      <LinkCreateCallbackProvider>
        <IntlProvider locale="en">
          <LinkPickerCreate />
        </IntlProvider>
      </LinkCreateCallbackProvider>
    </SmartCardProvider>
  );
}
