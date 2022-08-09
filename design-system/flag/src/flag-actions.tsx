/* eslint-disable @repo/internal/styles/no-nested-styles */
/** @jsx jsx */
import type { ComponentType, CSSProperties } from 'react';

import { css, jsx } from '@emotion/core';

import Button from '@atlaskit/button/custom-theme-button';
import type { CustomThemeButtonProps } from '@atlaskit/button/types';
import { gridSize as getGridSize } from '@atlaskit/theme/constants';
import type { ThemeModes } from '@atlaskit/theme/types';

import { DEFAULT_APPEARANCE } from './constants';
import {
  getActionBackground,
  getActionColor,
  getFlagFocusRingColor,
} from './theme';
import type { ActionsType, AppearanceTypes } from './types';

type FlagActionsProps = {
  appearance: AppearanceTypes;
  actions: ActionsType;
  linkComponent?: ComponentType<CustomThemeButtonProps>;
  mode: ThemeModes;
  testId?: string;
};

const gridSize = getGridSize();
const separatorWidth = gridSize * 2;
const defaultAppearanceTranslate = gridSize / 4;

const separatorStyles = css({
  display: 'inline-block',
  width: separatorWidth,
  textAlign: 'center',
});

const actionContainerStyles = css({
  display: 'flex',
  paddingTop: gridSize,
  alignItems: 'center',
  flexWrap: 'wrap',
  transform: `translateX(-${defaultAppearanceTranslate}px)`,
});

const boldActionContainerStyles = css({
  transform: 0 as any,
});

const buttonStyles = css({
  '&&, a&&': {
    marginLeft: 0,
    padding: `0 ${gridSize}px !important`,
    background: `var(--bg-color)`,
    color: `var(--color) !important`,
    fontWeight: 500,
  },
  '&&:focus, a&&:focus': {
    boxShadow: `0 0 0 2px var(--focus-color)`,
  },
  '&&:hover, &&:active, a&&:hover, a&&:active': {
    textDecoration: 'underline',
  },
});

const appeanceNormalButtonStyles = css({
  '&&, a&&': {
    padding: '0 !important',
  },
});

const isBoldButtonStyles = css({
  '&&, a&&': {
    marginRight: gridSize,
  },
});

const FlagActions = (props: FlagActionsProps) => {
  const {
    appearance = DEFAULT_APPEARANCE,
    actions = [],
    linkComponent,
    mode,
    testId,
  } = props;
  if (!actions.length) {
    return null;
  }

  const isBold = appearance !== DEFAULT_APPEARANCE;

  return (
    <div
      css={[actionContainerStyles, isBold && boldActionContainerStyles]}
      data-testid={testId && `${testId}-actions`}
    >
      {actions.map((action, index) => [
        index && !isBold ? (
          <div css={separatorStyles} key={index + 0.5}>
            ·
          </div>
        ) : (
          ''
        ),
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
              '--color': getActionColor(appearance, mode),
              '--bg-color': getActionBackground(appearance, mode),
              '--focus-color': getFlagFocusRingColor(appearance, mode),
            } as CSSProperties
          }
          css={[
            buttonStyles,
            isBold && isBoldButtonStyles,
            appearance === 'normal' && appeanceNormalButtonStyles,
          ]}
        >
          {action.content}
        </Button>,
      ])}
    </div>
  );
};

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default FlagActions;
