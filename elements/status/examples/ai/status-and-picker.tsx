import React from 'react';

import { IntlProvider } from 'react-intl';

import { Status } from '@atlaskit/status/status';
import type { Color } from '@atlaskit/status/status';
import { StatusPicker } from '@atlaskit/status/status-picker';

export default function StatusAndPicker(): React.JSX.Element {
	const [text, setText] = React.useState('In progress');
	const [draftColor, setDraftColor] = React.useState<Color>('blue');
	const [savedStatus, setSavedStatus] = React.useState({
		text: 'In progress',
		color: 'blue' as Color,
	});

	return (
		<IntlProvider locale="en">
			<div>
				<p>
					Saved status: <Status text={savedStatus.text} color={savedStatus.color} />
				</p>
				<p>
					Draft preview: <Status text={text.trim() || 'No status'} color={draftColor} />
				</p>
				<StatusPicker
					text={text}
					selectedColor={draftColor}
					onTextChanged={setText}
					onColorClick={setDraftColor}
					onEnter={() => setSavedStatus({ text: text.trim() || 'No status', color: draftColor })}
				/>
				<p role="status">
					Saved status: {savedStatus.text} ({savedStatus.color})
				</p>
			</div>
		</IntlProvider>
	);
}
