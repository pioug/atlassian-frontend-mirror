/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/new';

import TextArea from '../src';
import { type TextAreaProps } from '../src/types';

const wrapperStyles = css({
	maxWidth: 500,
});
export default () => {
	const [text, setText] = useState<string | undefined>();

	const handleChange: TextAreaProps['onChange'] = (e) => setText(e.currentTarget.value);

	const longText =
		'A text area lets users enter long form text which spans over multiple lines. The `resize` prop provides control of how the text area will handle resizing to fit content. Setting this prop to `smart` will automatically increase and decrease the height of the text area to fit text';

	const exampleProps = {
		value: text,
		onChange: handleChange,
	};

	return (
		<div id="resize" css={wrapperStyles}>
			<div>
				{/* Buttons are required to test resize works when
      the value prop is changed, rather than only onChange events */}
				<ButtonGroup label="Textarea fields controls">
					<Button onClick={() => setText('')} testId="clearTextButton">
						Clear
					</Button>
					<Button appearance="primary" onClick={() => setText(longText)} testId="insertTextButton">
						Insert text
					</Button>
				</ButtonGroup>
			</div>
			<label htmlFor="auto">Resize: auto</label>
			<TextArea {...exampleProps} name="auto" id="auto" resize="auto" testId="autoResizeTextArea" />
			<label htmlFor="vertical">Resize: vertical</label>
			<TextArea
				{...exampleProps}
				name="vertical"
				id="vertical"
				resize="vertical"
				testId="verticalResizeTextArea"
			/>
			<label htmlFor="horizontal">Resize: horizontal</label>
			<TextArea
				{...exampleProps}
				name="horizontal"
				id="horizontal"
				resize="horizontal"
				testId="horizontalResizeTextArea"
			/>
			<label htmlFor="smart">Resize: smart (default)</label>
			<TextArea {...exampleProps} name="smart" id="smart" testId="smartResizeTextArea" />
			<label htmlFor="none">Resize: none</label>
			<TextArea {...exampleProps} name="none" id="none" resize="none" testId="noneResizeTextArea" />
		</div>
	);
};
