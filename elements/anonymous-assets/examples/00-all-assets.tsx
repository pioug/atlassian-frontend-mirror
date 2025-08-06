/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { useEffect, useState } from 'react';

import { cssMap, cx, jsx } from '@atlaskit/css';
import { Flex, Grid, Stack, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { type AnonymousAsset, getAllAnonymousAssets } from '../src';

const styles = cssMap({
	root: {
		marginTop: token('space.200'),
		gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
	},
	image: {
		width: '50px',
	},
});

export default () => {
	const [assets, setAssets] = useState<AnonymousAsset[]>([]);

	useEffect(() => {
		getAllAnonymousAssets().then(setAssets);
	}, []);

	return (
		<div>
			<h3>Anonymous Assets</h3>
			<Stack>
				<Grid gap="space.100" xcss={cx(styles.root)}>
					{assets.map((anonymousAsset, index) => (
						<Flex alignItems="center" justifyContent="center" direction="column" key={index}>
							<img alt={anonymousAsset.name} src={anonymousAsset.src} css={[styles.image]} />
							<Text size="small" align="center">
								{anonymousAsset.name}
							</Text>
						</Flex>
					))}
				</Grid>
			</Stack>
		</div>
	);
};
