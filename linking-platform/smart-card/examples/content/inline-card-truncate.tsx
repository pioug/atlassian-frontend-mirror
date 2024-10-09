import { SmartCardProvider } from '@atlaskit/link-provider';
import { Box, Text } from '@atlaskit/primitives';
import Range from '@atlaskit/range';
import React, { useState } from 'react';
import { ResolvedClientWithLongTitleUrl, ResolvedClient } from '../../examples/utils/custom-client';
import { Card } from '../../src';

export default () => {
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
