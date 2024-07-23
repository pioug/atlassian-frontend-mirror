/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import { type JsonLd } from 'json-ld-types';
import { token } from '@atlaskit/tokens';
import {
	ActionName,
	Card,
	Client,
	ElementName,
	Provider,
	SmartLinkPosition,
	SmartLinkSize,
	SmartLinkTheme,
	TitleBlock,
} from '../../src';
import { response2, response3, response4 } from './example-responses';

const styles = css({
	listStyle: 'none',
	marginTop: token('space.0', '0px'),
	paddingLeft: token('space.0', '0px'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'> li': {
		padding: `${token('space.050', '4px')} ${token('space.100', '8px')}`,
	},
});

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

export default () => (
	<Provider client={new CustomClient('stg')}>
		<ul css={styles}>
			{Object.keys(examples).map((url: string, idx: number) => (
				<li key={idx}>
					<Card
						appearance="inline"
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
				</li>
			))}
		</ul>
	</Provider>
);
