/** @jsx jsx */
import { FC, ReactNode } from 'react';

import { jsx } from '@emotion/react';

import LockFilledIcon from '@atlaskit/icon/glyph/lock-filled';
import Lozenge from '@atlaskit/lozenge';
import Box from '@atlaskit/primitives/box';
import Inline from '@atlaskit/primitives/inline';

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
    <Inline alignBlock="center" testId={testId} space="100">
      {author && headingProps ? (
        <span {...headingProps}>{author}</span>
      ) : (
        author
      )}
      {type && <Lozenge testId={testId && `${testId}-type`}>{type}</Lozenge>}
      {time && !isSaving && !isError && time}
      {edited || null}
      {isSaving ? savingText : null}
      {restrictedTo && (
        <Box as="span" color="subtlest">
          <Inline alignBlock="center" space="050">
            &bull;
            <LockFilledIcon label="" size="small" />
            {restrictedTo}
          </Inline>
        </Box>
      )}
    </Inline>
  ) : null;
};

Header.displayName = 'CommentHeader';

export default Header;
