import React, { useCallback, useMemo, useState } from 'react';

import { IntlProvider } from 'react-intl-next';

import Button from '@atlaskit/button/standard-button';
import { OptionsType } from '@atlaskit/select';

import LinkCreate, {
  AsyncSelect,
  CreateForm,
  TextField,
  useLinkCreateCallback,
  Validator,
} from '../src';
import { CreatePayload } from '../src/common/types';

const ENTITY_KEY = 'object-name';

function MockPluginForm() {
  const { onCreate, onFailure, onCancel } = useLinkCreateCallback();

  type MockOptions = {
    label: string;
    value: string;
  };

  const mockHandleSubmit = async (data: FormData) => {
    // @ts-ignore .get is undefined at runtime
    if (data['asyncSelect-name']?.value === 'option-3') {
      onFailure && onFailure(Error('Intentional failure'));
      return;
    }

    if (onCreate) {
      await onCreate({
        url: 'https://atlassian.com/product/new-object-id',
        objectId: 'new-object-id',
        objectType: 'object-type',
        data: {},
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

  const exampleOptions: OptionsType<MockOptions> = [
    { label: 'Option 1', value: 'option-1' },
    { label: 'Option 2', value: 'option-2' },
    { label: 'Option 3 (which will fail)', value: 'option-3' },
  ];

  const mockLoadOptions = async () => {
    try {
      return exampleOptions;
    } catch (error) {
      if (error instanceof Error) {
        onFailure && onFailure(error);
      }
      return [];
    }
  };

  return (
    <div>
      This is a mocked plugin.
      <CreateForm<FormData> onSubmit={mockHandleSubmit} onCancel={onCancel}>
        <TextField
          name={'textField-name'}
          label={'Enter some Text'}
          placeholder={'Type something here...'}
          validators={[mockValidator]}
          autoFocus
          maxLength={255}
        />
        <AsyncSelect<MockOptions>
          isRequired
          isSearchable
          name={'asyncSelect-name'}
          label={'Select an Option'}
          validators={[mockValidator]}
          defaultOptions={true}
          defaultOption={mockLoadOptions}
          loadOptions={mockLoadOptions}
        ></AsyncSelect>
      </CreateForm>
    </div>
  );
}
function CreateBasic() {
  const [link, setLink] = useState<string | null>();
  const [active, setActive] = useState(false);

  const mockPlugin = () => {
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
    };
  };

  const plugins = [mockPlugin()];

  const handleCreate = useCallback(async (payload: CreatePayload) => {
    await new Promise<void>(resolve => {
      setTimeout(() => resolve(), 2000);
    });
    setLink(payload.url);
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
    <div style={{ padding: '20px' }}>
      {link && (
        <div style={{ marginBottom: '1rem' }}>
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
      <LinkCreate
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
