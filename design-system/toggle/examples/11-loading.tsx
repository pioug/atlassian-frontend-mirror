import React, { useRef, useState } from 'react';

import { Label } from '@atlaskit/form';
import { Stack } from '@atlaskit/primitives/compiled';
import Toggle from '@atlaskit/toggle';

const LoadingExample = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [isChecked, toggle] = useState(false);
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);

	return (
		<Stack>
			<Label htmlFor="toggle">Async actions</Label>
			<Toggle id="toggle" isChecked={isChecked} isLoading={isLoading} descriptionId="toggle-description" onChange={() => {
				setIsLoading(!isLoading)
				if (timeoutRef.current) {
					clearTimeout(timeoutRef.current);
				}
				timeoutRef.current = setTimeout(() => {
					toggle(!isChecked);
					setIsLoading(false);
				}, 2000);
			}} />
		</Stack>
	);
};
export default LoadingExample;
