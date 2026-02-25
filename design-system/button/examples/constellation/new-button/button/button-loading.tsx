import React, { useCallback, useState } from 'react';

import Button from '@atlaskit/button/new';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Inline, Stack } from '@atlaskit/primitives/compiled';
import Toggle from '@atlaskit/toggle';

const ButtonLoadingExample = (): React.JSX.Element => {
	const [isLoading, setIsLoading] = useState(true);

	const toggleLoading = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		setIsLoading(event.currentTarget.checked);
	}, []);

	return (
		<Stack space="space.200" alignInline="start">
			<Inline alignBlock="center">
				<Toggle isChecked={isLoading} id="enable-loading" onChange={toggleLoading} />
				<label htmlFor="show-overlay">Enable loading state</label>
			</Inline>
			<Button isLoading={isLoading}>Button</Button>
		</Stack>
	);
};

export default ButtonLoadingExample;
