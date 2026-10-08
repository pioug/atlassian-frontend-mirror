import React from 'react';

import { cssMap } from '@atlaskit/css';
import { AtlassianIcon } from '@atlaskit/logo/atlassian-icon';
import { Box } from '@atlaskit/primitives/compiled/box';
const styles = cssMap({ subject: { width: 'fit-content', display: 'flex' } });
export const previewOptions = { width: 'fit-content', scale: 1.5 } as const;
export default function Preview(): React.JSX.Element {
	return (
		<Box testId="component-preview" xcss={styles.subject}>
			<AtlassianIcon size="xlarge" />
		</Box>
	);
}
