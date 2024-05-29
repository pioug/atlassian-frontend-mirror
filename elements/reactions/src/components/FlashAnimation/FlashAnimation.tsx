/** @jsx jsx */
import { type PropsWithChildren } from 'react';
import { jsx } from '@emotion/react';
import { containerStyle, flashStyle } from './styles';

export type FlashAnimationProps = PropsWithChildren<{
  /**
   * Optional wrapper div class anme
   */
  className?: string;
  /**
   * Show custom animation or render as standard without animation (defaults to false)
   */
  flash?: boolean;
}>;

/**
 * Test id for wrapper FlashAnimation div
 */
export const RENDER_FLASHANIMATION_TESTID = 'flash-animation';

/**
 * Flash animation background component. See Reaction component for usage.
 */
export const FlashAnimation = (props: FlashAnimationProps) => (
  <div
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
    className={props.className}
    css={[containerStyle, props.flash && flashStyle]}
    data-testid={RENDER_FLASHANIMATION_TESTID}
  >
    {props.children}
  </div>
);
