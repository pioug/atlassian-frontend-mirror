/** @jsx jsx */
import { Fragment } from 'react';

import { jsx } from '@emotion/core';

import Button from '@atlaskit/button/custom-theme-button';
import AddIcon from '@atlaskit/icon/glyph/editor/add';
import { gridSize } from '@atlaskit/theme/constants';
import Tooltip from '@atlaskit/tooltip';

import { useTheme } from '../../theme';
import { IconButton } from '../IconButton';

import { createButtonCSS, createIconCSS, getCreateButtonTheme } from './styles';
import { CreateProps } from './types';

const grid = gridSize();

type TooltipSwitchProps = {
  buttonTooltip?: React.ReactNode;
  children: React.ReactNode;
};

const TooltipSwitch = ({ buttonTooltip, children }: TooltipSwitchProps) =>
  buttonTooltip ? (
    <Tooltip content={buttonTooltip} hideTooltipOnClick>
      {children}
    </Tooltip>
  ) : (
    <Fragment>{children}</Fragment>
  );

export const Create = ({
  onClick,
  text,
  buttonTooltip,
  iconButtonTooltip,
  testId,
}: CreateProps) => {
  const theme = useTheme();

  return (
    <div
      css={{
        display: 'flex',
        alignItems: 'center',
        '&&': {
          marginLeft: grid * 1.5,
        },
        '& [data-hide-on-smallscreens]': createButtonCSS,
        '& [data-hide-on-largescreens]': createIconCSS,
      }}
      data-testid="create-button-wrapper"
    >
      <TooltipSwitch buttonTooltip={buttonTooltip}>
        <Button
          id="createGlobalItem"
          onClick={onClick}
          theme={getCreateButtonTheme(theme)}
          testId={testId && `${testId}-button`}
          data-hide-on-smallscreens
        >
          {text}
        </Button>
      </TooltipSwitch>

      <IconButton
        id="createGlobalItemIconButton"
        testId={testId && `${testId}-icon-button`}
        icon={<AddIcon label={text} />}
        onClick={onClick}
        tooltip={iconButtonTooltip}
        theme={getCreateButtonTheme(theme)}
        aria-label={text}
        data-hide-on-largescreens
      />
    </div>
  );
};

export default Create;
