/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import { type JsonLd } from 'json-ld-types';
import { token } from '@atlaskit/tokens';
import {
	Card,
	Client,
	ElementName,
	MetadataBlock,
	Provider,
	SmartLinkSize,
	TitleBlock,
} from '../../src';
import { response1, response2, response3 } from './example-responses';

const styles = css({
	listStyle: 'none',
	paddingLeft: 0,
	display: 'flex',
	alignItems: 'stretch',
	justifyContent: 'center',
	gap: token('space.100', '8px'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'> li': {
		margin: 0,
		width: '190px',
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

export default () => (
	<Provider client={new CustomClient('stg')}>
		<ul css={styles}>
			{Object.keys(examples).map((url: string, idx: number) => (
				<li key={idx}>
					<Card
						appearance="block"
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
				</li>
			))}
		</ul>
	</Provider>
);
