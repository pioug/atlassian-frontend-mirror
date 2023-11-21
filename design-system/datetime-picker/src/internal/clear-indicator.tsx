/** @jsx jsx */
import { FC } from 'react';

import { css, jsx } from '@emotion/react';

import { ClearIndicatorProps, components } from '@atlaskit/select';

import ClearButton from './clear-button';

const buttonStyles = css({
  display: 'flex',
  alignItems: 'center',
  all: 'unset',
  outline: 'revert',
});

/**
 * __Clear indicator__
 * Overwrites the default `ClearIndicator` button with custom styles and attributes
 *
 */
const ClearIndicator: FC<ClearIndicatorProps<any>> = (props) => {
  return (
    <components.ClearIndicator
      {...{
        ...props,
        innerProps: { ...props.innerProps, 'aria-hidden': 'false' },
      }}
    >
      <ClearButton
        buttonStyles={buttonStyles}
        inputId={props.selectProps.inputId}
        dataTestId={props.selectProps.testId}
      />
    </components.ClearIndicator>
  );
};

export default ClearIndicator;
