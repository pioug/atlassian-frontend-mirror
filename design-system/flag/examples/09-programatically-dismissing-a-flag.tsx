import React, { type ReactElement, useState } from 'react';

import Button from '@atlaskit/button/new';
import { cssMap } from '@atlaskit/css';
import Flag, { FlagGroup } from '@atlaskit/flag';
import InfoIcon from '@atlaskit/icon/core/status-information';
import { Box, Flex } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const iconSpacingStyles = cssMap({
	space050: {
		paddingBlock: token('space.050'),
		paddingInline: token('space.050'),
	},
});

const ProgrammaticFlagDismissExample = (): React.JSX.Element => {
	const [flags, setFlags] = useState<Array<ReactElement>>([
		<Flag
			id="flag1"
			key="flag1"
			title="Can I leave yet?"
			description="Dismiss me by clicking the button on the page"
			icon={
				<Flex xcss={iconSpacingStyles.space050}>
					<InfoIcon label="Info" />
				</Flex>
			}
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
