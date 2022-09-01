/** @jsx jsx */
import type { FC, ReactNode } from 'react';

import { css, jsx } from '@emotion/react';

import WarningIcon from '@atlaskit/icon/glyph/warning';
import { N500, Y500 } from '@atlaskit/theme/colors';
import { gridSize } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

import { actionsPadding } from './constants';

interface FooterItemsProps {
  actions?: Array<ReactNode>;
  errorActions?: Array<ReactNode>;
  errorIconLabel?: string;
  isError?: boolean;
  isSaving?: boolean;
  testId?: string;
}

const actionItemStyles = css({
  display: 'flex',
  color: token('color.text.subtle', N500),

  // eslint-disable-next-line @repo/internal/styles/no-nested-styles
  '& + &::before': {
    display: 'inline-block',
    width: `${actionsPadding}px`,
    color: token('color.text.subtle', N500),
    content: '"·"',
    textAlign: 'center',
    verticalAlign: 'middle',
  },
});

const paddingRightStyles = css({
  paddingRight: 8,
});

const actionsContainerStyles = css({
  display: 'flex',
  marginTop: (3 * gridSize()) / 4,
  alignItems: 'center',
  flexWrap: 'wrap',
});

/**
 * __Footer items__
 *
 * The footer items in the comment. Usually reserved for error messages.
 */
const FooterItems: FC<FooterItemsProps> = ({
  actions = [],
  errorActions = [],
  errorIconLabel,
  isError,
  isSaving,
  testId,
}) => {
  if (isSaving || (!actions && !errorActions)) {
    return null;
  }

  const items = isError ? errorActions : actions;

  return (
    <div data-testid={testId} css={actionsContainerStyles}>
      {isError ? (
        <span css={paddingRightStyles}>
          <WarningIcon
            primaryColor={token('color.text.warning', Y500)}
            label={errorIconLabel ? errorIconLabel : ''}
          />
        </span>
      ) : null}
      {items.map((item, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <div css={actionItemStyles} key={index}>
          {item}
        </div>
      ))}
    </div>
  );
};

export default FooterItems;
