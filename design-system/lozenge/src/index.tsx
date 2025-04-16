import React from 'react';

import { fg } from '@atlaskit/platform-feature-flags';

import CompiledLozenge from './compiled';
import EmotionLozenge from './Lozenge';

export type { ThemeAppearance } from './Lozenge';
export type { LozengeProps } from './Lozenge';

/**
 * __Lozenge__
 *
 * A lozenge is a visual indicator used to highlight an item's status for quick recognition.
 *
 * - [Examples](https://atlassian.design/components/lozenge/examples)
 * - [Code](https://atlassian.design/components/lozenge/code)
 * - [Usage](https://atlassian.design/components/lozenge/usage)
 */
const Lozenge: typeof EmotionLozenge = React.memo((props) =>
	fg('platform_dst_lozenge_fg') ? <CompiledLozenge {...props} /> : <EmotionLozenge {...props} />,
);

// NOTE: Remove this and just directly `export { default } from '…';` when tidying `platform_dst_lozenge_fg`
Lozenge.displayName = 'Lozenge';
export default Lozenge;
