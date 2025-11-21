import React, { useState } from 'react';

import { ErrorMessage } from '@atlaskit/form';
import Textfield from '@atlaskit/textfield';
import { token } from '@atlaskit/tokens';

const eventResultStyle = {
	borderStyle: 'dashed',
	borderWidth: token('border.width', '1px'),

	borderColor: '#7d7373',
	padding: '0.5em',

	color: '#7d7373',
	margin: '0.5em 0',
};

export default function VariationsExample(): React.JSX.Element {
	const [eventResult, setEventResult] = useState(
		'Click into & out of the input above to trigger onBlur & onFocus.',
	);

	const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setEventResult(`onChange called with value: ${e.target.value}`);
	};

	const handleOnBlur = () => {
		setEventResult('onBlur called');
	};

	const handleOnFocus = () => {
		setEventResult('onFocus called');
	};

	return (
		<div id="variations">
			<label htmlFor="event-handlers">Event Handlers</label>
			<Textfield
				testId="event-handlers"
				onChange={handleOnChange}
				onBlur={handleOnBlur}
				onFocus={handleOnFocus}
				id="event-handlers"
			/>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
			<div style={eventResultStyle}>{eventResult}</div>

			<label htmlFor="default-value">Default value (not the same as a placeholder)</label>
			<Textfield testId="default-value" defaultValue="candy" id="default-value" />

			<label htmlFor="disabled">Disabled</label>
			<Textfield testId="disabled" isDisabled defaultValue="can't touch this..." id="disabled" />

			<label htmlFor="required">Required</label>
			<Textfield testId="required" id="required" isRequired />

			<label htmlFor="invalid">Invalid</label>
			<Textfield testId="invalid" id="invalid" isInvalid />
			<ErrorMessage>Invalid</ErrorMessage>

			<label htmlFor="read-only">Read Only</label>
			<Textfield testId="read-only" id="read-only" isReadOnly defaultValue="Is read only." />

			<label htmlFor="placeholder">Placeholder</label>
			<Textfield testId="placeholder" id="placeholder" placeholder="Click here to input..." />

			<label htmlFor="placeholder-disabled">Placeholder disabled</label>
			<Textfield
				testId="placeholder-disabled"
				isDisabled
				id="placeholder-disabled"
				placeholder="Click here to input..."
			/>

			<label htmlFor="auto-focus">Auto Focus</label>
			<Textfield testId="auto-focus" autoFocus defaultValue="Text is normal font" id="auto-focus" />

			<label htmlFor="spell-check">Spell Check, Monospaced</label>
			<Textfield
				testId="spell-check"
				spellCheck
				isMonospaced
				defaultValue="Text is monospaced font"
				id="spell-check"
			/>

			<label htmlFor="compact">Compact</label>
			<Textfield testId="compact" id="compact" isCompact />

			<label htmlFor="subtle">Subtle</label>
			<Textfield testId="subtle" id="subtle" appearance="subtle" />

			<label htmlFor="subtle-disabled">Subtle, disabled</label>
			<Textfield testId="subtle-disabled" id="subtle-disabled" appearance="subtle" isDisabled />

			<label htmlFor="subtle-error">Subtle error</label>
			<Textfield testId="subtle-error" id="subtle-error" isInvalid appearance="subtle" />

			<label htmlFor="none">None</label>
			<Textfield testId="none" id="none" appearance="none" />

			<label htmlFor="none-disabled">None, disabled</label>
			<Textfield testId="none-disabled" id="none-disabled" appearance="none" isDisabled />
		</div>
	);
}
