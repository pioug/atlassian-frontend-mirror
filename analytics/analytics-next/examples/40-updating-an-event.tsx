import React, { type FormEvent, type MouseEvent, useCallback, useState } from 'react';

import { AnalyticsListener, type AnalyticsEventPayload, type UIAnalyticsEvent } from '../src';

import AnalyticsButton from './helpers/AnalyticsButton';

const fieldStyles: React.CSSProperties = {
	border: '1px solid #8590a2',
	borderRadius: 3,
	display: 'block',
	fontSize: 14,
	marginTop: 4,
	padding: '8px 12px',
	width: 220,
};

const Form = () => {
	const [value, setValue] = useState('Joe Bloggs');

	const handleInputChange = useCallback(
		(e: FormEvent<HTMLInputElement>) => {
			setValue(e.currentTarget.value);
		},
		[setValue],
	);

	const handleSubmitButtonClick = useCallback(
		(e: MouseEvent<HTMLElement>, analyticsEvent: UIAnalyticsEvent) => {
			analyticsEvent
				.update((payload: AnalyticsEventPayload) => ({
					...payload,
					value,
				}))
				.fire();
		},
		[value],
	);

	return (
		<div>
			<label>
				Name
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- This legacy example intentionally keeps a plain HTML input with inline styles to avoid restoring docs-only ADS dependencies. */}
				<input onChange={handleInputChange} style={fieldStyles} type="text" value={value} />
			</label>
			<p>
				<AnalyticsButton
					analyticsEventPayload={{
						action: 'clicked',
						actionSubject: 'button',
						componentName: 'submit-button',
						packageName: '@atlaskit/analytics-next',
						packageVersion: '11.2.0',
					}}
					onClick={handleSubmitButtonClick}
				>
					Submit
				</AnalyticsButton>
			</p>
		</div>
	);
};

const App = (): React.JSX.Element => {
	const onEvent = ({ payload }: UIAnalyticsEvent) => console.log('Event payload:', payload);

	return (
		<AnalyticsListener onEvent={onEvent}>
			<Form />
		</AnalyticsListener>
	);
};

export default App;
