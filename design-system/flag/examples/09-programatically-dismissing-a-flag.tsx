import React, { type ReactElement, useState } from 'react';

import Button from '@atlaskit/button/new';
import Flag, { FlagGroup } from '@atlaskit/flag';
import InfoIcon from '@atlaskit/icon/core/status-information';
import { Box } from '@atlaskit/primitives/compiled';

const ProgrammaticFlagDismissExample = (): React.JSX.Element => {
	const [flags, setFlags] = useState<Array<ReactElement>>([
		<Flag
			id="flag1"
			key="flag1"
			title="Can I leave yet?"
			description="Dismiss me by clicking the button on the page"
			icon={<InfoIcon spacing="spacious" label="Info" />}
			testId="MyFlagTestId"
		/>,
	]);

	const dismissFlag = () => {
		setFlags([]);
	};

	return (
		<Box>
			<Button appearance="primary" onClick={dismissFlag}>
				Dismiss the Flag
			</Button>
			<FlagGroup>{flags}</FlagGroup>
		</Box>
	);
};

export default ProgrammaticFlagDismissExample;
