import React, { Fragment, useCallback, useMemo, useState } from 'react';

import { IntlProvider } from 'react-intl-next';

import Button from '@atlaskit/button/standard-button';
import { token } from '@atlaskit/tokens';

import LinkCreateModal, {
  AsyncSelect,
  CreateForm,
  TextField,
  useLinkCreateCallback,
  Validator,
} from '../src';
import type { CreatePayload, LinkCreatePlugin } from '../src/common/types';

const ENTITY_KEY = 'object-name';

function MockPluginForm() {
  const { onCreate, onFailure, onCancel } = useLinkCreateCallback();

  type MockOptions = {
    label: string;
    value: string;
  };

  type MockedFormData = {
    textFieldName?: string | undefined;
    asyncSelectName?: MockOptions | null;
  };

  const mockHandleSubmit = async () => {
    if (onCreate) {
      await onCreate({
        url: 'https://atlassian.com/product/new-object-id',
        objectId: 'new-object-id',
        objectType: 'object-type',
        data: {},
        ari: 'example-ari',
      });
    }
  };

  const mockValidator: Validator = useMemo(
    () => ({
      isValid: (val: unknown) => !!val,
      errorMessage: 'Validation Error: You need to provide a value.',
    }),
    [],
  );

  const initialValues: MockedFormData = {
    asyncSelectName: null,
  };

  const mockLoadOptions = useCallback(async () => {
    const exampleOptions = [
      { label: 'Option 1', value: 'option-1' },
      { label: 'Option 2', value: 'option-2' },
    ];

    try {
      return exampleOptions;
    } catch (error) {
      if (error instanceof Error) {
        onFailure && onFailure(error);
      }
      return [];
    }
  }, [onFailure]);

  return (
    <div>
      This is a mocked plugin.
      <CreateForm<MockedFormData>
        initialValues={initialValues}
        onSubmit={mockHandleSubmit}
        onCancel={onCancel}
      >
        <TextField
          name={'textFieldName'}
          label={'Enter some Text'}
          placeholder={'Type something here...'}
          validators={[mockValidator]}
          autoFocus
          maxLength={255}
        />
        <AsyncSelect<MockOptions>
          isRequired
          isSearchable
          name={'asyncSelectName'}
          label={'Select an Option'}
          validators={[mockValidator]}
          defaultOptions={true}
          loadOptions={mockLoadOptions}
        />
      </CreateForm>
    </div>
  );
}

function CreateBasic() {
  const [link, setLink] = useState<string | null>();
  const [ari, setAri] = useState<string | null>();
  const [active, setActive] = useState(false);

  const mockPlugin = (): LinkCreatePlugin => {
    return {
      group: {
        label: 'test',
        icon: 'test-icon',
        key: 'mock-plugin',
      },
      label: 'label',
      icon: 'icon',
      key: ENTITY_KEY,
      form: <MockPluginForm />,
      editView: ({ payload, onClose }) => {
        return (
          <Fragment>
            <pre>{JSON.stringify(payload, null, 2)}</pre>
            <button onClick={onClose}>Close</button>
          </Fragment>
        );
      },
    };
  };

  const plugins = [mockPlugin()];

  const handleCreate = useCallback(async (payload: CreatePayload) => {
    await new Promise<void>(resolve => {
      setTimeout(() => resolve(), 2000);
    });
    console.log('handleCreate payload is:', payload);
    setLink(payload.url);
    setAri(payload.ari);
  }, []);

  const handleOnComplete = useCallback(() => {
    setActive(false);
  }, []);

  const handleFailure = useCallback(() => {
    console.log('An error');
  }, []);

  const handleCancel = useCallback(() => {
    setActive(false);
  }, []);

  const handleCloseComplete = useCallback(() => {
    console.log('Modal closed');
  }, []);

  const handleOpenComplete = useCallback(() => {
    console.log('Modal opened');
  }, []);

  return (
    <div style={{ padding: token('space.250', '20px') }}>
      {ari && (
        <div style={{ marginBottom: token('space.400', '2rem') }}>
          <p>ARI: {ari}</p>
        </div>
      )}

      {link && (
        <div style={{ marginBottom: token('space.200', '1rem') }}>
          <a href={link} target="_blank" rel="noopener noreferrer nofollow">
            {link}
          </a>
        </div>
      )}

      <Button
        testId="link-create-show"
        appearance="primary"
        onClick={() => setActive(true)}
      >
        Create
      </Button>
      <LinkCreateModal
        active={active}
        plugins={plugins}
        testId="link-create"
        triggeredFrom="example"
        entityKey={ENTITY_KEY}
        onCreate={handleCreate}
        onFailure={handleFailure}
        onCancel={handleCancel}
        onOpenComplete={handleOpenComplete}
        onCloseComplete={handleCloseComplete}
        onComplete={handleOnComplete}
      />
    </div>
  );
}

export default function Create() {
  return (
    <IntlProvider locale="en">
      <CreateBasic />
    </IntlProvider>
  );
}
