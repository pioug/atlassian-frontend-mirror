/** @jsx jsx */

import { memo } from 'react';

import { css, jsx } from '@emotion/react';

import Button from '@atlaskit/button/standard-button';
import __noop from '@atlaskit/ds-lib/noop';
import { fontSize, gridSize } from '@atlaskit/theme/constants';

import { EllipsisItemProps } from '../types';

const height = (gridSize() * 3) / fontSize();
const noop = __noop;

const gridSizeUnit = gridSize();

const itemWrapperStyles = css({
  display: 'flex',
  boxSizing: 'border-box',
  maxWidth: '100%',
  height: `${height}em`,
  margin: 0,
  padding: 0,
  flexDirection: 'row',
  lineHeight: `${height}em`,
  '&:not(:last-child)::after': {
    width: `${gridSizeUnit}px`,
    padding: `0 ${gridSizeUnit}px`,
    flexShrink: 0,
    content: '"/"',
    textAlign: 'center',
  },
});

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
