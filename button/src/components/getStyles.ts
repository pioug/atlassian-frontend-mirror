import { borderRadius, fontSize, gridSize } from '@atlaskit/theme/constants';
import { applyPropertyStyle, baseTheme } from '../theme';
import { ThemeProps } from '../types';

const compactButtonHeight = `${(gridSize() * 3) / fontSize()}em`;
const buttonHeight = `${(gridSize() * 4) / fontSize()}em`;

/** Background */
const getBackground = (props: ThemeProps) =>
  applyPropertyStyle('background', props, baseTheme);

/** Box Shadow */
const getBoxShadow = (props: ThemeProps) => {
  const boxShadowColor = applyPropertyStyle('boxShadowColor', props, baseTheme);
  return `0 0 0 2px ${boxShadowColor}`;
};

/** Color */
const getColor = (props: ThemeProps) =>
  applyPropertyStyle('color', props, baseTheme);

/** Cursor */
const getCursor = ({ state = 'default' }: ThemeProps) =>
  state === 'hover' || state === 'active' || state === 'selected'
    ? 'pointer'
    : state === 'disabled'
    ? 'not-allowed'
    : 'default';

/** Height */
const getHeight = ({ spacing = 'default' }: ThemeProps) =>
  spacing === 'compact'
    ? compactButtonHeight
    : spacing === 'none'
    ? 'auto'
    : buttonHeight;

/** Line Height */
const getLineHeight = ({ spacing = 'default' }: ThemeProps) =>
  spacing === 'compact'
    ? compactButtonHeight
    : spacing === 'none'
    ? 'inherit'
    : buttonHeight;

/** Padding */
const getPadding = ({ spacing = 'default' }: ThemeProps) =>
  spacing === 'none' ? 0 : `0 ${gridSize()}px`;

/** Text Decoration */
const getTextDecoration = ({
  appearance = 'default',
  state = 'default',
}: ThemeProps) =>
  state === 'hover' && (appearance === 'link' || appearance === 'subtle-link')
    ? 'underline'
    : 'inherit';

/** Transition */
const getTransition = ({ state = 'default' }: ThemeProps) =>
  state === 'hover'
    ? 'background 0s ease-out, box-shadow 0.15s cubic-bezier(0.47, 0.03, 0.49, 1.38)'
    : 'background 0.1s ease-out, box-shadow 0.15s cubic-bezier(0.47, 0.03, 0.49, 1.38)';

/** Transition Duration */
const getTransitionDuration = ({ state = 'default' }: ThemeProps) =>
  state === 'active' ? '0s' : state === 'focus' ? '0s, 0.2s' : '0.1s, 0.15s';

/** Vertical Align */
const getVerticalAlign = ({ spacing = 'default' }: ThemeProps) =>
  spacing === 'none' ? 'baseline' : 'middle';

/** Width */
const getWidth = ({ shouldFitContainer }: ThemeProps) =>
  shouldFitContainer ? '100%' : 'auto';

/** Base styles */
const staticStyles = {
  alignItems: 'baseline',
  borderWidth: 0,
  boxSizing: 'border-box',
  display: 'inline-flex',
  fontSize: 'inherit',
  fontStyle: 'normal',
  fontWeight: 'normal',
  maxWidth: '100%',
  outline: 'none !important',
  textAlign: 'center',
  textDecoration: 'none',
  whiteSpace: 'nowrap',
};

/**
 * BUTTON STYLES
 */
export const getButtonStyles = (props: ThemeProps) => ({
  ...staticStyles,
  background: getBackground(props),
  borderRadius: `${borderRadius()}px`,
  boxShadow: getBoxShadow(props),
  color: `${getColor(props)} !important`,
  cursor: getCursor(props),
  height: getHeight(props),
  lineHeight: getLineHeight(props),
  padding: getPadding(props),
  transition: getTransition(props),
  transitionDuration: getTransitionDuration(props),
  verticalAlign: getVerticalAlign(props),
  width: getWidth(props),

  '&::-moz-focus-inner': {
    border: 0,
    margin: 0,
    padding: 0,
  },

  '&:hover': {
    textDecoration: getTextDecoration(props),
  },
  ...(props.isLoading && { pointerEvents: 'none' }),
});

/**
 * SPINNER STYLES
 */
export const getSpinnerStyles = () => ({
  display: 'flex',
  position: 'absolute',
  left: '50%',
  top: '50%',
  transform: 'translate(-50%, -50%)',
});
