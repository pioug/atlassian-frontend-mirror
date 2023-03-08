/** @jsx jsx */
import { Fragment } from 'react';

import { jsx } from '@emotion/react';
import { SingleValue } from 'react-select';

import { ErrorMessage, Field, HelperMessage } from '@atlaskit/form';
import Modal, {
  ModalHeader,
  ModalTitle,
  ModalTransition,
} from '@atlaskit/modal-dialog';
import AkSelect from '@atlaskit/select';
import AkTextfield from '@atlaskit/textfield';

import { LinkCreateCallbackProvider } from '../controllers/callback-context';

import { LinkCreateProps, Option, SelectProps, TextFieldProps } from './types';

export default function LinkCreate({
  plugins,
  testId,
  groupKey,
  entityKey,
  onCreate,
  onFailure,
  onCancel,
  active,
}: LinkCreateProps) {
  const chosenOne = plugins.find(plugin => plugin.key === entityKey);

  if (!chosenOne) {
    throw new Error('Make sure you specified a valid entityKey');
  }

  return (
    <ModalTransition>
      {!!active && (
        <Modal onClose={onCancel} testId={testId}>
          <ModalHeader>
            <ModalTitle>Create New</ModalTitle>
          </ModalHeader>
          <LinkCreateCallbackProvider
            onCreate={onCreate}
            onFailure={onFailure}
            onCancel={onCancel}
          >
            {chosenOne.form}
          </LinkCreateCallbackProvider>
        </Modal>
      )}
    </ModalTransition>
  );
}

export function Select({
  name,
  title,
  options,
  defaultOption,
  placeholder,
}: SelectProps) {
  return (
    <Field<SingleValue<Option>, HTMLSelectElement>
      name={name}
      label={title}
      isRequired
    >
      {({ fieldProps, error }) => (
        <Fragment>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <AkSelect
            {...fieldProps}
            inputId={`${title}-input-id`}
            options={options}
            placeholder={placeholder}
            defaultValue={defaultOption}
          />
        </Fragment>
      )}
    </Field>
  );
}

/**
 * A text field utilising the Atlaskit Textfield and Field objects from `@atlaskit/form`.
 * Validation is handled by the form as it is on form submission. Any errors returned by
 * the handleSubmit function passed to the form <Form> that have a key matching the `name`
 * of this text field are shown above the field.
 */
export function TextField({ label, name, validationHelpText }: TextFieldProps) {
  return (
    <Field name={name} label={label} isRequired>
      {({ fieldProps, error }) => (
        <Fragment>
          <AkTextfield {...fieldProps} />
          {!error && <HelperMessage>{validationHelpText}</HelperMessage>}
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </Fragment>
      )}
    </Field>
  );
}
