import React, { useMemo } from 'react';
import { BlockTemplate } from '../../types';
import SelectOption from './select-option';

const MaxLinesOption: React.FC<{
  defaultValue: number;
  label?: string;
  name: string;
  onChange: (template: BlockTemplate) => void;
  propName: string;
  max: number;
  template: BlockTemplate;
}> = (props) => {
  const { defaultValue, max } = props;
  const options = useMemo(
    () =>
      Array.from({ length: max }).reduce(
        (acc: { label: string; value: number }[], _, idx: number) => {
          const value = idx + 1;
          const isDefault = value === defaultValue;
          return [
            ...acc,
            { label: `${value}${isDefault ? ' (default)' : ''}`, value },
          ];
        },
        [],
      ),
    [defaultValue, max],
  );

  return <SelectOption options={options} {...props} />;
};

export default MaxLinesOption;
