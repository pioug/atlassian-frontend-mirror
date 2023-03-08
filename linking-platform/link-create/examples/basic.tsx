import React, { useState } from 'react';

import LoadingButton from '@atlaskit/button/loading-button';
import Button from '@atlaskit/button/standard-button';
import Form from '@atlaskit/form';
import { ModalBody, ModalFooter } from '@atlaskit/modal-dialog';

import LinkCreate, { Select, TextField, useLinkCreateCallback } from '../src';
import { FormProps, Option, Validator } from '../src/ui/types';
import { validateFormData } from '../src/utils';

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

export default function Basic() {
  const [active, setActive] = useState(false);

  const plugins = [
    {
      group: {
        label: 'Confluence',
        key: 'confluence',
        icon: 'beautiful',
      },
      key: 'confluence-page',
      label: 'Page',
      icon: 'beautiful',
      form: <ConfluenceCreationForm validators={validators} />,
    },
  ];

  return (
    <>
      <Button appearance="primary" onClick={() => setActive(true)}>
        Show Form
      </Button>
      <LinkCreate
        testId="link-create"
        plugins={plugins}
        entityKey="confluence-page"
        onCreate={url => {
          console.log(`${url} returned!`);
          setActive(false);
        }}
        onFailure={() => {
          console.log('An error');
        }}
        onCancel={() => setActive(false)}
        active={active}
      />
    </>
  );
}
