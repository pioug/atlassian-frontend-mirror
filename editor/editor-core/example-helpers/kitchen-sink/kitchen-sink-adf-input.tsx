import React from 'react';
import Button from '@atlaskit/button/custom-theme-button';
import { InputPadding, InputForm, Textarea } from './kitchen-sink-styles';

export interface KitchenSinkAdfInputProps {
  value: string;
  onSubmit?(e: React.FormEvent): void;
  onChange?(e: React.ChangeEvent): void;
}

export const KitchenSinkAdfInput: React.StatelessComponent<KitchenSinkAdfInputProps> = (
  props,
) => {
  return (
    <InputForm>
      <InputPadding>
        <Textarea
          value={props.value}
          onChange={props.onChange}
          rows={Math.min(props.value.split('\n').length, 10)}
        />
        {props.onSubmit && (
          <Button onClick={props.onSubmit} type="submit">
            Import ADF
          </Button>
        )}
      </InputPadding>
    </InputForm>
  );
};
