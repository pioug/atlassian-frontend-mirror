/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { cssMap, cx, jsx } from '@compiled/react';

import { Label } from '@atlaskit/form';
import { Box } from '@atlaskit/primitives/compiled';
import TextArea from '@atlaskit/textarea';

const wrapperStyles = cssMap({
	root: {
		maxWidth: '500px',
	},
});

const _default: () => JSX.Element = () => (
	<Box id="resize" xcss={cx(wrapperStyles.root)}>
		<Label htmlFor="resize-auto">Resize: auto</Label>
		<TextArea resize="auto" name="resize-auto" id="resize-auto" testId="autoResizeTextArea" />
		<Label htmlFor="resize-vertical">Resize: vertical</Label>
		<TextArea
			resize="vertical"
			name="resize-vertical"
			id="resize-vertical"
			testId="verticalResizeTextArea"
		/>
		<Label htmlFor="resize-horizontal">Resize: horizontal</Label>
		<TextArea
			resize="horizontal"
			name="resize-horizontal"
			id="resize-horizontal"
			testId="horizontalResizeTextArea"
		/>
		<Label htmlFor="resize-smart">Resize: smart (default)</Label>
		<TextArea name="resize-smart" id="resize-smart" testId="smartResizeTextArea" />
		<Label htmlFor="resize-none">Resize: none</Label>
		<TextArea resize="none" name="resize-none" id="resize-none" testId="noneResizeTextArea" />
	</Box>
);
export default _default;
