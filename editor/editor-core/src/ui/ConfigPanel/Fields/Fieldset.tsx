/** @jsx jsx */
import React, { Fragment } from 'react';
import { css, jsx } from '@emotion/react';
import { injectIntl, WrappedComponentProps } from 'react-intl-next';

import SectionMessage from '@atlaskit/section-message';
import Button from '@atlaskit/button/custom-theme-button';
import Select from '@atlaskit/select';
import AddCircleIcon from '@atlaskit/icon/glyph/add-circle';

import type { ExtensionManifest } from '@atlaskit/editor-common/extensions';

import {
  Fieldset,
  Parameters,
  FieldDefinition,
} from '@atlaskit/editor-common/extensions';

import { messages } from '../messages';
import { FormContentProps, OnFieldChange } from '../types';
import { getNameFromDuplicateField, isDuplicateField } from '../utils';

type OptionType = {
  label: string;
  value: string;
};

import { N40A } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

const actionsWrapper = css`
  border-top: 1px solid ${token('color.border', N40A)};
  margin-top: ${token('space.200', '16px')};
  padding-top: ${token('space.200', '16px')};
`;

const populateFromParameters = (
  parameters: Parameters,
  fields: FieldDefinition[],
): string[] | undefined => {
  if (Object.keys(parameters).length) {
    const keys = Object.keys(parameters);
    const existingFieldKeys = keys.filter((key) =>
      fields.find((field) => field.name === getNameFromDuplicateField(key)),
    );

    if (existingFieldKeys.length > 0) {
      return existingFieldKeys;
    }
  }
};
const populateFromRequired = (
  fields: FieldDefinition[],
): string[] | undefined => {
  return fields.filter((field) => field.isRequired).map((field) => field.name);
};

const getInitialFields = (
  parameters: Parameters = {},
  fields: FieldDefinition[],
  isDynamic?: boolean,
): Set<string> => {
  if (!isDynamic) {
    return new Set(fields.map((field) => field.name));
  }
  const dynamicFields: string[] = [];

  const fromRequired = populateFromRequired(fields);
  if (fromRequired) {
    dynamicFields.push(...fromRequired);
  }

  const fromParameters = populateFromParameters(parameters, fields);
  if (fromParameters) {
    dynamicFields.push(...fromParameters);
  }

  if (
    dynamicFields.length === 0 &&
    Array.isArray(fields) &&
    fields.length > 0
  ) {
    dynamicFields.push(fields[0].name);
  }

  return new Set(dynamicFields);
};

type Props = {
  name: string;
  extensionManifest: ExtensionManifest;
  field: Fieldset;
  parameters?: Parameters;
  onFieldChange: OnFieldChange;
  firstVisibleFieldName?: string;
  error?: string;
  formComponent: (props: FormContentProps) => JSX.Element;
} & WrappedComponentProps;

type State = {
  isAdding: boolean;
  visibleFields: Set<string>;
  currentParameters: Parameters;
  selectedFields: FieldDefinition[];
  selectOptions: OptionType[];
};

