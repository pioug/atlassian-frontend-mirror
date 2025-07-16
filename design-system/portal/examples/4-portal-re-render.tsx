import React, { useState } from 'react';

import Button from '@atlaskit/button/new';
import Portal from '@atlaskit/portal';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, Inline } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

export default function BasicPortalExample() {
	const [zIndexes, setzIndex] = useState({ zIndex1: 100, zIndex2: 200 });
	const [child, setChild] = useState(1);
	return (
		<>
			<Box paddingInline="space.300">
				<Inline space="space.300">
					<Button
						id="toggleZIndexBtn"
						appearance={'primary'}
						onClick={() =>
							setzIndex({
								zIndex1: zIndexes.zIndex2,
								zIndex2: zIndexes.zIndex1,
							})
						}
					>
						Toggle z-index
					</Button>
					<Button id="changeChildValue" appearance={'primary'} onClick={() => setChild(child + 1)}>
						Change child value of Portal 2
					</Button>
				</Inline>
			</Box>
			<Portal zIndex={zIndexes.zIndex1}>
				<div
					style={{
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						position: 'absolute',
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						top: 54,
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						left: token('space.300', '24px'),
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						background: 'lightpink',
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						padding: token('space.300', '24px'),
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						borderRadius: '3px',
						zIndex: zIndexes.zIndex2,
					}}
				>
					<p>portal z-index: {zIndexes.zIndex1}</p>
					<p>element z-index: {zIndexes.zIndex2}</p>
				</div>
			</Portal>
			<Portal zIndex={zIndexes.zIndex2}>
				<div
					style={{
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						position: 'absolute',
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						top: 130,
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						left: 100,
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						background: 'aquamarine',
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						padding: token('space.300', '24px'),
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						borderRadius: '3px',
						zIndex: zIndexes.zIndex1,
					}}
				>
					<p>portal z-index: {zIndexes.zIndex2}</p>
					<p>element z-index: {zIndexes.zIndex1}</p>
					<p>Child value: {child}</p>
				</div>
			</Portal>
		</>
	);
}
