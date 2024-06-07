import React, { type ChangeEventHandler, useState } from 'react';
import { SmartCardProvider, CardClient, useFeatureFlag } from '../src';

const client = new CardClient('stg');
const TestComponent = () => {
	const showHoverPreview = useFeatureFlag('showHoverPreview');

	return (
		<div>
			{`<TestComponent>
        ${showHoverPreview}
      </TestComponent>`}
		</div>
	);
};

export default function Basic() {
	const [showHoverPreview, setShowHoverPreview] = useState(true);

	const onChange: ChangeEventHandler<HTMLInputElement> = (event) => {
		setShowHoverPreview(Boolean(event.target.value));
	};

	return (
		<SmartCardProvider
			client={client}
			featureFlags={{
				showHoverPreview,
			}}
		>
			<input type="text" value={`${showHoverPreview}`} onChange={onChange} />
			<TestComponent />
		</SmartCardProvider>
	);
}
