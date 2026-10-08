import React from 'react';

import { IntlProvider } from 'react-intl';

import { cssMap } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled/box';
import SimpleTag from '@atlaskit/tag/tag/simple';
import { token } from '@atlaskit/tokens';
const styles = cssMap({
	subject: { width: 'fit-content', display: 'flex', alignItems: 'center', gap: token('space.200') },
});
export const previewOptions = { width: 'fit-content', scale: 1.5 } as const;
export default function Preview(): React.JSX.Element {
	return (
		<IntlProvider locale="en">
			<Box testId="component-preview" xcss={styles.subject}>
				<SimpleTag text="Design" />
				<SimpleTag text="Engineering" color="blue" />
			</Box>
		</IntlProvider>
	);
}
