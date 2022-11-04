/** @jsx jsx */
import { FC, ReactNode } from 'react';

import { css, jsx } from '@emotion/react';

import LockFilledIcon from '@atlaskit/icon/glyph/lock-filled';
import Lozenge from '@atlaskit/lozenge';
import { N100A } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

const inlineBlockStyles = css({
  display: 'inline-block',
});

const containerStyles = css({
  display: 'flex',
  // TODO Delete this comment after verifying spacing token -> previous value `gridSize()`
  gap: token('spacing.scale.100', '8px'),
});

const restrictedContainerStyles = css({
  display: 'flex',
  alignItems: 'baseline',
  // TODO Delete this comment after verifying spacing token -> previous value ``${gridSize() / 2}px``
  gap: token('spacing.scale.050', '4px'),
  color: token('color.text.subtlest', N100A),
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
  headingLevel?: string;
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
  headingLevel,
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

  const headingProps = headingLevel && {
    role: 'heading',
    'aria-level': Number(headingLevel),
  };

  return items.length ? (
    <div data-testid={testId} css={containerStyles} {...headingProps}>
      {items}
    </div>
  ) : null;
};

export default HeaderItems;
