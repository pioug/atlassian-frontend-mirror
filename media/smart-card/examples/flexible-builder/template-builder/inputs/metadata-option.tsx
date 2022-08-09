/** @jsx jsx */
import { jsx } from '@emotion/core';
import React, { useCallback, useMemo } from 'react';
import Select from '@atlaskit/select/Select';
import { ElementItem, ElementName } from '../../../../src';
import { ElementDisplaySchema } from '../../../../src/view/FlexibleCard/components/blocks/utils';
import { OptionsType, ValueType as Value } from '@atlaskit/select';
import { Field } from '@atlaskit/form';
import { ChangeParams, handleOnChange } from '../../utils';
import { BlockTemplate } from '../../types';

const options = Object.values(ElementName)
  .filter(
    (name) =>
      name !== ElementName.Title &&
      name !== ElementName.LinkIcon &&
      ElementDisplaySchema[name].includes('inline'),
  )
  .map((name) => ({ label: name, value: name }));

const MetadataOption: React.FC<{
  label?: string;
  name: string;
  onChange: (template: BlockTemplate) => void;
  propName: keyof BlockTemplate;
  template: BlockTemplate;
}> = ({ label, name, onChange, propName, template }) => {
  const handleOnMetadataChange = useCallback(
    (...params: ChangeParams<BlockTemplate>) => (
      values: OptionsType<{ label: string; value: ElementName }>,
    ) => {
      const items = values.map((option: { value: ElementName }) => ({
        name: option.value,
      }));

      handleOnChange<BlockTemplate>(...params, items);
    },
    [],
  );

  const values = useMemo(() => {
    const selectedValues = template[propName];
    if (selectedValues && selectedValues.length > 0) {
      return selectedValues.map((elementItem: ElementItem) =>
        options.find(({ value }) => value === elementItem.name),
      );
    }
  }, [propName, template]);

  return (
    <Field<Value<{ label: string; value: string }>> name={name} label={label}>
      {({ fieldProps: { id, ...rest } }) => (
        <Select
          {...rest}
          isMulti
          onChange={handleOnMetadataChange(onChange, template, propName, [])}
          options={options}
          placeholder="Add metadata"
          value={values}
        />
      )}
    </Field>
  );
};

export default MetadataOption;
