/** @jsx jsx */
import { Fragment } from 'react';

import { css, jsx } from '@emotion/core';

import Button from '@atlaskit/button/custom-theme-button';
import AddIcon from '@atlaskit/icon/glyph/editor/add';
import Tooltip from '@atlaskit/tooltip';

import { CREATE_BREAKPOINT, gridSize } from '../../common/constants';
import { useTheme } from '../../theme';
import { IconButton } from '../IconButton';

import { getCreateButtonTheme } from './styles';
import { CreateProps } from './types';

const wrapperStyles = css({
  display: 'flex',
  alignItems: 'center',
  // eslint-disable-next-line @repo/internal/styles/no-nested-styles
  '& [data-hide-on-smallscreens]': {
    // eslint-disable-next-line @repo/internal/styles/no-nested-styles
    [`@media (max-width: ${CREATE_BREAKPOINT - 1}px)`]: {
      display: 'none !important',
    },
  },
  // eslint-disable-next-line @repo/internal/styles/no-nested-styles
  '& [data-hide-on-largescreens]': {
    // eslint-disable-next-line @repo/internal/styles/no-nested-styles
    [`@media (min-width: ${CREATE_BREAKPOINT}px)`]: {
      display: 'none !important',
    },
  },
  // eslint-disable-next-line @repo/internal/styles/no-nested-styles
  '&&': {
    marginLeft: gridSize * 1.5,
  },
});

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

/**
 * _Create__
 *
 * A call to action button that can be passed into `AtlassianNavigation`'s
 * `renderCreate` prop. It is shown after all other primary buttons.
 *
 * - [Examples](https://atlassian.design/components/atlassian-navigation/examples#create)
 * - [Code](https://atlassian.design/components/atlassian-navigation/code)
 */
export const Create = ({
  onClick,
  href,
  text,
  buttonTooltip,
  iconButtonTooltip,
  testId,
}: CreateProps) => {
  const theme = useTheme();

  return (
    <div css={wrapperStyles} data-testid="create-button-wrapper">
      <TooltipSwitch buttonTooltip={buttonTooltip}>
        <Button
          id="createGlobalItem"
          onClick={onClick}
          href={href}
          // eslint-disable-next-line @repo/internal/react/no-unsafe-overrides
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
        href={href}
        tooltip={iconButtonTooltip}
        // eslint-disable-next-line @repo/internal/react/no-unsafe-overrides
        theme={getCreateButtonTheme(theme)}
        aria-label={text}
        data-hide-on-largescreens
      />
    </div>
  );
};

export default Create;
