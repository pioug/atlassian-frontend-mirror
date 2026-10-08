import React from 'react';

import { IntlProvider } from 'react-intl';

import { cssMap } from '@atlaskit/css';
import { BoldIcon } from '@atlaskit/editor-toolbar/bold-icon';
import { ItalicIcon } from '@atlaskit/editor-toolbar/italic-icon';
import { LinkIcon } from '@atlaskit/editor-toolbar/link-icon';
import { Toolbar } from '@atlaskit/editor-toolbar/toolbar';
import { ToolbarButton } from '@atlaskit/editor-toolbar/toolbar-button';
import { ToolbarButtonGroup } from '@atlaskit/editor-toolbar/toolbar-button-group';
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

export const previewOptions = { width: 'fit-content', scale: 2 } as const;
export default function Preview(): React.JSX.Element {
	return (
		<IntlProvider locale="en">
			<Box testId="component-preview" xcss={styles.subject}>
				<Toolbar label="Formatting">
					<ToolbarButtonGroup>
						<ToolbarButton label="Bold" isSelected iconBefore={<BoldIcon label="" />} />
						<ToolbarButton label="Italic" iconBefore={<ItalicIcon label="" />} />
						<ToolbarButton label="Link" iconBefore={<LinkIcon label="" />} />
					</ToolbarButtonGroup>
				</Toolbar>
			</Box>
		</IntlProvider>
	);
}
