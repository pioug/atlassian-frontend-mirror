/* eslint-disable */

import React, { useEffect, useState } from 'react';

import { xcss } from '@atlaskit/primitives';
import { Box, Flex, Stack } from '@atlaskit/primitives/compiled';

import { type AnonymousAsset, getAllAnonymousAssets } from '../src';

const blockStyles = xcss({
	width: '2.5rem',
});

export default () => {
	const [assets, setAssets] = useState<AnonymousAsset[]>([]);

	useEffect(() => {
		getAllAnonymousAssets().then(setAssets);
	}, []);

	return (
		<div>
			<h1 style={{ marginBottom: '2%' }}>All Anonymous Assets</h1>
			<Stack>
				<Flex gap="space.800" alignItems="center" direction="row" wrap="wrap">
					{assets.map((anonymousAsset, index) => (
						<Box xcss={blockStyles}>
							<p style={{}}>{anonymousAsset.name}</p>
							<img src={anonymousAsset.src} style={{ width: '50px' }} />
						</Box>
					))}
				</Flex>
			</Stack>
		</div>
	);
};
