import React from 'react';

import { IntlProvider } from 'react-intl';

import ColorPaletteMenu from '@atlaskit/color-picker/ColorPaletteMenu';
import { cssMap } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled/box';
import { token } from '@atlaskit/tokens';

import { simplePalette } from '../../mock-data';
const styles = cssMap({
	subject: {
		width: 'fit-content',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		gap: token('space.200'),
	},
});

export default function Preview(): React.JSX.Element {
	return (
		<IntlProvider locale="en">
			<Box testId="component-preview" xcss={styles.subject}>
				<ColorPaletteMenu
					palette={simplePalette}
					cols={6}
					selectedColor={token('color.background.accent.purple.subtle')}
					onChange={() => {}}
					autoFocus={false}
					isInsideMenu={false}
				/>
			</Box>
		</IntlProvider>
	);
}
