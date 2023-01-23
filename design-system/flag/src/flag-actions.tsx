/* eslint-disable @repo/internal/styles/no-nested-styles */
/** @jsx jsx */
import { ComponentType, CSSProperties, FC } from 'react';

import { css, jsx } from '@emotion/react';

import Button from '@atlaskit/button/custom-theme-button';
import type { CustomThemeButtonProps } from '@atlaskit/button/types';
import { UNSAFE_Inline as Inline } from '@atlaskit/ds-explorations';
import { gridSize as getGridSize } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

import {
  DEFAULT_APPEARANCE,
  VAR_COLOR,
  VAR_BG_COLOR,
  VAR_BG_COLOR_HOVER,
  VAR_BG_COLOR_ACTIVE,
  VAR_FOCUS_COLOR,
} from './constants';
import {
  flagFocusRingColor,
  actionBackgroundColor,
  actionTextColor,
} from './theme';
import type { ActionsType, AppearanceTypes } from './types';

type FlagActionsProps = {
  appearance: AppearanceTypes;
  actions: ActionsType;
  linkComponent?: ComponentType<CustomThemeButtonProps>;
  testId?: string;
};

const gridSize = getGridSize();

const buttonStyles = css({
  '&&, a&&': {
    padding: `0 ${gridSize}px !important`,
    background: `var(${VAR_BG_COLOR})`,
    color: `var(${VAR_COLOR}) !important`,
    fontWeight: token('font.weight.medium', '500'),
  },
  '&&:focus, a&&:focus': {
    boxShadow: `0 0 0 2px var(${VAR_FOCUS_COLOR})`,
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
    padding: '0 !important',
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
    <Inline
      gap="scale.100"
      flexWrap="wrap"
      alignItems="center"
      divider={isBold ? null : '·'}
      UNSAFE_style={isBold ? undefined : { transform: `translateX(-2px)` }}
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
              [VAR_FOCUS_COLOR]: flagFocusRingColor[appearance],
            } as CSSProperties
          }
          css={[
            buttonStyles,
            appearance === 'normal' && appearanceNormalButtonStyles,
          ]}
        >
          {action.content}
        </Button>
      ))}
    </Inline>
  );
};

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default FlagActions;
