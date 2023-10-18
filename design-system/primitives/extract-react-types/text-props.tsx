// TODO: This is all hacky, replace with ts-morph solution
import { ReactNode } from 'react';

// eslint-disable-next-line @typescript-eslint/no-namespace
namespace Token {
  // BoxProps['backgroundColor'] uses keyof, which ERT does not understand
  export type TextColor = 'TextColor';
}

type TextAlign = 'center' | 'end' | 'start';
type TextVariant = 'body' | 'body.large' | 'body.small' | 'ui' | 'ui.small';

interface TextProps {
  /**
   * HTML tag to be rendered. Defaults to `span`.
   */
  // as?: AsElement;
  /**
   * Elements rendered within the Text element
   */
  children: ReactNode;
  /**
   * Text variant
   */
  variant?: TextVariant;
  /**
   * Token representing text color with a built-in fallback value.
   * Will apply inverse text color automatically if placed within a Box with backgroundColor.
   *
   */
  color?: Token.TextColor;
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

export default function Text(_: TextProps) {}
