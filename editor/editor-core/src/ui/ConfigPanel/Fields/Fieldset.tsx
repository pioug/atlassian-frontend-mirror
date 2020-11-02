import React from 'react';
import styled from 'styled-components';
import { injectIntl, InjectedIntlProps } from 'react-intl';

import SectionMessage from '@atlaskit/section-message';
import Button from '@atlaskit/button/custom-theme-button';
import Select from '@atlaskit/select';
import AddCircleIcon from '@atlaskit/icon/glyph/add-circle';

import { ExtensionManifest } from '@atlaskit/editor-common';

import {
  Fieldset,
  Parameters,
  FieldDefinition,
} from '@atlaskit/editor-common/extensions';

import { messages } from '../messages';
// eslint-disable-next-line import/no-cycle
import FormWrapper from '../NestedForms/FormWrapper';
import { OnBlur } from '../types';

type OptionType = {
  label: string;
  value: string;
};

const populateFromParameters = (
  parameters: Parameters,
  fields: FieldDefinition[],
): string[] | undefined => {
  if (Object.keys(parameters).length) {
    const keys = Object.keys(parameters);
    const existingFieldKeys = keys.filter(key =>
      fields.find(field => field.name === key),
    );

    if (existingFieldKeys.length > 0) {
      return existingFieldKeys;
    }
  }
};

const populateWithTheFirst = (
  fields: FieldDefinition[],
): string[] | undefined => {
  if (Array.isArray(fields) && fields.length > 0) {
    return [fields[0].name];
  }
};

const getInitialFields = (
  parameters: Parameters = {},
  fields: FieldDefinition[],
  isDynamic?: boolean,
): string[] => {
  if (!isDynamic) {
    return fields.map(field => field.name);
  }

  return (
    populateFromParameters(parameters, fields) ||
    populateWithTheFirst(fields) ||
    []
  );
};

type Props = {
  extensionManifest: ExtensionManifest;
  field: Fieldset;
  parameters?: Parameters;
  onFieldBlur: OnBlur;
  firstVisibleFieldName?: string;
  error?: string;
} & InjectedIntlProps;

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

    const initialFields = new Set<FieldDefinition['name']>(
      getInitialFields(
        props.parameters,
        props.field.fields,
        props.field.options.isDynamic,
      ),
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

    return [...visibleFields].map(
      fieldName =>
        field.fields.find(field => field.name === fieldName) as FieldDefinition,
    );
  };

  getSelectOptions = (visibleFields: Set<string>) => {
    const { field } = this.props;

    return field.fields
      .filter(field => !visibleFields.has(field.name))
      .map(field => ({
        value: field.name,
        label: field.label,
      }));
  };

  setIsAdding = (value: boolean) => {
    this.setState(state => ({
      ...state,
      isAdding: value,
    }));
  };

  setCurrentParameters = (parameters: Parameters) => {
    this.setState(
      state => ({
        ...state,
        currentParameters: parameters,
      }),
      // callback required so autosave can be triggered on
      // the right moment if fields are being removed
      () => this.props.onFieldBlur(this.props.field.name),
    );
  };

  setVisibleFields = (fields: Set<string>) => {
    this.setState(state => ({
      ...state,
      visibleFields: fields,
      selectedFields: this.getSelectedFields(fields),
      selectOptions: this.getSelectOptions(fields),
    }));
  };

  onSelectItem = (option: OptionType) => {
    const { visibleFields } = this.state;
    this.setVisibleFields(visibleFields.add((option as OptionType).value));
    this.setIsAdding(false);
  };

  onClickRemove = (fieldName: string) => {
    const { visibleFields, currentParameters } = this.state;

    visibleFields.delete(fieldName);
    this.setVisibleFields(new Set(visibleFields));

    delete currentParameters[fieldName];

    this.setCurrentParameters({ ...currentParameters });
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
            onChange={option => {
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
      field,
      extensionManifest,
      onFieldBlur,
      firstVisibleFieldName,
      error,
    } = this.props;

    const { selectedFields, currentParameters, visibleFields } = this.state;
    return (
      <>
        {error && <FieldsetError message={error} />}
        <FormWrapper
          canRemoveFields={field.options.isDynamic && visibleFields.size > 1}
          showTitle={field.options.showTitle}
          extensionManifest={extensionManifest}
          parentName={field.name}
          fields={selectedFields}
          label={field.label}
          parameters={currentParameters}
          onClickRemove={this.onClickRemove}
          onFieldBlur={onFieldBlur}
          firstVisibleFieldName={firstVisibleFieldName}
        >
          {this.renderActions()}
        </FormWrapper>
      </>
    );
  }
}

function FieldsetError({ message }: { message: string }) {
  return (
    <SectionMessageWrapper>
      <SectionMessage appearance="error">
        <p>{message}</p>
      </SectionMessage>
    </SectionMessageWrapper>
  );
}

const SectionMessageWrapper = styled.div`
  margin-bottom: 24px;
`;

export default injectIntl(FieldsetField);
