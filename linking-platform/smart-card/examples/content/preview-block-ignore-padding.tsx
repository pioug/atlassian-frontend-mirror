import React from 'react';

import { type JsonLd } from '@atlaskit/json-ld-types';
import { CardClient as Client, SmartCardProvider as Provider } from '@atlaskit/link-provider';
import { response1 } from '@atlaskit/link-test-helpers';

import {
	Card,
	ElementName,
	FooterBlock,
	MediaPlacement,
	MetadataBlock,
	PreviewBlock,
	SmartLinkPosition,
	SmartLinkSize,
	SnippetBlock,
	TitleBlock,
} from '../../src';

class CustomClient extends Client {
	fetchData(url: string) {
		return Promise.resolve(response1 as JsonLd.Response);
	}
}

export default (): React.JSX.Element => (
	<Provider client={new CustomClient('stg')}>
		<Card appearance="block" url={response1.data.url}>
			<TitleBlock
				size={SmartLinkSize.Medium}
				metadata={[{ name: ElementName.State }, { name: ElementName.AuthorGroup }]}
				position={SmartLinkPosition.Center}
			/>
			<MetadataBlock primary={[{ name: ElementName.CreatedOn }]} />
			<SnippetBlock />
			<PreviewBlock placement={MediaPlacement.Right} />
			<FooterBlock />
		</Card>
		<Card appearance="block" url={response1.data.url}>
			<TitleBlock
				size={SmartLinkSize.Medium}
				metadata={[{ name: ElementName.State }, { name: ElementName.AuthorGroup }]}
				position={SmartLinkPosition.Center}
			/>
			<MetadataBlock primary={[{ name: ElementName.CreatedOn }]} />
			<SnippetBlock />
			<PreviewBlock placement={MediaPlacement.Right} ignoreContainerPadding={true} />
			<FooterBlock />
		</Card>
	</Provider>
);
