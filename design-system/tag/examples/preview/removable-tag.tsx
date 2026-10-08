import React from 'react';

import { IntlProvider } from 'react-intl';

import { cssMap } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled/box';
import RemovableTag from '@atlaskit/tag/removable-tag';
import { token } from '@atlaskit/tokens';
const styles = cssMap({
	subject: { width: 'fit-content', display: 'flex', alignItems: 'center', gap: token('space.200') },
});
export const previewOptions = { width: 'fit-content', scale: 1.5 } as const;
export default function Preview(): React.JSX.Element {
	return (
		<IntlProvider locale="en">
			<Box testId="component-preview" xcss={styles.subject}>
				<RemovableTag text="Design" />
				<RemovableTag text="Engineering" />
			</Box>
		</IntlProvider>
	);
}
