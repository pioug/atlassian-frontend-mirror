import React, { type ChangeEvent, type KeyboardEvent, type SyntheticEvent, useState } from 'react';

import Button from '@atlaskit/button/new';
import Flag from '@atlaskit/flag/flag';
import FlagGroup from '@atlaskit/flag/flag-group';
import Heading from '@atlaskit/heading/heading';
import InfoIcon from '@atlaskit/icon/core/status-information';
import { Box, Stack, Text } from '@atlaskit/primitives/compiled';
import RadioGroup from '@atlaskit/radio/radio-group';
import SectionMessage from '@atlaskit/section-message';
import Textfield from '@atlaskit/textfield/text-field';
import { token } from '@atlaskit/tokens';

type EscapeMode = 'stop-propagation' | 'prevent-default';

const escapeModeOptions = [
	{
		label: 'Stop propagation — Escape dismisses the flag',
		name: 'escape-mode',
		value: 'stop-propagation',
	},
	{
		label: 'Prevent default — the input keeps Escape ownership',
		name: 'escape-mode',
		value: 'prevent-default',
	},
];

export default function FlagKeyboardDismissFromInputExample(): React.JSX.Element {
	const [mode, setMode] = useState<EscapeMode>('stop-propagation');
	const [inputValue, setInputValue] = useState('');
	const [isInputFocused, setIsInputFocused] = useState(false);
	const [isFlagVisible, setIsFlagVisible] = useState(false);

	const resetExample = () => {
		setInputValue('');
		setIsFlagVisible(false);
	};

	const handleModeChange = (event: SyntheticEvent<HTMLInputElement>) => {
		setMode(event.currentTarget.value as EscapeMode);
		resetExample();
	};

	const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
		setInputValue(event.currentTarget.value);
		setIsFlagVisible(true);
	};

	const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
		event.stopPropagation();
		if (event.key === 'Escape' && mode === 'prevent-default') {
			event.preventDefault();
		}
	};

	const expectedOutcome =
		mode === 'stop-propagation'
			? 'Escape should close the flag while this input keeps its value and focus.'
			: 'Escape should leave the flag open because this input prevents the default action.';

	return (
		<Box padding="space.200">
			<Stack space="space.200">
				<Heading size="medium">Dismiss a flag while editing an input</Heading>

				<SectionMessage appearance="information" headingLevel="h3" title="Manual test">
					<ol>
						<li>Enable the platform_dst_flag_keyboard_dismiss feature gate.</li>
						<li>Choose an Escape-handling scenario.</li>
						<li>Type in the Summary input to show a flag without moving focus.</li>
						<li>Press Escape and compare the result with the expected outcome below.</li>
					</ol>
				</SectionMessage>

				<fieldset>
					<legend>Escape handling</legend>
					<RadioGroup
						defaultValue="stop-propagation"
						onChange={handleModeChange}
						options={escapeModeOptions}
					/>
				</fieldset>

				<Stack space="space.100">
					<label htmlFor="keyboard-dismiss-summary">Summary</label>
					<Textfield
						aria-describedby="keyboard-dismiss-expected-outcome"
						autoComplete="off"
						id="keyboard-dismiss-summary"
						onBlur={() => setIsInputFocused(false)}
						onChange={handleInputChange}
						onFocus={() => setIsInputFocused(true)}
						onKeyDown={handleInputKeyDown}
						testId="keyboard-dismiss-input"
						type="text"
						value={inputValue}
					/>
				</Stack>

				<Text as="p" id="keyboard-dismiss-expected-outcome">
					{expectedOutcome}
				</Text>
				<Text as="p">
					Flag: {isFlagVisible ? 'open' : 'closed'}. Input focus:{' '}
					{isInputFocused ? 'focused' : 'not focused'}. Input value: {inputValue || 'empty'}.
				</Text>

				<Button onClick={resetExample}>Reset example</Button>

				<FlagGroup onDismissed={() => setIsFlagVisible(false)}>
					{isFlagVisible ? (
						<Flag
							description="Press Escape to exercise the selected input scenario."
							icon={<InfoIcon label="Information" color={token('color.icon.information')} />}
							id="keyboard-dismiss-flag"
							key="keyboard-dismiss-flag"
							testId="keyboard-dismiss-flag"
							title="Summary editing flag"
						/>
					) : null}
				</FlagGroup>
			</Stack>
		</Box>
	);
}
