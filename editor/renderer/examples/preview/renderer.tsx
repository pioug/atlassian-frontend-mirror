import React from 'react';

import { IntlProvider } from 'react-intl';

import { cssMap } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled/box';
import { Renderer as ReactRenderer } from '@atlaskit/renderer/default';
import { token } from '@atlaskit/tokens';
const styles = cssMap({
	subject: {
		width: '340px',
		display: 'block',
		alignItems: 'center',
		justifyContent: 'center',
		gap: token('space.200'),
	},
});

export default function Preview(): React.JSX.Element {
	return (
		<IntlProvider locale="en">
			<Box testId="component-preview" xcss={styles.subject}>
				<ReactRenderer
					document={{
						version: 1,
						type: 'doc',
						content: [
							{
								type: 'heading',
								attrs: { level: 3 },
								content: [{ type: 'text', text: 'Release notes' }],
							},
							{
								type: 'paragraph',
								content: [
									{
										type: 'text',
										text: 'Your team’s latest updates are ready.',
										marks: [{ type: 'strong' }],
									},
								],
							},
							{
								type: 'bulletList',
								content: [
									{
										type: 'listItem',
										content: [
											{
												type: 'paragraph',
												content: [{ type: 'text', text: 'Improved project navigation' }],
											},
										],
									},
									{
										type: 'listItem',
										content: [
											{ type: 'paragraph', content: [{ type: 'text', text: 'Faster search' }] },
										],
									},
								],
							},
						],
					}}
				/>
			</Box>
		</IntlProvider>
	);
}
