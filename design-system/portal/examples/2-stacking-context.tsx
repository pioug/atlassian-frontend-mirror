import React from 'react';

import Link from '@atlaskit/link';
import Portal from '@atlaskit/portal';
import { token } from '@atlaskit/tokens';

const StackingContextExample = () => (
	<div>
		<p>
			Each Portal component creates a new{' '}
			<Link href="https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Positioning/Understanding_z_index/The_stacking_context">
				Stacking Context
			</Link>
			. Elements rendered with z-indexes inside the Portal are scoped to that context.
		</p>
		<Portal zIndex={200}>
			<div
				style={{
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					position: 'absolute',
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					top: token('space.300', '24px'),
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					left: token('space.300', '24px'),
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					padding: token('space.300', '24px'),
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					background: 'lightpink',
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					borderRadius: '3px',
					// this z-index is relative to the portal
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					zIndex: 1,
				}}
			>
				<p>portal z-index: 200</p>
				<p>element z-index: 1</p>
			</div>
		</Portal>
		<Portal zIndex={100}>
			<div
				style={{
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					position: 'absolute',
					// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage, @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					top: 100,
					// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage, @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					left: 100,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					background: 'aquamarine',
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					padding: token('space.300', '24px'),
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					borderRadius: '3px',
					// this z-index is relative to the portal
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					zIndex: 1000,
				}}
			>
				<p>portal z-index: 100</p>
				<p>element z-index: 1000</p>
			</div>
		</Portal>
	</div>
);

export default StackingContextExample;
