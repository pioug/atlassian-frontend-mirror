import React, { useState } from 'react';

import { SmartCardProvider } from '@atlaskit/link-provider';
import { ResolvedClient, ResolvedClientWithLongTitleUrl } from '@atlaskit/link-test-helpers';
import { Box, Text } from '@atlaskit/primitives/compiled';
import Range from '@atlaskit/range';

import { Card } from '../../src';

export default (): React.JSX.Element => {
	const [value, setValue] = useState(50);

	return (
		<SmartCardProvider client={new ResolvedClient('stg')}>
			<Text>Adjust width</Text>
			<Range step={1} value={value} onChange={(value) => setValue(value)} />
			<Box style={{ width: `${value}%` }}>
				<Card appearance="inline" truncateInline={true} url={ResolvedClientWithLongTitleUrl} />
			</Box>
		</SmartCardProvider>
	);
};
