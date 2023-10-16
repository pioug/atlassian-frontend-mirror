/** @jsx jsx */
import { createContext, FC, Fragment, ReactNode, useContext } from 'react';

import { css, jsx } from '@emotion/react';
import invariant from 'tiny-invariant';

import { token } from '@atlaskit/tokens';

import {
  BodyText,
  bodyTextStylesMap,
  inverseColorMap,
  TextColor,
  textColorStylesMap,
  UiText,
  uiTextStylesMap,
} from '../xcss/style-maps.partial';

import { useSurface } from './internal/surface-provider';
import type { BasePrimitiveProps } from './types';

const asAllowlist = ['span', 'p', 'strong', 'em'] as const;
type AsElement = (typeof asAllowlist)[number];

type Variant = BodyText | UiText;

export interface TextProps extends BasePrimitiveProps {
  /**
   * HTML tag to be rendered. Defaults to `span`.
   */
  as?: AsElement;
  /**
   * Elements rendered within the Text element
   */
  children: ReactNode;
  /**
   * Text variant
   */
  variant?: Variant;
  /**
   * Token representing text color with a built-in fallback value.
   * Will apply inverse text color automatically if placed within a Box with backgroundColor.
   *
   */
  color?: TextColor;
  /**
   * The HTML id attribute https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id
   */
  id?: string;
  /**
   * Truncates text with an ellipsis when text overflows its parent container
   * (i.e. `width` has been set on parent that is shorter than text length).
   */
  shouldTruncate?: boolean;
  /**
   * Text align https://developer.mozilla.org/en-US/docs/Web/CSS/text-align
   */
  textAlign?: TextAlign;
}

const variantStyles = { ...bodyTextStylesMap, ...uiTextStylesMap };

const strongStyles = css({
  fontWeight: token('font.weight.bold', 'bold'),
});

const emStyles = css({
  fontStyle: 'italic',
});

type TextAlign = keyof typeof textAlignMap;
const textAlignMap = {
  center: css({ textAlign: 'center' }),
  end: css({ textAlign: 'end' }),
  start: css({ textAlign: 'start' }),
};

const truncateStyles = css({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

/**
 * Custom hook designed to abstract the parsing of the color props and make it clearer in the future how color is reconciled between themes and tokens.
 */
const useColor = (colorProp: TextColor): NonNullable<TextColor> => {
  const surface = useSurface();
  const inverseTextColor =
    inverseColorMap[surface as keyof typeof inverseColorMap];

  /**
   * Where the color of the surface is inverted we override the user choice
   * as there is no valid choice that is not covered by the override.
   */
  const color = inverseTextColor ?? colorProp;

  return color;
};

const HasTextAncestorContext = createContext(false);
const useHasTextAncestor = () => useContext(HasTextAncestorContext);

/**
 * __Text__
 *
 * Text is a primitive component that has the Atlassian Design System's design guidelines baked in.
 * This includes considerations for text attributes such as color, font size, font weight, and line height.
 * It renders a `span` by default.
 *
 * @internal
 */
const Text: FC<TextProps> = ({ children, ...props }) => {
  const {
    as: asElement,
    color: colorProp,
    shouldTruncate = false,
    textAlign,
    testId,
    id,
    variant = 'body',
  } = props;

  let Component = asElement;
  if (!Component) {
    if (variant.includes('body')) {
      Component = 'p';
    } else {
      // ui text and default => span
      Component = 'span';
    }
  }

  invariant(
    asAllowlist.includes(Component),
    `@atlaskit/primitives: Text received an invalid "as" value of "${Component}"`,
  );
  const color = useColor(colorProp!);
  const isWrapped = useHasTextAncestor();

  /**
   * If the text is already wrapped and applies no props we can just
   * render the children directly as a fragment.
   */
  if (isWrapped && Object.keys(props).length === 0) {
    return <Fragment>{children}</Fragment>;
  }

  const component = (
    <Component
      css={[
        variant && variantStyles[variant],
        color && textColorStylesMap[color],
        shouldTruncate && truncateStyles,
        textAlign && textAlignMap[textAlign],
        asElement === 'em' && emStyles,
        asElement === 'strong' && strongStyles,
      ]}
      data-testid={testId}
      id={id}
    >
      {children}
    </Component>
  );

  return isWrapped ? (
    // no need to re-apply context if the text is already wrapped
    component
  ) : (
    <HasTextAncestorContext.Provider value={true}>
      {component}
    </HasTextAncestorContext.Provider>
  );
};

export default Text;
