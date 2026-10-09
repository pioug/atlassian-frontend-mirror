import React from 'react';

// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box } from '@atlaskit/primitives/box';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { xcss } from '@atlaskit/primitives/xcss/xcss';

const boxStyles = xcss({
	backgroundColor: 'color.background.information',
	borderColor: 'color.border.information',
	borderStyle: 'solid',
	borderRadius: 'radius.small',
	borderWidth: 'border.width',
	padding: 'space.100',
	textAlign: 'center',
	'::before': {
		content: '"✨"',
		paddingInlineEnd: 'space.050',
	},
	'::after': {
		content: '"✨"',
		paddingInlineStart: 'space.050',
	},
});

export default ({
	content = 'Hover over me',
}: {
	content?: string | undefined;
}): React.JSX.Element => <Box xcss={boxStyles}>{content}</Box>;
