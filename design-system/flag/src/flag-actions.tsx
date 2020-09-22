/** @jsx jsx */
import { ComponentType } from 'react';

import { css, jsx } from '@emotion/core';

import Button from '@atlaskit/button/custom-theme-button';
import { CustomThemeButtonProps } from '@atlaskit/button/types';
import { gridSize as getGridSize } from '@atlaskit/theme/constants';
import { ThemeModes } from '@atlaskit/theme/types';

import { DEFAULT_APPEARANCE } from './constants';
import {
  getActionBackground,
  getActionColor,
  getFlagFocusRingColor,
} from './theme';
import { ActionsType, AppearanceTypes } from './types';

type Props = {
  appearance: AppearanceTypes;
  actions: ActionsType;
  linkComponent?: ComponentType<CustomThemeButtonProps>;
  mode: ThemeModes;
  testId?: string;
};

const gridSize = getGridSize();
const separatorWidth = gridSize * 2;
const defaultAppearanceTranslate = gridSize / 4;

const FlagActions = (props: Props) => {
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
      css={css`
        display: flex;
        flex-wrap: wrap;
        padding-top: ${gridSize}px;
        transform: ${appearance === DEFAULT_APPEARANCE
          ? `translateX(-${defaultAppearanceTranslate}px)`
          : 0};
        align-items: center;
      `}
      data-testid={testId && `${testId}-actions`}
    >
      {actions.map((action, index) => [
        index && !isBold ? (
          <div
            css={css`
              text-align: center;
              display: inline-block;
              width: ${separatorWidth}px;
            `}
            key={index + 0.5}
          >
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
          css={css`
            &&,
            a&& {
              margin-left: ${index && isBold ? gridSize : 0}px;
              font-weight: 500;
              padding: 0 ${appearance === 'normal' ? 0 : gridSize}px !important;
              background: ${getActionBackground(appearance, mode)};
              color: ${getActionColor(appearance, mode)} !important;
            }
            &&:focus,
            a&&:focus {
              box-shadow: 0 0 0 2px ${getFlagFocusRingColor(appearance, mode)};
            }
            &&:hover,
            &&:active,
            a&&:hover,
            a&&:active {
              text-decoration: underline;
            }
          `}
        >
          {action.content}
        </Button>,
      ])}
    </div>
  );
};

export default FlagActions;
