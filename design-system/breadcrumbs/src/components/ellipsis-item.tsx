/** @jsx jsx */

import { memo } from 'react';

import { jsx } from '@emotion/core';

import Button from '@atlaskit/button/standard-button';

import { itemWrapperStyles } from '../internal/styles';
import { EllipsisItemProps } from '../types';

const noop = () => {};

const EllipsisItem = memo((props: EllipsisItemProps) => {
  const { onClick = noop, testId, label } = props;

  return (
    <li css={itemWrapperStyles}>
      <Button
        appearance="subtle-link"
        spacing="none"
        testId={testId}
        onClick={onClick}
        aria-label={label}
      >
        &hellip;
      </Button>
    </li>
  );
});

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default EllipsisItem;
