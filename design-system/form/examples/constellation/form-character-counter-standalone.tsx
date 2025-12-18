import React, { useState } from 'react';

import { CharacterCounter, Label } from '@atlaskit/form';
import { Box, Stack } from '@atlaskit/primitives/compiled';
import TextArea from '@atlaskit/textarea';
import TextField from '@atlaskit/textfield';

/**
 * Standalone CharacterCounter example - used outside of Form context
 * This is useful when you need character counting in custom implementations
 * that don't use the Form component or have a specific layout requirements
 * that CharacterCounterField does not provide. Generally speaking, it is
 * recommended to use CharacterCounterField for consistent styling.
 */
const StandaloneCharacterCounterExample = () => {
	const [textFieldValue, setTextFieldValue] = useState('');
	const [textAreaValue, setTextAreaValue] = useState('');

	const textFieldId = 'standalone-text-field';
	const textAreaId = 'standalone-text-area';

	// Character limits
	const maxCharacters = 50;
	const minCharacters = 10;
	const textAreaMaxCharacters = 200;

	// Calculate error states for styling
	const isTextFieldTooLong = textFieldValue.length > maxCharacters;
	const isTextAreaTooShort = textAreaValue.length < minCharacters;
	const isTextAreaTooLong = textAreaValue.length > textAreaMaxCharacters;
	const hasTextAreaError = isTextAreaTooShort || isTextAreaTooLong;

	return (
		<Stack space="space.200">
			{/* Example 1: TextField with maximum character limit */}
			<Box>
				<Label htmlFor={textFieldId}>Display name</Label>
				<TextField
					id={textFieldId}
					value={textFieldValue}
					onChange={(e) => setTextFieldValue(e.currentTarget.value)}
					aria-describedby={`${textFieldId}-character-counter`}
					isInvalid={isTextFieldTooLong}
				/>
				<CharacterCounter
					currentValue={textFieldValue}
					maxCharacters={maxCharacters}
					inputId={textFieldId}
					shouldShowAsError={isTextFieldTooLong}
				/>
			</Box>

			{/* Example 2: TextArea with both minimum and maximum limits */}
			<Box>
				<Label htmlFor={textAreaId}>Bio</Label>
				<TextArea
					id={textAreaId}
					value={textAreaValue}
					onChange={(e) => setTextAreaValue(e.currentTarget.value)}
					aria-describedby={`${textAreaId}-character-counter`}
					resize="auto"
					minimumRows={3}
					isInvalid={hasTextAreaError}
					isRequired
				/>
				<CharacterCounter
					currentValue={textAreaValue}
					minCharacters={minCharacters}
					maxCharacters={textAreaMaxCharacters}
					inputId={textAreaId}
					shouldShowAsError={hasTextAreaError}
				/>
			</Box>
		</Stack>
	);
};

export default StandaloneCharacterCounterExample;
