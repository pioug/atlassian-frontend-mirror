import React, { useRef } from 'react';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/new';
import { FlagsProvider, useFlags } from '@atlaskit/flag';
import InformationIcon from '@atlaskit/icon/core/status-information';
import { token } from '@atlaskit/tokens';

const FlagsProviderHideFlagExample = () => {
	const flagCount = useRef(1);
	const lastFlagId = useRef<string | number | null>(null);

	const { showFlag, hideFlag } = useFlags();

	const addFlag = () => {
		const id = flagCount.current++;
		lastFlagId.current = id;
		showFlag({
			description: 'Use the "Hide last flag" button to dismiss me by id.',
			icon: <InformationIcon label="Info" color={token('color.icon.information')} />,
			id,
			title: `${id}: Whoa a new flag!`,
		});
	};

	const dismissLastFlag = () => {
		if (lastFlagId.current !== null) {
			hideFlag(lastFlagId.current);
		}
	};

	return (
		<ButtonGroup label="Manage flags">
			<Button onClick={addFlag}>Add Flag</Button>
			<Button onClick={dismissLastFlag}>Hide last flag</Button>
		</ButtonGroup>
	);
};

export default (): React.JSX.Element => (
	<FlagsProvider>
		<FlagsProviderHideFlagExample />
	</FlagsProvider>
);
