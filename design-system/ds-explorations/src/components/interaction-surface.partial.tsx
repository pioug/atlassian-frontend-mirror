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
 * @codegen <<SignedSource::ed9784c5552e9d1f22b7cfe60aa11c75>>
 * @codegenId interactions
 * @codegenCommand yarn codegen-styles
 * @codegenParams ["background"]
 * @codegenDependency ../../../tokens/src/artifacts/tokens-raw/atlassian-light.tsx <<SignedSource::f1021f8d47ab63374e371ce18db72a1c>>
 */
const backgroundActiveColorMap = {
  'accent.lime.subtlest': css({
    ':active': {
      backgroundColor: token('color.background.accent.lime.subtlest.pressed'),
    },
  }),
  'accent.lime.subtler': css({
    ':active': {
      backgroundColor: token('color.background.accent.lime.subtler.pressed'),
    },
  }),
  'accent.lime.subtle': css({
    ':active': {
      backgroundColor: token('color.background.accent.lime.subtle.pressed'),
    },
  }),
  'accent.lime.bolder': css({
    ':active': {
      backgroundColor: token('color.background.accent.lime.bolder.pressed'),
    },
  }),
  'accent.red.subtlest': css({
    ':active': {
      backgroundColor: token('color.background.accent.red.subtlest.pressed'),
    },
  }),
  'accent.red.subtler': css({
    ':active': {
      backgroundColor: token('color.background.accent.red.subtler.pressed'),
    },
  }),
  'accent.red.subtle': css({
    ':active': {
      backgroundColor: token('color.background.accent.red.subtle.pressed'),
    },
  }),
  'accent.red.bolder': css({
    ':active': {
      backgroundColor: token('color.background.accent.red.bolder.pressed'),
    },
  }),
  'accent.orange.subtlest': css({
    ':active': {
      backgroundColor: token('color.background.accent.orange.subtlest.pressed'),
    },
  }),
  'accent.orange.subtler': css({
    ':active': {
      backgroundColor: token('color.background.accent.orange.subtler.pressed'),
    },
  }),
  'accent.orange.subtle': css({
    ':active': {
      backgroundColor: token('color.background.accent.orange.subtle.pressed'),
    },
  }),
  'accent.orange.bolder': css({
    ':active': {
      backgroundColor: token('color.background.accent.orange.bolder.pressed'),
    },
  }),
  'accent.yellow.subtlest': css({
    ':active': {
      backgroundColor: token('color.background.accent.yellow.subtlest.pressed'),
    },
  }),
  'accent.yellow.subtler': css({
    ':active': {
      backgroundColor: token('color.background.accent.yellow.subtler.pressed'),
    },
  }),
  'accent.yellow.subtle': css({
    ':active': {
      backgroundColor: token('color.background.accent.yellow.subtle.pressed'),
    },
  }),
  'accent.yellow.bolder': css({
    ':active': {
      backgroundColor: token('color.background.accent.yellow.bolder.pressed'),
    },
  }),
  'accent.green.subtlest': css({
    ':active': {
      backgroundColor: token('color.background.accent.green.subtlest.pressed'),
    },
  }),
  'accent.green.subtler': css({
    ':active': {
      backgroundColor: token('color.background.accent.green.subtler.pressed'),
    },
  }),
  'accent.green.subtle': css({
    ':active': {
      backgroundColor: token('color.background.accent.green.subtle.pressed'),
    },
  }),
  'accent.green.bolder': css({
    ':active': {
      backgroundColor: token('color.background.accent.green.bolder.pressed'),
    },
  }),
  'accent.teal.subtlest': css({
    ':active': {
      backgroundColor: token('color.background.accent.teal.subtlest.pressed'),
    },
  }),
  'accent.teal.subtler': css({
    ':active': {
      backgroundColor: token('color.background.accent.teal.subtler.pressed'),
    },
  }),
  'accent.teal.subtle': css({
    ':active': {
      backgroundColor: token('color.background.accent.teal.subtle.pressed'),
    },
  }),
  'accent.teal.bolder': css({
    ':active': {
      backgroundColor: token('color.background.accent.teal.bolder.pressed'),
    },
  }),
  'accent.blue.subtlest': css({
    ':active': {
      backgroundColor: token('color.background.accent.blue.subtlest.pressed'),
    },
  }),
  'accent.blue.subtler': css({
    ':active': {
      backgroundColor: token('color.background.accent.blue.subtler.pressed'),
    },
  }),
  'accent.blue.subtle': css({
    ':active': {
      backgroundColor: token('color.background.accent.blue.subtle.pressed'),
    },
  }),
  'accent.blue.bolder': css({
    ':active': {
      backgroundColor: token('color.background.accent.blue.bolder.pressed'),
    },
  }),
  'accent.purple.subtlest': css({
    ':active': {
      backgroundColor: token('color.background.accent.purple.subtlest.pressed'),
    },
  }),
  'accent.purple.subtler': css({
    ':active': {
      backgroundColor: token('color.background.accent.purple.subtler.pressed'),
    },
  }),
  'accent.purple.subtle': css({
    ':active': {
      backgroundColor: token('color.background.accent.purple.subtle.pressed'),
    },
  }),
  'accent.purple.bolder': css({
    ':active': {
      backgroundColor: token('color.background.accent.purple.bolder.pressed'),
    },
  }),
  'accent.magenta.subtlest': css({
    ':active': {
      backgroundColor: token(
        'color.background.accent.magenta.subtlest.pressed',
      ),
    },
  }),
  'accent.magenta.subtler': css({
    ':active': {
      backgroundColor: token('color.background.accent.magenta.subtler.pressed'),
    },
  }),
  'accent.magenta.subtle': css({
    ':active': {
      backgroundColor: token('color.background.accent.magenta.subtle.pressed'),
    },
  }),
  'accent.magenta.bolder': css({
    ':active': {
      backgroundColor: token('color.background.accent.magenta.bolder.pressed'),
    },
  }),
  'accent.gray.subtlest': css({
    ':active': {
      backgroundColor: token('color.background.accent.gray.subtlest.pressed'),
    },
  }),
  'accent.gray.subtler': css({
    ':active': {
      backgroundColor: token('color.background.accent.gray.subtler.pressed'),
    },
  }),
  'accent.gray.subtle': css({
    ':active': {
      backgroundColor: token('color.background.accent.gray.subtle.pressed'),
    },
  }),
  'accent.gray.bolder': css({
    ':active': {
      backgroundColor: token('color.background.accent.gray.bolder.pressed'),
    },
  }),
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
  'accent.lime.subtlest': css({
    ':hover': {
      backgroundColor: token('color.background.accent.lime.subtlest.hovered'),
    },
  }),
  'accent.lime.subtler': css({
    ':hover': {
      backgroundColor: token('color.background.accent.lime.subtler.hovered'),
    },
  }),
  'accent.lime.subtle': css({
    ':hover': {
      backgroundColor: token('color.background.accent.lime.subtle.hovered'),
    },
  }),
  'accent.lime.bolder': css({
    ':hover': {
      backgroundColor: token('color.background.accent.lime.bolder.hovered'),
    },
  }),
  'accent.red.subtlest': css({
    ':hover': {
      backgroundColor: token('color.background.accent.red.subtlest.hovered'),
    },
  }),
  'accent.red.subtler': css({
    ':hover': {
      backgroundColor: token('color.background.accent.red.subtler.hovered'),
    },
  }),
  'accent.red.subtle': css({
    ':hover': {
      backgroundColor: token('color.background.accent.red.subtle.hovered'),
    },
  }),
  'accent.red.bolder': css({
    ':hover': {
      backgroundColor: token('color.background.accent.red.bolder.hovered'),
    },
  }),
  'accent.orange.subtlest': css({
    ':hover': {
      backgroundColor: token('color.background.accent.orange.subtlest.hovered'),
    },
  }),
  'accent.orange.subtler': css({
    ':hover': {
      backgroundColor: token('color.background.accent.orange.subtler.hovered'),
    },
  }),
  'accent.orange.subtle': css({
    ':hover': {
      backgroundColor: token('color.background.accent.orange.subtle.hovered'),
    },
  }),
  'accent.orange.bolder': css({
    ':hover': {
      backgroundColor: token('color.background.accent.orange.bolder.hovered'),
    },
  }),
  'accent.yellow.subtlest': css({
    ':hover': {
      backgroundColor: token('color.background.accent.yellow.subtlest.hovered'),
    },
  }),
  'accent.yellow.subtler': css({
    ':hover': {
      backgroundColor: token('color.background.accent.yellow.subtler.hovered'),
    },
  }),
  'accent.yellow.subtle': css({
    ':hover': {
      backgroundColor: token('color.background.accent.yellow.subtle.hovered'),
    },
  }),
  'accent.yellow.bolder': css({
    ':hover': {
      backgroundColor: token('color.background.accent.yellow.bolder.hovered'),
    },
  }),
  'accent.green.subtlest': css({
    ':hover': {
      backgroundColor: token('color.background.accent.green.subtlest.hovered'),
    },
  }),
  'accent.green.subtler': css({
    ':hover': {
      backgroundColor: token('color.background.accent.green.subtler.hovered'),
    },
  }),
  'accent.green.subtle': css({
    ':hover': {
      backgroundColor: token('color.background.accent.green.subtle.hovered'),
    },
  }),
  'accent.green.bolder': css({
    ':hover': {
      backgroundColor: token('color.background.accent.green.bolder.hovered'),
    },
  }),
  'accent.teal.subtlest': css({
    ':hover': {
      backgroundColor: token('color.background.accent.teal.subtlest.hovered'),
    },
  }),
  'accent.teal.subtler': css({
    ':hover': {
      backgroundColor: token('color.background.accent.teal.subtler.hovered'),
    },
  }),
  'accent.teal.subtle': css({
    ':hover': {
      backgroundColor: token('color.background.accent.teal.subtle.hovered'),
    },
  }),
  'accent.teal.bolder': css({
    ':hover': {
      backgroundColor: token('color.background.accent.teal.bolder.hovered'),
    },
  }),
  'accent.blue.subtlest': css({
    ':hover': {
      backgroundColor: token('color.background.accent.blue.subtlest.hovered'),
    },
  }),
  'accent.blue.subtler': css({
    ':hover': {
      backgroundColor: token('color.background.accent.blue.subtler.hovered'),
    },
  }),
  'accent.blue.subtle': css({
    ':hover': {
      backgroundColor: token('color.background.accent.blue.subtle.hovered'),
    },
  }),
  'accent.blue.bolder': css({
    ':hover': {
      backgroundColor: token('color.background.accent.blue.bolder.hovered'),
    },
  }),
  'accent.purple.subtlest': css({
    ':hover': {
      backgroundColor: token('color.background.accent.purple.subtlest.hovered'),
    },
  }),
  'accent.purple.subtler': css({
    ':hover': {
      backgroundColor: token('color.background.accent.purple.subtler.hovered'),
    },
  }),
  'accent.purple.subtle': css({
    ':hover': {
      backgroundColor: token('color.background.accent.purple.subtle.hovered'),
    },
  }),
  'accent.purple.bolder': css({
    ':hover': {
      backgroundColor: token('color.background.accent.purple.bolder.hovered'),
    },
  }),
  'accent.magenta.subtlest': css({
    ':hover': {
      backgroundColor: token(
        'color.background.accent.magenta.subtlest.hovered',
      ),
    },
  }),
  'accent.magenta.subtler': css({
    ':hover': {
      backgroundColor: token('color.background.accent.magenta.subtler.hovered'),
    },
  }),
  'accent.magenta.subtle': css({
    ':hover': {
      backgroundColor: token('color.background.accent.magenta.subtle.hovered'),
    },
  }),
  'accent.magenta.bolder': css({
    ':hover': {
      backgroundColor: token('color.background.accent.magenta.bolder.hovered'),
    },
  }),
  'accent.gray.subtlest': css({
    ':hover': {
      backgroundColor: token('color.background.accent.gray.subtlest.hovered'),
    },
  }),
  'accent.gray.subtler': css({
    ':hover': {
      backgroundColor: token('color.background.accent.gray.subtler.hovered'),
    },
  }),
  'accent.gray.subtle': css({
    ':hover': {
      backgroundColor: token('color.background.accent.gray.subtle.hovered'),
    },
  }),
  'accent.gray.bolder': css({
    ':hover': {
      backgroundColor: token('color.background.accent.gray.bolder.hovered'),
    },
  }),
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
