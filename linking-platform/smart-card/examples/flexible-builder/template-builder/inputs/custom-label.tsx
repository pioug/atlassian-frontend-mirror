import React from 'react';

// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box } from '@atlaskit/primitives/box';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { xcss } from '@atlaskit/primitives/xcss/xcss';
const excludeStyles = xcss({
	color: 'color.text.disabled',
});

const CustomLabel = ({
	content,
	exclude,
}: {
	content?: string;
	exclude?: boolean;
}): React.JSX.Element => <Box xcss={exclude && excludeStyles}>{content}</Box>;

export default CustomLabel;
