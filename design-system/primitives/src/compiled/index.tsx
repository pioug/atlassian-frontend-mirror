/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required -- VOLTC-139 tracks removal of these deprecated re-export shims. */
/**
 * @deprecated Use `import { Box, BoxProps } from '@atlaskit/primitives/compiled/box'` instead.
 */
export { Box, type BoxProps } from './components/box';
/**
 * @deprecated Use `import { Inline, InlineProps } from '@atlaskit/primitives/compiled/inline'` instead.
 */
export { Inline, type InlineProps } from './components/inline';
/**
 * @deprecated Use `import { Stack, StackProps } from '@atlaskit/primitives/compiled/stack'` instead.
 */
export { Stack, type StackProps } from './components/stack';
/**
 * @deprecated Use `import { Flex, FlexProps } from '@atlaskit/primitives/compiled/flex'` instead.
 */
export { Flex, type FlexProps } from './components/flex';
/**
 * @deprecated Use `import { Grid, GridProps } from '@atlaskit/primitives/compiled/grid'` instead.
 */
export { Grid, type GridProps } from './components/grid';
/**
 * @deprecated Use `import { Bleed, BleedProps } from '@atlaskit/primitives/compiled/bleed'` instead.
 */
export { Bleed, type BleedProps } from './components/bleed';
/**
 * @deprecated Use `import { Text, TextProps } from '@atlaskit/primitives/compiled/text'` instead.
 */
export { Text, type TextProps } from './components/text';
/**
 * @deprecated Use `import { MetricText, MetricTextProps } from '@atlaskit/primitives/compiled/metric-text'` instead.
 */
export { MetricText, type MetricTextProps } from './components/metric-text';
/**
 * @deprecated Use `import { Pressable, PressableProps } from '@atlaskit/primitives/compiled/pressable'` instead.
 */
export { Pressable, type PressableProps } from './components/pressable';
/**
 * @deprecated Use `import { Anchor, AnchorProps } from '@atlaskit/primitives/compiled/anchor'` instead.
 */
export { Anchor, type AnchorProps } from './components/anchor';
/**
 * @deprecated Use `import { media, Breakpoint, MediaQuery, UNSAFE_useMediaQuery, Show, Hide } from '@atlaskit/primitives/compiled/responsive/index'` instead.
 */
export {
	media,
	type Breakpoint,
	type MediaQuery,
	UNSAFE_useMediaQuery,
	Show,
	Hide,
} from './responsive';
/**
 * @deprecated Use `import { Focusable } from '@atlaskit/primitives/compiled/focusable'` instead.
 */
export { Focusable } from './components/focusable';
/**
 * @deprecated Use `import type { FocusableProps } from '@atlaskit/primitives/compiled/focusable'` instead.
 */
export type { FocusableProps } from './components/focusable';

// TODO: This is still not figured out from before…
/**
 * @deprecated Use `import { UNSAFE_useSurface } from '@atlaskit/primitives/utils/surface-provider'` instead.
 */
export { useSurface as UNSAFE_useSurface } from '../utils/surface-provider';
/**
 * @deprecated Use `import { UNSAFE_SurfaceContext } from '@atlaskit/primitives/surface-context'` instead.
 */
export { SurfaceContext as UNSAFE_SurfaceContext } from '../utils/surface-context';

/**
 * @deprecated Use `import type { BackgroundColor } from '@atlaskit/primitives/compiled/utils/types'` instead.
 */
export type { BackgroundColorToken as BackgroundColor } from '../utils/types';

/**
 * @deprecated Use `import type { Space, TextColor } from '@atlaskit/primitives/compiled/components/types'` instead.
 */
export type { PositiveSpaceToken as Space, TextColor } from './components/types';
