import React from 'react';
import { type JsonLd } from 'json-ld-types';
import LikeIcon from '@atlaskit/icon/glyph/like';
import {
	ActionName,
	Card,
	Client,
	ElementName,
	FooterBlock,
	MetadataBlock,
	PreviewBlock,
	Provider,
	SmartLinkPosition,
	SmartLinkSize,
	SnippetBlock,
	TitleBlock,
} from '../../src';
import { response1 } from './example-responses';

class CustomClient extends Client {
	fetchData(url: string) {
		return Promise.resolve(response1 as JsonLd.Response);
	}
}

export default () => (
	<Provider client={new CustomClient('stg')}>
		<Card appearance="block" url={response1.data.url}>
			<TitleBlock
				size={SmartLinkSize.Medium}
				metadata={[{ name: ElementName.State }, { name: ElementName.AuthorGroup }]}
				position={SmartLinkPosition.Center}
			/>
			<PreviewBlock />
			<MetadataBlock
				primary={[
					{ name: ElementName.CreatedOn },
					{ name: ElementName.ModifiedOn },
					{ name: ElementName.CommentCount },
					{ name: ElementName.ReactCount },
				]}
			/>
			<SnippetBlock />
			<FooterBlock
				actions={[
					{
						name: ActionName.CustomAction,
						icon: <LikeIcon label="Like" />,
						content: 'Like',
						onClick: () => console.log('Like clicked!'),
					},
					{
						name: ActionName.EditAction,
						onClick: () => console.log('Edit clicked!'),
					},
					{
						name: ActionName.DeleteAction,
						onClick: () => console.log('Delete clicked!'),
					},
				]}
			/>
		</Card>
	</Provider>
);
