import React, { useCallback, useState } from 'react';

import { IconButton } from '@atlaskit/button/new';
import EditIcon from '@atlaskit/icon/core/edit';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Inline, Stack } from '@atlaskit/primitives';
import Toggle from '@atlaskit/toggle';

const IconButtonLoadingExample = (): React.JSX.Element => {
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
			<IconButton isLoading={isLoading} icon={EditIcon} label="Edit" />
		</Stack>
	);
};

export default IconButtonLoadingExample;
