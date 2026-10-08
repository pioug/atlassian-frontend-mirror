import React from 'react';

import { IntlProvider } from 'react-intl';

import { cssMap } from '@atlaskit/css';
import AudioIcon from '@atlaskit/icon-file-type/glyph/audio/48';
import DocumentIcon from '@atlaskit/icon-file-type/glyph/document/48';
import SpreadsheetIcon from '@atlaskit/icon-file-type/glyph/spreadsheet/48';
import { Box } from '@atlaskit/primitives/compiled/box';
import { token } from '@atlaskit/tokens';
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
				<DocumentIcon label="Document" />
				<AudioIcon label="Audio" />
				<SpreadsheetIcon label="Spreadsheet" />
			</Box>
		</IntlProvider>
	);
}
