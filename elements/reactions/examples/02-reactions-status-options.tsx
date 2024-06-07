import React from 'react';
import { IntlProvider } from 'react-intl-next';
import { type EmojiProvider } from '@atlaskit/emoji/resource';
import { getEmojiResource } from '@atlaskit/util-data-test/get-emoji-resource';
import { Reactions } from '../src';
import { simpleMockData } from '../src/MockReactionsClient';
import { Example, Constants as ExampleConstants } from './utils';
import { ReactionStatus } from '../src/types';

export default () => {
	const containerAri = `${ExampleConstants.ContainerAriPrefix}1`;
	const ari = `${ExampleConstants.AriPrefix}1`;
	const emojiProvider = getEmojiResource() as Promise<EmojiProvider>;
	const reactions = simpleMockData[`${containerAri}|${ari}`];
	const loadReaction = () => {};
	const onSelection = () => {};
	const onReactionClick = () => {};

	return (
		<>
			<p>
				<strong>
					These examples show different statuses effect when rendering "Reactions" component
					directly
				</strong>
			</p>

			{/* Example 1 */}
			<Example
				title={'Rendering "Reactions" with status of disabled'}
				body={
					<IntlProvider locale="en">
						<Reactions
							emojiProvider={emojiProvider}
							reactions={[]}
							status={ReactionStatus.disabled}
							loadReaction={loadReaction}
							onSelection={onSelection}
							onReactionClick={onReactionClick}
							allowAllEmojis
						/>
					</IntlProvider>
				}
			/>
			<hr />

			{/* Example 2 */}
			<Example
				title={'Rendering "Reactions" with status of notLoaded'}
				body={
					<IntlProvider locale="en">
						<Reactions
							emojiProvider={emojiProvider}
							reactions={[]}
							status={ReactionStatus.notLoaded}
							loadReaction={loadReaction}
							onSelection={onSelection}
							onReactionClick={onReactionClick}
							allowAllEmojis
						/>
					</IntlProvider>
				}
			/>

			<hr />

			{/* Example 3 */}
			<Example
				title={'Rendering "Reactions" with status of loading'}
				body={
					<IntlProvider locale="en">
						<Reactions
							emojiProvider={emojiProvider}
							reactions={[]}
							status={ReactionStatus.loading}
							loadReaction={loadReaction}
							onSelection={onSelection}
							onReactionClick={onReactionClick}
							allowAllEmojis
						/>
					</IntlProvider>
				}
			/>

			<hr />

			{/* Example 4 */}
			<Example
				title={'Rendering "Reactions" with status of ready'}
				body={
					<IntlProvider locale="en">
						<Reactions
							emojiProvider={emojiProvider}
							reactions={reactions}
							status={ReactionStatus.ready}
							loadReaction={loadReaction}
							onSelection={onSelection}
							onReactionClick={onReactionClick}
							getReactionDetails={(emojiId) => console.log('get reaction details of ', emojiId)}
							onReactionHover={(emojiId) => console.log('[deprecated] reaction hovered', emojiId)}
							allowAllEmojis
						/>
					</IntlProvider>
				}
			/>

			<hr />

			{/* Example 5 */}
			<Example
				title={'Rendering "Reactions" with status of error and optional error message'}
				body={
					<IntlProvider locale="en">
						<Reactions
							emojiProvider={emojiProvider}
							reactions={[]}
							status={ReactionStatus.error}
							loadReaction={loadReaction}
							onSelection={onSelection}
							onReactionClick={onReactionClick}
							allowAllEmojis
							errorMessage={'No reactions could be loaded'}
						/>
					</IntlProvider>
				}
			/>
		</>
	);
};
