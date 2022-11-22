/** @jsx jsx */
import { FC, ReactNode } from 'react';

import { jsx } from '@emotion/react';

import { UNSAFE_Inline as Inline } from '@atlaskit/ds-explorations';
import LockFilledIcon from '@atlaskit/icon/glyph/lock-filled';
import Lozenge from '@atlaskit/lozenge';
import { N100A } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

interface HeaderProps {
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

/**
 * __Header items__
 *
 * Comment header items.
 *
 * @internal
 */
const Header: FC<HeaderProps> = ({
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
  const headingProps = headingLevel && {
    role: 'heading',
    'aria-level': Number(headingLevel),
  };

  const shouldRender =
    author ||
    time ||
    restrictedTo ||
    (isSaving && savingText) ||
    edited ||
    type;
  return shouldRender ? (
    <Inline alignItems="center" testId={testId} gap="scale.100">
      {author && headingProps ? (
        // eslint-disable-next-line @repo/internal/react/use-primitives
        <span {...headingProps}>{author}</span>
      ) : (
        author
      )}
      {type && <Lozenge testId={testId && `${testId}-type`}>{type}</Lozenge>}
      {time && !isSaving && !isError && time}
      {edited || null}
      {isSaving ? savingText : null}
      {restrictedTo && (
        <Inline
          alignItems="center"
          gap="scale.050"
          UNSAFE_style={{ color: token('color.text.subtlest', N100A) }}
        >
          &bull;
          <LockFilledIcon label="" size="small" />
          {restrictedTo}
        </Inline>
      )}
    </Inline>
  ) : null;
};

Header.displayName = 'CommentHeader';

export default Header;
