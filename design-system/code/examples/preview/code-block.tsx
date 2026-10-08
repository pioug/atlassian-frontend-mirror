import React from 'react';

import { IntlProvider } from 'react-intl';

import CodeBlock from '@atlaskit/code/code-block';
import { cssMap } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled/box';
import { token } from '@atlaskit/tokens';
const styles = cssMap({
	subject: {
		width: '280px',
		display: 'block',
		alignItems: 'center',
		justifyContent: 'center',
		gap: token('space.200'),
	},
});
const code = 'const count = 3;\nconst total = count + 1;\nconsole.log(total);';

export default function Preview(): React.JSX.Element {
	return (
		<IntlProvider locale="en">
			<Box testId="component-preview" xcss={styles.subject}>
				<CodeBlock language="typescript" text={code} />
			</Box>
		</IntlProvider>
	);
}
