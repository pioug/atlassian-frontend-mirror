import React, { Suspense, lazy, useMemo } from 'react';

import type { ExtensionManifest } from '@atlaskit/editor-common/extensions';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

import { withExtensionManifest } from '../withExtensionManifest';

const iconWidth = '40px';
const itemIconStyles = xcss({
	width: iconWidth,
	height: iconWidth,
	overflow: 'hidden',
	border: `1px solid ${token('color.border', 'rgba(223, 225, 229, 0.5)')}`,
	borderRadius: token('radius.small', '3px'),
	boxSizing: 'border-box',
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
});

type HeaderIconIconProps = {
	extensionManifest: ExtensionManifest;
};
function HeaderIcon({ extensionManifest }: HeaderIconIconProps) {
	const icon = extensionManifest.icons['48'];
	const title = extensionManifest.title;

	const ResolvedIcon = useMemo(() => {
		return lazy(() =>
			icon().then((Cmp) => {
				if ('default' in Cmp) {
					return Cmp;
				}
				return { default: Cmp };
			}),
		);
	}, [icon]);

	return (
		<Box xcss={itemIconStyles}>
			<Suspense fallback={null}>
				<ResolvedIcon label={title} />
			</Suspense>
		</Box>
	);
}

export default withExtensionManifest(HeaderIcon);
