import React from 'react';

import Button from '@atlaskit/button/new';
import { cssMap } from '@atlaskit/css';
import { Label } from '@atlaskit/form';
import { Box, Stack } from '@atlaskit/primitives/compiled';
import TextArea from '@atlaskit/textarea';
import { token } from '@atlaskit/tokens';

const wrapperStyles = cssMap({
	root: {
		maxWidth: '500px',
		paddingTop: token('space.100'),
		paddingRight: token('space.100'),
		paddingBottom: token('space.100'),
		paddingLeft: token('space.100'),
	},
});

export default (): React.JSX.Element => {
	let textareaElement: HTMLTextAreaElement | undefined;

	const focus = () => {
		if (textareaElement) {
			textareaElement.focus();
		}
	};

	return (
		<Stack xcss={wrapperStyles.root} space="space.100">
			<Label htmlFor="disabled">Disabled</Label>
			<TextArea
				id="disabled"
				value="hello"
				name="text"
				isDisabled
				isCompact
				testId="disabledTextArea"
			/>

			<Label htmlFor="invalidTextArea">Invalid & Compact</Label>
			<TextArea id="invalidTextArea" name="area" isInvalid isCompact testId="invalidTextArea" />

			<Label htmlFor="minimumRowsTextArea">Resize:smart</Label>
			<TextArea
				id="minimumRowsTextArea"
				resize="smart"
				name="area"
				defaultValue="The default export of @atlaskit/textarea is a hybrid uncontrolled/controlled component; it is uncontrolled by default, but can be optionally controlled by setting the value prop. To set a default value for TextArea while leaving component uncontrolled, specify a defaultValue prop."
				testId="minimumRowsTextArea"
			/>

			<Label htmlFor="monospacedTextArea">Monospaced & MinimumRows: 3</Label>
			<TextArea
				id="monospacedTextArea"
				name="area"
				isMonospaced
				defaultValue="Text in monospaced code font"
				testId="monospacedTextArea"
				minimumRows={3}
			/>

			<Label htmlFor="autoResizeTextArea">Resize: auto, MaxHeight: 20vh & ReadOnly</Label>
			<TextArea
				id="autoResizeTextArea"
				resize="auto"
				maxHeight="20vh"
				name="area"
				isReadOnly
				defaultValue="The default text is readonly"
				testId="autoResizeTextArea"
			/>

			<Box id="smart">
				<Label htmlFor="smartArea">Focus & required</Label>
				<TextArea
					id="smartArea"
					isRequired
					ref={(ref: any) => {
						textareaElement = ref;
					}}
				/>
			</Box>
			<Box>
				<Button onClick={focus} type="button">
					focus
				</Button>
			</Box>
		</Stack>
	);
};
