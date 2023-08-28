/** @jsx jsx */
import { Fragment, ReactNode, useContext } from 'react';

import { css, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

import { SurfaceContext } from './surface-provider';
import { BasePrimitiveProps } from './types';

const baseStyles = css({
  position: 'absolute',
  inset: 0,
  borderRadius: 'inherit',
  cursor: 'pointer',
  // eslint-disable-next-line @atlaskit/design-system/no-nested-styles
  '~ *': {
    position: 'relative',
    pointerEvents: 'none',
  },
});

interface InteractionSurfaceProps extends BasePrimitiveProps {
  children: ReactNode;
  appearance?: InteractionBackgroundColor;
}

/**
 *
 * @example
 * ```js
 * // a minimal icon button
 * <Box as="button">
 *   <InteractionSurface>
 *    <WarningIcon label="icon button" />
 *  </InteractionSurface>
 * </Box>
 * ```
 */
const InteractionSurface = ({
  appearance,
  children,
  testId,
}: InteractionSurfaceProps) => {
  const defaultSurface = useContext(SurfaceContext);
  let surface = (appearance || defaultSurface) as InteractionBackgroundColor;

  // This case will occur if the Box has not set a bg color and the ancestor surface
  // is an elevation. An alternative would be to throw an error here as it may be better
  // to ensure correct predictable behaviour based on user specification.
  if (!(surface in backgroundActiveColorMap)) {
    surface = 'neutral';
  }
  return (
    <Fragment>
      <span
        data-testid={testId}
        css={[
          baseStyles,
          surface && backgroundHoverColorMap[surface],
          surface && backgroundActiveColorMap[surface],
        ]}
      />
      {children}
    </Fragment>
  );
};

export default InteractionSurface;

/**
 * THIS SECTION WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::01dc580099e9b8257da4c8f610e7874c>>
 * @codegenId interactions
 * @codegenCommand yarn codegen-styles
 * @codegenParams ["background"]
 * @codegenDependency ../../../tokens/src/artifacts/tokens-raw/atlassian-light.tsx <<SignedSource::65311fc2a6a35bb34b99c859362ac840>>
 */
const backgroundActiveColorMap = {
  input: css({
    ':active': { backgroundColor: token('color.background.input.pressed') },
  }),
  'inverse.subtle': css({
    ':active': {
      backgroundColor: token('color.background.inverse.subtle.pressed'),
    },
  }),
  neutral: css({
    ':active': { backgroundColor: token('color.background.neutral.pressed') },
  }),
  'neutral.subtle': css({
    ':active': {
      backgroundColor: token('color.background.neutral.subtle.pressed'),
    },
  }),
  'neutral.bold': css({
    ':active': {
      backgroundColor: token('color.background.neutral.bold.pressed'),
    },
  }),
  selected: css({
    ':active': { backgroundColor: token('color.background.selected.pressed') },
  }),
  'selected.bold': css({
    ':active': {
      backgroundColor: token('color.background.selected.bold.pressed'),
    },
  }),
  'brand.subtlest': css({
    ':active': {
      backgroundColor: token('color.background.brand.subtlest.pressed'),
    },
  }),
  'brand.bold': css({
    ':active': {
      backgroundColor: token('color.background.brand.bold.pressed'),
    },
  }),
  'brand.boldest': css({
    ':active': {
      backgroundColor: token('color.background.brand.boldest.pressed'),
    },
  }),
  danger: css({
    ':active': { backgroundColor: token('color.background.danger.pressed') },
  }),
  'danger.bold': css({
    ':active': {
      backgroundColor: token('color.background.danger.bold.pressed'),
    },
  }),
  warning: css({
    ':active': { backgroundColor: token('color.background.warning.pressed') },
  }),
  'warning.bold': css({
    ':active': {
      backgroundColor: token('color.background.warning.bold.pressed'),
    },
  }),
  success: css({
    ':active': { backgroundColor: token('color.background.success.pressed') },
  }),
  'success.bold': css({
    ':active': {
      backgroundColor: token('color.background.success.bold.pressed'),
    },
  }),
  discovery: css({
    ':active': { backgroundColor: token('color.background.discovery.pressed') },
  }),
  'discovery.bold': css({
    ':active': {
      backgroundColor: token('color.background.discovery.bold.pressed'),
    },
  }),
  information: css({
    ':active': {
      backgroundColor: token('color.background.information.pressed'),
    },
  }),
  'information.bold': css({
    ':active': {
      backgroundColor: token('color.background.information.bold.pressed'),
    },
  }),
  'elevation.surface': css({
    ':active': { backgroundColor: token('elevation.surface.pressed') },
  }),
  'elevation.surface.overlay': css({
    ':active': { backgroundColor: token('elevation.surface.overlay.pressed') },
  }),
  'elevation.surface.raised': css({
    ':active': { backgroundColor: token('elevation.surface.raised.pressed') },
  }),
};

const backgroundHoverColorMap = {
  input: css({
    ':hover': { backgroundColor: token('color.background.input.hovered') },
  }),
  'inverse.subtle': css({
    ':hover': {
      backgroundColor: token('color.background.inverse.subtle.hovered'),
    },
  }),
  neutral: css({
    ':hover': { backgroundColor: token('color.background.neutral.hovered') },
  }),
  'neutral.subtle': css({
    ':hover': {
      backgroundColor: token('color.background.neutral.subtle.hovered'),
    },
  }),
  'neutral.bold': css({
    ':hover': {
      backgroundColor: token('color.background.neutral.bold.hovered'),
    },
  }),
  selected: css({
    ':hover': { backgroundColor: token('color.background.selected.hovered') },
  }),
  'selected.bold': css({
    ':hover': {
      backgroundColor: token('color.background.selected.bold.hovered'),
    },
  }),
  'brand.subtlest': css({
    ':hover': {
      backgroundColor: token('color.background.brand.subtlest.hovered'),
    },
  }),
  'brand.bold': css({
    ':hover': { backgroundColor: token('color.background.brand.bold.hovered') },
  }),
  'brand.boldest': css({
    ':hover': {
      backgroundColor: token('color.background.brand.boldest.hovered'),
    },
  }),
  danger: css({
    ':hover': { backgroundColor: token('color.background.danger.hovered') },
  }),
  'danger.bold': css({
    ':hover': {
      backgroundColor: token('color.background.danger.bold.hovered'),
    },
  }),
  warning: css({
    ':hover': { backgroundColor: token('color.background.warning.hovered') },
  }),
  'warning.bold': css({
    ':hover': {
      backgroundColor: token('color.background.warning.bold.hovered'),
    },
  }),
  success: css({
    ':hover': { backgroundColor: token('color.background.success.hovered') },
  }),
  'success.bold': css({
    ':hover': {
      backgroundColor: token('color.background.success.bold.hovered'),
    },
  }),
  discovery: css({
    ':hover': { backgroundColor: token('color.background.discovery.hovered') },
  }),
  'discovery.bold': css({
    ':hover': {
      backgroundColor: token('color.background.discovery.bold.hovered'),
    },
  }),
  information: css({
    ':hover': {
      backgroundColor: token('color.background.information.hovered'),
    },
  }),
  'information.bold': css({
    ':hover': {
      backgroundColor: token('color.background.information.bold.hovered'),
    },
  }),
  'elevation.surface': css({
    ':hover': { backgroundColor: token('elevation.surface.hovered') },
  }),
  'elevation.surface.overlay': css({
    ':hover': { backgroundColor: token('elevation.surface.overlay.hovered') },
  }),
  'elevation.surface.raised': css({
    ':hover': { backgroundColor: token('elevation.surface.raised.hovered') },
  }),
};

type InteractionBackgroundColor = keyof typeof backgroundHoverColorMap;

/**
 * @codegenEnd
 */
