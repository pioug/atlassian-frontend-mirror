import React from 'react';

import { ExtensionManifest } from '@atlaskit/editor-common';

import {
  FieldDefinition,
  EnumField,
  StringField,
  NumberField,
  BooleanField,
  DateField,
  Fieldset as FieldsetType,
  isFieldset,
  Parameters,
} from '@atlaskit/editor-common/extensions';

import Boolean from './Fields/Boolean';
import CheckboxGroup from './Fields/CheckboxGroup';
import CustomSelect from './Fields/CustomSelect';
import Date from './Fields/Date';
// eslint-disable-next-line import/no-cycle
import Fieldset from './Fields/Fieldset';
import RadioGroup from './Fields/RadioGroup';
import Select from './Fields/Select';
import Text from './Fields/Text';
import UnhandledType from './Fields/UnhandledType';

import RemovableField from './NestedForms/RemovableField';

const pickUsedParameters = (
  parameters: Parameters = {},
  fields: FieldDefinition[],
) => {
  return fields.reduce<Parameters>((curr, next) => {
    if (typeof parameters[next.name] !== 'undefined') {
      curr[next.name] = parameters[next.name];
    }

    return curr;
  }, {});
};

type Props = {
  extensionManifest: ExtensionManifest;
  fields: FieldDefinition[];
  parameters?: Parameters;
  canRemoveFields?: boolean;
  onClickRemove?: (fieldName: string) => void;
};

class FormContent extends React.Component<Props> {
  renderEnumField(field: EnumField) {
    switch (field.style) {
      case 'checkbox':
        return <CheckboxGroup key={field.name} field={field} />;

      case 'radio':
        return <RadioGroup key={field.name} field={field} />;

      case 'select':
      default:
        return <Select key={field.name} field={field} />;
    }
  }

  renderUnhandledField(field: FieldDefinition) {
    return (
      <UnhandledType
        key={field.name}
        field={field}
        errorMessage={`Field "${field.name}" of type "${field.type}" not supported`}
      />
    );
  }

  renderField(field: FieldDefinition) {
    const { parameters, extensionManifest } = this.props;

    if (!isFieldset(field)) {
      field.defaultValue =
        (parameters && parameters[field.name]) || field.defaultValue;
    }

    switch (field.type) {
      case 'string':
        return (
          <Text key={field.name} field={field as StringField} type="text" />
        );

      case 'number':
        return (
          <Text key={field.name} field={field as NumberField} type="number" />
        );

      case 'boolean':
        return <Boolean key={field.name} field={field as BooleanField} />;

      case 'date':
        return <Date key={field.name} field={field as DateField} />;

      case 'enum':
        return this.renderEnumField(field as EnumField);

      case 'custom':
        return (
          <CustomSelect
            key={field.name}
            field={field}
            extensionManifest={extensionManifest}
          />
        );

      case 'fieldset':
        return (
          <Fieldset
            key={field.name}
            field={field as FieldsetType}
            extensionManifest={extensionManifest}
            parameters={pickUsedParameters(parameters, field.fields)}
          />
        );

      default:
        return this.renderUnhandledField(field);
    }
  }

  renderRemovableField(field: FieldDefinition) {
    const { onClickRemove } = this.props;

    if (!onClickRemove) {
      return this.renderField(field);
    }

    return (
      <RemovableField
        key={field.name}
        name={field.name}
        onClickRemove={() => onClickRemove!(field.name)}
      >
        {this.renderField(field)}
      </RemovableField>
    );
  }

  render() {
    const { fields, canRemoveFields } = this.props;

    return fields.map(field =>
      canRemoveFields
        ? this.renderRemovableField(field)
        : this.renderField(field),
    );
  }
}

export default FormContent;
