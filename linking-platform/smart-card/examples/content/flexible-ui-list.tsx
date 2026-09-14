import React from 'react';

import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';
import Client from '@atlaskit/link-provider/client';
import { SmartCardProvider as Provider } from '@atlaskit/link-provider/smart-card-provider';
import { response2, response3, response4 } from '@atlaskit/link-test-helpers';
import { Stack } from '@atlaskit/primitives/compiled';

import {
	ActionName,
	Card,
	ElementName,
	SmartLinkPosition,
	SmartLinkSize,
	SmartLinkTheme,
	TitleBlock,
} from '../../src';

const examples = {
	'https://examples/01': response3,
	'https://examples/02': response2,
	'https://examples/03': response4,
};

class CustomClient extends Client {
	fetchData(url: string) {
		return Promise.resolve(examples[url as keyof typeof examples] as JsonLd.Response);
	}
}

export default (): React.JSX.Element => (
	<Provider client={new CustomClient('stg')}>
		<Stack space="space.100">
			{Object.keys(examples).map((url: string, idx: number) => (
				<Card
					appearance="inline"
					key={idx}
					ui={{
						clickableContainer: true,
						hideBackground: true,
						hideElevation: true,
						hidePadding: true,
						size: SmartLinkSize.Large,

						theme: SmartLinkTheme.Black,
					}}
					url={url}
				>
					<TitleBlock
						metadata={[
							{ name: ElementName.State },
							{ name: ElementName.CommentCount },
							{ name: ElementName.AuthorGroup },
						]}
						actions={[
							{
								name: ActionName.EditAction,
								onClick: () => console.log('Edit clicked!'),
							},
							{
								name: ActionName.DeleteAction,
								onClick: () => console.log('Delete clicked!'),
							},
						]}
						showActionOnHover={true}
						position={SmartLinkPosition.Center}
						maxLines={1}
					/>
				</Card>
			))}
		</Stack>
	</Provider>
);
