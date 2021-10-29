/** @jsx jsx */
import { FC, ReactNode } from 'react';

import { css, jsx } from '@emotion/core';

import LockFilledIcon from '@atlaskit/icon/glyph/lock-filled';
import Lozenge from '@atlaskit/lozenge';
import { N100A } from '@atlaskit/theme/colors';
import { gridSize } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

const inlineBlockStyles = css({
  display: 'inline-block',
});

const containerStyles = css({
  display: 'flex',
  gap: gridSize(),
});

const restrictedContainerStyles = css({
  display: 'flex',
  alignItems: 'baseline',
  gap: `${gridSize() / 2}px`,
  color: token('color.text.lowEmphasis', N100A),
});

interface HeaderItemsProps {
  author?: ReactNode;
  restrictedTo?: ReactNode;
  isSaving?: boolean;
  savingText?: string;
  time?: ReactNode;
  type?: string;
  testId?: string;
  edited?: ReactNode;
  isError?: boolean;
}

const RestrictedTo: FC = ({ children }) => (
  <div css={restrictedContainerStyles}>
    &bull;
    <LockFilledIcon label="" size="small" />
    {children}
  </div>
);

/**
 * __Header items__
 *
 * Comment header items.
 */
const HeaderItems: FC<HeaderItemsProps> = ({
  author,
  edited,
  isError,
  isSaving,
  restrictedTo,
  savingText,
  time,
  testId,
  type,
}) => {
  const restrictedElement = restrictedTo ? (
    <RestrictedTo>{restrictedTo}</RestrictedTo>
  ) : null;

  const items = [
    author || null,
    type ? <Lozenge testId={testId && `${testId}-type`}>{type}</Lozenge> : null,
    time && !isSaving && !isError ? time : null,
    edited || null,
    isSaving ? savingText : null,
    restrictedElement,
  ]
    .filter((item) => !!item)
    .map((item, index) => (
      <div css={inlineBlockStyles} key={index}>
        {item}
      </div>
    )); // eslint-disable-line react/no-array-index-key

  return items.length ? (
    <div data-testid={testId} css={containerStyles}>
      {items}
    </div>
  ) : null;
};

export default HeaderItems;
