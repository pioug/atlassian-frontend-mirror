import React from 'react';

import { cssMap } from '@atlaskit/css';
import { type JsonLd } from '@atlaskit/json-ld-types';
import { CardClient as Client, SmartCardProvider as Provider } from '@atlaskit/link-provider';
import { response1, response2, response3 } from '@atlaskit/link-test-helpers';
import { Grid } from '@atlaskit/primitives/compiled';

import { Card, ElementName, MetadataBlock, SmartLinkSize, TitleBlock } from '../../src';

const gridStyles = cssMap({
	root: {
		gridTemplateColumns: '1fr 1fr 1fr',
	},
});

const examples = {
	'https://examples/01': response2,
	'https://examples/02': response1,
	'https://examples/03': response3,
};

class CustomClient extends Client {
	fetchData(url: string) {
		return Promise.resolve(examples[url as keyof typeof examples] as JsonLd.Response);
	}
}

export default (): React.JSX.Element => (
	<Provider client={new CustomClient('stg')}>
		<Grid columnGap="space.100" xcss={gridStyles.root}>
			{Object.keys(examples).map((url: string, idx: number) => (
				<Card
					appearance="block"
					key={idx}
					url={url}
					ui={{
						clickableContainer: true,
						size: SmartLinkSize.Small,
					}}
				>
					<TitleBlock maxLines={1} />
					<MetadataBlock
						primary={[{ name: ElementName.AuthorGroup }]}
						secondary={[{ name: ElementName.ReactCount }, { name: ElementName.CommentCount }]}
					/>
					<MetadataBlock primary={[{ name: ElementName.CreatedOn }]} />
				</Card>
			))}
		</Grid>
	</Provider>
);
