/** @jsx jsx */

import { jsx } from '@emotion/core';

import { itemWrapperStyles, separatorStyles } from '../internal/styles';
import { EllipsisItemProps } from '../types';

import Button from './Button';

const noop = () => {};

const EllipsisItem = (props: EllipsisItemProps) => {
  const { hasSeparator = false, onClick = noop, testId } = props;

  return (
    <div css={itemWrapperStyles}>
      <Button testId={testId} onClick={onClick}>
        &hellip;
      </Button>
      {hasSeparator ? <div css={separatorStyles}>/</div> : null}
    </div>
  );
};

export default EllipsisItem;
