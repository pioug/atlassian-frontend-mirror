import React from 'react';

// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, xcss } from '@atlaskit/primitives';
const excludeStyles = xcss({
	color: 'color.text.disabled',
});

const Label = ({ content, exclude }: { content?: string; exclude?: boolean }) => (
	<Box xcss={exclude && excludeStyles}>{content}</Box>
);

export default Label;
