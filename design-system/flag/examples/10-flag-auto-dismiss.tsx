import React, { useEffect, useState } from 'react';

import Button from '@atlaskit/button/new';
import { AutoDismissFlag, FlagGroup } from '@atlaskit/flag';
import { type AppearanceTypes } from '@atlaskit/flag/types';
import SuccessIcon from '@atlaskit/icon/core/status-success';
import { Box } from '@atlaskit/primitives/compiled';

const appearances: AppearanceTypes[] = ['error', 'info', 'normal', 'success', 'warning'];

const AutoDismissExample = (): React.JSX.Element => {
	const [flags, setFlags] = useState<Array<number>>([]);

	const addFlag = () => {
		const newFlagId = flags.length + 1;
		const newFlags = flags.slice();
		newFlags.splice(0, 0, newFlagId);

		setFlags(newFlags);
	};

	const handleDismiss = () => {
		setFlags(flags.slice(1));
	};

	// AFP-2511 TODO: Fix automatic suppressions below
	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(addFlag, []);

	return (
		<Box>
			<Button appearance="primary" onClick={addFlag}>
				Add another Flag
			</Button>
			<FlagGroup onDismissed={handleDismiss}>
				{flags.map((flagId) => {
					const appearance = appearances[flagId % appearances.length];
					return (
						<AutoDismissFlag
							appearance={appearance}
							id={flagId}
							icon={<SuccessIcon label="Success" spacing="spacious" />}
							key={flagId}
							title={`Flag #${flagId}`}
							description="I will auto dismiss after 8 seconds"
						/>
					);
				})}
			</FlagGroup>
		</Box>
	);
};

export default AutoDismissExample;
