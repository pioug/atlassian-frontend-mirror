/** @jsx jsx */
import { css } from '@emotion/react';
import { B400, N500, N800 } from '@atlaskit/theme/colors';
import { ThemeColorModes, token } from '@atlaskit/tokens';

import { NUMBER_OF_REACTIONS_TO_DISPLAY } from '../../shared/constants';

const REACTIONS_CONTAINER_WIDTH = 48;

// These margin values must match
const REACTION_RIGHT_MARGIN = 8;
const REACTION_RIGHT_MARGIN_TOKEN = token('space.100', '8px');
/* we want to display around 9 reactions and show 10th one as faded so removing 2px from REACTIONS_CONTAINER_WIDTH*/
const CONTAINER_WIDTH =
  NUMBER_OF_REACTIONS_TO_DISPLAY *
    (REACTIONS_CONTAINER_WIDTH + REACTION_RIGHT_MARGIN) +
  REACTIONS_CONTAINER_WIDTH -
  2;
const REACTION_CONTAINER_HEIGHT = 48;

/*Reactions Container. Using pseudo Element :after to set border since with onClick of Reaction to higlight the
border blue below the reaction. Setting Border Width based on number of reactions to make sure it shows up
in case the container overflows */
export const containerStyle = (reactionsBorderWidth: number) =>
  css({
    overflow: 'hidden',
    maxWidth: `${CONTAINER_WIDTH}px`,
    height: '100%',
    display: 'flex',
    justifyContent: 'start',
    position: 'relative',
    scrollBehavior: 'smooth',
    '&:after': {
      content: '""',
      zIndex: 0,
      display: 'block',
      minWidth: `${reactionsBorderWidth}%`,
      bottom: '0px',
      position: 'absolute',
    },
  });

export const titleStyle = css({
  '& > h1': {
    fontSize: '24px!important',
    color: `${token('color.text', N800)}`,
  },
});

type containerEdgeAngleType = {
  rightEdge: number;
  leftEdge: number;
};

const containerEdgeAngle: containerEdgeAngleType = {
  rightEdge: 270,
  leftEdge: 90,
};

export const counterStyle = (isSelected: boolean) =>
  css({
    display: 'flex',
    alignSelf: 'center',
    lineHeight: '14px',
    fontSize: '11px',
    fontWeight: isSelected ? 700 : 400,
    paddingRight: '0px',
    marginTop: token('space.075', '6px'),
    '> div': {
      width: '100%',
      padding: `${token('space.0', '0px')}!important`, //Counter component has its own styles overriding them to match designs
      color: isSelected
        ? `${token('color.text', B400)}!important`
        : `2px solid ${token('color.text', N500)}!important`,
    },
  });

const fadedCss = (
  edge: keyof containerEdgeAngleType,
  theme?: ThemeColorModes,
) =>
  css({
    content: '""',
    position: 'absolute',
    left: '0px',
    top: '0px',
    width: `${REACTIONS_CONTAINER_WIDTH}px`,
    height: `${REACTION_CONTAINER_HEIGHT}px`,
    zIndex: 0,
    background:
      theme === 'dark'
        ? `linear-gradient(${containerEdgeAngle[edge]}deg, rgba(34, 39, 43, 0.95) 40.23%, rgba(34, 39, 43, 0.55) 58.33%, rgba(34, 39, 43, 0) 77.49%)`
        : `linear-gradient(${containerEdgeAngle[edge]}deg, rgba(255, 255, 255, 0.95) 40.23%, rgba(255, 255, 255, 0.55) 58.33%, rgba(255, 255, 255, 0) 77.49%)`,
  });

export const customTabWrapper = (
  isSelected: boolean,
  selectedEmojiId: string,
  theme?: ThemeColorModes,
) =>
  css({
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: `${REACTIONS_CONTAINER_WIDTH}px`,
    minHeight: `${REACTION_CONTAINER_HEIGHT}px`,
    marginRight: REACTION_RIGHT_MARGIN_TOKEN,
    boxSizing: 'border-box',
    position: 'relative',
    '> div': {
      minWidth: `${REACTIONS_CONTAINER_WIDTH}px`,
      minHeight: `${REACTION_CONTAINER_HEIGHT}px`,
      padding: '0px !important',
      alignItems: 'center',
      justifyContent: 'center',
    },
    '& > span': {
      minHeight: '16px',
      minWidth: '16px',
    },
    '&.disabled:after': fadedCss('rightEdge', theme),
    '&.disabled + &.disabled:after': fadedCss('leftEdge', theme),
    '&:after': isSelected
      ? {
          content: '""',
          borderBottom: `2px solid ${token('color.text', B400)}`,
          width: `${REACTIONS_CONTAINER_WIDTH}px`,
          bottom: '0px',
          display: 'block',
          position: 'absolute',
          zIndex: 2,
        }
      : {
          content: '""',
          borderBottom: `2px solid transparent`,
          width: `${REACTIONS_CONTAINER_WIDTH}px`,
          bottom: '0px',
          display: 'block',
          position: 'absolute',
          zIndex: 1,
        },
  });

export const navigationContainerStyle = css({
  '> button': { cursor: 'pointer' },
  'button:last-child': {
    marginLeft: token('space.200', '16px'),
  },
});

export const reactionViewStyle = css({
  marginTop: token('space.300', '24px'),
  display: 'flex',
  flexDirection: 'column',
  p: {
    margin: 0,
    color: `${token('color.text', N800)}`,
    textTransform: 'capitalize',
    fontWeight: 600,
    fontSize: 16,
    lineHeight: '20px',
    '> span': {
      marginRight: token('space.100', '8px'),
    },
  },
});

export const userListStyle = css({
  listStyle: 'none',
  marginTop: token('space.200', '16px'),
  padding: 0,
  textAlign: 'left',
  li: {
    color: `${token('color.text', N500)}`,
    fontSize: 14,
  },
});

export const userStyle = css({
  display: 'flex',
  alignItems: 'center',
  padding: `${token('space.100', '8px')} 0px ${token('space.100', '8px')} 0px`,
  '> span': {
    marginLeft: token('space.200', '16px'),
  },
});

export const customTabListStyles = css({
  overflow: 'auto',
  scrollBehavior: 'smooth',
  display: 'flex',
  paddingBottom: token('space.050', '4px'),
  'div[role=tablist]': {
    flexGrow: 1,
    // paddingInline exists to maintain styling prior to @atlaskit/tabs update that removed baked in horizontal padding
    paddingInline: token('space.100', '8px'),
  },
});

export const centerSpinner = css({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
});
