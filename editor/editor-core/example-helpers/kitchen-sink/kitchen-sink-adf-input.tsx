/** @jsx jsx */
import React from 'react';

import { jsx } from '@emotion/react';

import Button from '@atlaskit/button/custom-theme-button';

import { inputForm, inputPadding, textareaStyle } from './kitchen-sink-styles';

export interface KitchenSinkAdfInputProps {
  value: string;
  buttonLabel?: string;
  onSubmit?(e: React.FormEvent): void;
  onChange?(e: React.ChangeEvent): void;
}

export const KitchenSinkAdfInput: React.FunctionComponent<
  KitchenSinkAdfInputProps
> = (props) => {
  return (
    <div css={inputForm}>
      <div css={inputPadding}>
        <textarea
          css={textareaStyle}
          value={props.value}
          onChange={props.onChange}
          rows={Math.min(props.value.split('\n').length, 10)}
        />
        {props.onSubmit && (
          <Button onClick={props.onSubmit} type="submit">
            {props.buttonLabel}
          </Button>
        )}
      </div>
    </div>
  );
};
