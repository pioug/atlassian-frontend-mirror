/* eslint-disable @repo/internal/styles/no-nested-styles */
/** @jsx jsx */
import { ComponentType, CSSProperties, FC } from 'react';

import { css, jsx } from '@emotion/react';

import Button from '@atlaskit/button/custom-theme-button';
import type { CustomThemeButtonProps } from '@atlaskit/button/types';
import Inline from '@atlaskit/primitives/inline';
import { token } from '@atlaskit/tokens';

import {
  DEFAULT_APPEARANCE,
  VAR_COLOR,
  VAR_BG_COLOR,
  VAR_BG_COLOR_HOVER,
  VAR_BG_COLOR_ACTIVE,
} from './constants';
import { actionBackgroundColor, actionTextColor } from './theme';
import type { ActionsType, AppearanceTypes } from './types';

type FlagActionsProps = {
  appearance: AppearanceTypes;
  actions: ActionsType;
  linkComponent?: ComponentType<CustomThemeButtonProps>;
  testId?: string;
};

const buttonStyles = css({
  '&&, a&&': {
    // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage-spacing
    padding: `0 ${token('space.100', '8px')} !important`,
    background: `var(${VAR_BG_COLOR})`,
    color: `var(${VAR_COLOR}) !important`,
    fontWeight: token('font.weight.medium', '500'),
  },
  '&&:hover, &&:active, a&&:hover, a&&:active': {
    textDecoration: 'underline',
  },
  '&&:hover': {
    backgroundColor: `var(${VAR_BG_COLOR_HOVER})`,
  },
  '&&:active': {
    backgroundColor: `var(${VAR_BG_COLOR_ACTIVE})`,
  },
});

const appearanceNormalButtonStyles = css({
  '&&, a&&': {
    // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage-spacing
    padding: '0 !important',
  },
});

const appearanceNormalActionsContainerStyles = css({
  '&&, a&&': {
    transform: 'translateX(-2px)',
  },
});

const FlagActions: FC<FlagActionsProps> = (props) => {
  const {
    appearance = DEFAULT_APPEARANCE,
    actions = [],
    linkComponent,
    testId,
  } = props;
  if (!actions.length) {
    return null;
  }

  const isBold = appearance !== DEFAULT_APPEARANCE;

  return (
    <span css={!isBold && appearanceNormalActionsContainerStyles}>
      <Inline
        space="space.100"
        shouldWrap
        alignBlock="center"
        separator={isBold ? undefined : '·'}
        testId={testId && `${testId}-actions`}
      >
        {actions.map((action, index) => (
          <Button
            onClick={action.onClick}
            href={action.href}
            target={action.target}
            appearance={isBold ? 'default' : 'link'}
            component={linkComponent}
            spacing="compact"
            testId={action.testId}
            key={index}
            style={
              {
                [VAR_COLOR]: actionTextColor[appearance],
                [VAR_BG_COLOR]: actionBackgroundColor[appearance].default,
                [VAR_BG_COLOR_HOVER]: actionBackgroundColor[appearance].pressed,
                [VAR_BG_COLOR_ACTIVE]: actionBackgroundColor[appearance].active,
              } as CSSProperties
            }
            css={[
              buttonStyles,
              appearance === DEFAULT_APPEARANCE && appearanceNormalButtonStyles,
            ]}
          >
            {action.content}
          </Button>
        ))}
      </Inline>
    </span>
  );
};

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default FlagActions;
