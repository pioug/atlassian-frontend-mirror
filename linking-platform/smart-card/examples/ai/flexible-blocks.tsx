import React from 'react';

import { SmartCardProvider } from '@atlaskit/link-provider/smart-card-provider';
import { Block } from '@atlaskit/smart-card/block';
import { Card } from '@atlaskit/smart-card/card/lazy';
import { FooterBlock } from '@atlaskit/smart-card/footer-block';
import { MetadataBlock } from '@atlaskit/smart-card/metadata-block';
import { PreviewBlock } from '@atlaskit/smart-card/preview-block';
import { SnippetBlock } from '@atlaskit/smart-card/snippet-block';
import { TitleBlock } from '@atlaskit/smart-card/title-block';

type ExampleProps = { client: React.ComponentProps<typeof SmartCardProvider>['client'] };

/** The host provides the resolver; the example URL is illustrative. */
export default function FlexibleBlocksExample({ client }: ExampleProps): React.JSX.Element {
	return (
		<SmartCardProvider client={client}>
			<Card appearance="block" url="https://example.atlassian.net/browse/ENG-1">
				<TitleBlock />
				<MetadataBlock />
				<PreviewBlock />
				<SnippetBlock />
				<Block>Host-owned supplemental content</Block>
				<FooterBlock />
			</Card>
		</SmartCardProvider>
	);
}
