/** @jsx jsx */
import { memo } from 'react';

import { css, jsx } from '@emotion/core';

import Button from '@atlaskit/button/standard-button';
import { N500 } from '@atlaskit/theme/colors';
import { gridSize } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

import type { SectionMessageActionProps } from './types';

const actionsSeparatorWidth = gridSize() * 2;

const actionStyles = css({
  display: 'flex',
  margin: 0,
  alignItems: 'center',
  // eslint-disable-next-line @repo/internal/styles/no-nested-styles
  '& + &::before': {
    display: 'inline-block',
    width: `${actionsSeparatorWidth}px`,
    color: `${token('color.text.mediumEmphasis', N500)}`,
    content: '"·"',
    textAlign: 'center',
    verticalAlign: 'middle',
  },
});

const SectionMessageAction = memo(function SectionMessageAction({
  children,
  onClick,
  href,
  testId,
  linkComponent,
}: SectionMessageActionProps) {
  return (
    <li css={actionStyles} data-testid={testId}>
      {onClick || href ? (
        <Button
          appearance="link"
          spacing="none"
          onClick={onClick}
          href={href}
          component={href ? linkComponent : undefined}
        >
          {children}
        </Button>
      ) : (
        children
      )}
    </li>
  );
});

SectionMessageAction.displayName = 'SectionMessageAction';

export default SectionMessageAction;