class FieldsetField extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const initialFields = getInitialFields(
      props.parameters,
      props.field.fields,
      props.field.options.isDynamic,
    );

    this.state = {
      isAdding: false,
      currentParameters: props.parameters || {},
      visibleFields: initialFields,
      selectedFields: this.getSelectedFields(initialFields),
      selectOptions: this.getSelectOptions(initialFields),
    };
  }

  getSelectedFields = (visibleFields: Set<string>) => {
    const { field } = this.props;

    return [...visibleFields].map((fieldName) => {
      const originalFieldDef = field.fields.find(
        (field) => field.name === getNameFromDuplicateField(fieldName),
      ) as FieldDefinition;
      const fieldDef = {
        ...originalFieldDef,
        name: fieldName,
      };
      // for duplicate fields we only want the first one to actually be required
      if (originalFieldDef.name !== fieldName && fieldDef.isRequired === true) {
        fieldDef.isRequired = false;
      }
      return fieldDef;
    });
  };

  getSelectOptions = (visibleFields: Set<string>) => {
    const { field } = this.props;

    return field.fields
      .filter(
        (field: FieldDefinition) =>
          field.allowDuplicates || !visibleFields.has(field.name),
      )
      .map((field: FieldDefinition) => ({
        value: field.name,
        label: field.label,
      }));
  };

  setIsAdding = (value: boolean) => {
    this.setState((state) => ({
      ...state,
      isAdding: value,
    }));
  };

  setCurrentParameters = (parameters: Parameters) => {
    this.setState(
      (state) => ({
        ...state,
        currentParameters: parameters,
      }),
      // callback required so autosave can be triggered on
      // the right moment if fields are being removed
      () => this.props.onFieldChange(this.props.field.name, true),
    );
  };

  setVisibleFields = (fields: Set<string>) => {
    this.setState((state) => ({
      ...state,
      visibleFields: fields,
      selectedFields: this.getSelectedFields(fields),
      selectOptions: this.getSelectOptions(fields),
    }));
  };

  onSelectItem = (option: OptionType) => {
    const { visibleFields } = this.state;

    let newItem = option.value;
    const duplicates = [...visibleFields].filter(
      (field) => getNameFromDuplicateField(field) === newItem,
    );
    if (duplicates.length > 0) {
      newItem += `:${duplicates.length}`;
    }

    this.setVisibleFields(new Set([...visibleFields, newItem]));
    this.setIsAdding(false);
  };

  onClickRemove = (fieldName: string) => {
    const { visibleFields, currentParameters } = this.state;

    visibleFields.delete(fieldName);
    this.setVisibleFields(new Set(visibleFields));

    const newParameters = { ...currentParameters };
    delete newParameters[fieldName];
    // if any there are duplicate fields that come after the one removed, we want to reduce their
    // duplicate index eg. label:2 -> label:1
    if (isDuplicateField(fieldName)) {
      const [key, idx] = fieldName.split(':');
      let currentIdx = +idx;
      while (currentParameters[`${key}:${currentIdx + 1}`]) {
        newParameters[`${key}:${currentIdx}`] =
          currentParameters[`${key}:${currentIdx + 1}`];
        currentIdx++;
      }
      delete newParameters[`${key}:${currentIdx}`];
    }
    this.setCurrentParameters(newParameters);
  };

  renderActions = () => {
    const { intl } = this.props;

    const { selectOptions, isAdding } = this.state;

    if (selectOptions.length === 0) {
      return null;
    }

    return (
      <React.Fragment>
        {isAdding ? (
          <Select
            testId="field-picker"
            defaultMenuIsOpen
            autoFocus
            placeholder={intl.formatMessage(messages.addField)}
            options={selectOptions}
            onChange={(option) => {
              if (option) {
                this.onSelectItem(option as OptionType);
              }
            }}
          />
        ) : (
          <Button
            testId="add-more"
            appearance="subtle"
            iconBefore={
              <AddCircleIcon
                size="small"
                label={intl.formatMessage(messages.addField)}
              />
            }
            onClick={() => this.setIsAdding(true)}
          >
            {intl.formatMessage(messages.addField)}
          </Button>
        )}
      </React.Fragment>
    );
  };

  render() {
    const {
      name,
      field,
      extensionManifest,
      onFieldChange,
      firstVisibleFieldName,
      error,
      formComponent: FormComponent,
    } = this.props;

    const { label, options } = field;
    const { selectedFields, currentParameters, visibleFields } = this.state;
    const children = this.renderActions();

    return (
      <Fragment>
        {error && <FieldsetError message={error} />}
        <div>
          {options.showTitle && <h5>{label}</h5>}

          <FormComponent
            fields={selectedFields}
            parentName={name}
            extensionManifest={extensionManifest}
            parameters={currentParameters}
            canRemoveFields={field.options.isDynamic && visibleFields.size > 1}
            onClickRemove={this.onClickRemove}
            onFieldChange={onFieldChange}
            firstVisibleFieldName={firstVisibleFieldName}
          />

          {children && (
            <div css={actionsWrapper} data-testId="fieldset-actions">
              {children}
            </div>
          )}
        </div>
      </Fragment>
    );
  }
}

function FieldsetError({ message }: { message: string }) {
  return (
    <div css={sectionMessageWrapper}>
      <SectionMessage appearance="error">
        <p>{message}</p>
      </SectionMessage>
    </div>
  );
}

const sectionMessageWrapper = css`
  margin-bottom: 24px;
`;

export default injectIntl(FieldsetField);
