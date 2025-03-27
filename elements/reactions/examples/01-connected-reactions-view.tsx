import React from 'react';
import { type EmojiProvider } from '@atlaskit/emoji/resource';
import { getEmojiResource } from '@atlaskit/util-data-test/get-emoji-resource';
import { ConnectedReactionsView, type StorePropInput } from '../src';
import { ExampleWrapper, Example, Constants as ExampleConstants } from './utils';
import { DefaultReactions } from '../src/shared/constants';

export default () => {
	return (
		<ExampleWrapper>
			{(store: StorePropInput) => (
				<>
					{/* Example 1 */}
					<Example
						title={
							'"ConnectedReactionsView" with a built in memory store and different emoji populated and several are selected.'
						}
						body={
							<ConnectedReactionsView
								store={store}
								containerAri={`${ExampleConstants.ContainerAriPrefix}1`}
								ari={`${ExampleConstants.AriPrefix}1`}
								emojiProvider={getEmojiResource() as Promise<EmojiProvider>}
							/>
						}
					/>

					<hr role="presentation" />

					{/* Example 2 */}
					<Example
						title={'"ConnectedReactionsView" with miniMode for add reaction button'}
						body={
							<ConnectedReactionsView
								store={store}
								containerAri={`${ExampleConstants.ContainerAriPrefix}1`}
								ari={`${ExampleConstants.AriPrefix}1`}
								emojiProvider={getEmojiResource() as Promise<EmojiProvider>}
								allowAllEmojis
								miniMode
							/>
						}
					/>

					<hr role="presentation" />

					<strong
						style={{
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							fontSize: '14px',
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							marginLeft: '10px',
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							textDecoration: 'underline',
						}}
					>
						"allowAllEmojis" prop - Show the "more emoji" selector icon for choosing emoji icons
						beyond the default list of emojis (defaults to DEFAULT_REACTION_EMOJI_IDS)
					</strong>

					{/* Example 3 */}
					<Example
						title={
							'"ConnectedReactionsView" with allowAllEmojis prop set to true (Select custom emojis from the picker instead of just a pre-defined list)'
						}
						body={
							<ConnectedReactionsView
								store={store}
								containerAri={`${ExampleConstants.ContainerAriPrefix}1`}
								ari={`${ExampleConstants.AriPrefix}2`}
								emojiProvider={getEmojiResource() as Promise<EmojiProvider>}
								allowAllEmojis
							/>
						}
					/>

					{/* Example 4 */}
					<Example
						title={'"ConnectedReactionsView" with allowAllEmojis flag set is not provided or false'}
						body={
							<ConnectedReactionsView
								store={store}
								containerAri={`${ExampleConstants.ContainerAriPrefix}1`}
								ari={`${ExampleConstants.AriPrefix}3`}
								emojiProvider={getEmojiResource() as Promise<EmojiProvider>}
							/>
						}
					/>

					<hr role="presentation" />

					<strong
						style={{
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							fontSize: '14px',
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							marginLeft: '10px',
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							textDecoration: 'underline',
						}}
					>
						"pickerQuickReactionEmojiIds" prop - emojis shown for user to select from the picker
						popup when the reaction add button is clicked
					</strong>

					{/* Example 5 */}
					<Example
						title={
							'"ConnectedReactionsView" with non-empty pickerQuickReactionEmojiIds array populated a single item'
						}
						body={
							<ConnectedReactionsView
								store={store}
								containerAri={`${ExampleConstants.ContainerAriPrefix}1`}
								ari={`${ExampleConstants.AriPrefix}4`}
								emojiProvider={getEmojiResource() as Promise<EmojiProvider>}
								allowAllEmojis
								pickerQuickReactionEmojiIds={[{ id: '1f44d', shortName: ':thumbsup:' }]}
							/>
						}
					/>

					{/* Example 6 */}
					<Example
						title={
							'"ConnectedReactionsView" with empty pickerQuickReactionEmojiIds array (shows the full picker selector)'
						}
						body={
							<ConnectedReactionsView
								store={store}
								containerAri={`${ExampleConstants.ContainerAriPrefix}1`}
								ari={`${ExampleConstants.AriPrefix}5`}
								emojiProvider={getEmojiResource() as Promise<EmojiProvider>}
								allowAllEmojis
								pickerQuickReactionEmojiIds={[]}
							/>
						}
					/>

					<hr role="presentation" />

					<strong
						style={{
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							fontSize: '14px',
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							marginLeft: '10px',
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							textDecoration: 'underline',
						}}
					>
						"quickReactionEmojis" prop - emojis that will be shown in the the primary view even if
						the reaction count is zero and no emojis were created on the post/reply yet
					</strong>

					{/* Example 7 */}
					<Example
						title={
							'"ConnectedReactionsView" with quickReactionEmojis array without any emoji (undefined or empty array) added to the container|ari item'
						}
						body={
							<ConnectedReactionsView
								store={store}
								containerAri={`${ExampleConstants.ContainerAriPrefix}1`}
								ari={`${ExampleConstants.AriPrefix}6`}
								emojiProvider={getEmojiResource() as Promise<EmojiProvider>}
								allowAllEmojis
								pickerQuickReactionEmojiIds={[]}
							/>
						}
					/>

					{/* Example 8 */}
					<Example
						title={
							'"ConnectedReactionsView" with quickReactionEmojis array with some quick emoji icons selections to choose'
						}
						body={
							<ConnectedReactionsView
								store={store}
								containerAri={`${ExampleConstants.ContainerAriPrefix}1`}
								ari={`${ExampleConstants.AriPrefix}7`}
								emojiProvider={getEmojiResource() as Promise<EmojiProvider>}
								quickReactionEmojis={{
									ari: `${ExampleConstants.AriPrefix}7`,
									containerAri: `${ExampleConstants.ContainerAriPrefix}1`,
									emojiIds: DefaultReactions.slice(3, 5).map((item) => item.id ?? ''),
								}}
							/>
						}
					/>
					{/* Example 9 */}
					<Example
						title={
							'"ConnectedReactionsView" with large emoji picker, emojiPickerSize could be small, medium or large (default to medium).'
						}
						body={
							<ConnectedReactionsView
								store={store}
								containerAri={`${ExampleConstants.ContainerAriPrefix}1`}
								ari={`${ExampleConstants.AriPrefix}7`}
								emojiProvider={getEmojiResource() as Promise<EmojiProvider>}
								emojiPickerSize="large"
								allowAllEmojis
							/>
						}
					/>

					<hr role="presentation" />

					<strong
						style={{
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							fontSize: '14px',
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							marginLeft: '10px',
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							textDecoration: 'underline',
						}}
					>
						"allowUserDialog" prop - enables a link within the reaction tooltip to show a full user
						list associated with all reactions
					</strong>

					{/* Example 10 */}
					<Example
						title={'Connected reactions with reactions dialog enabled'}
						body={
							<ConnectedReactionsView
								store={store}
								containerAri={`${ExampleConstants.ContainerAriPrefix}1`}
								ari={`${ExampleConstants.AriPrefix}1`}
								emojiProvider={getEmojiResource() as Promise<EmojiProvider>}
								allowUserDialog
							/>
						}
					/>

					<hr role="presentation" />

					<strong
						style={{
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							fontSize: '14px',
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							marginLeft: '10px',
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							textDecoration: 'underline',
						}}
					>
						"allowUserDialog" prop with callbacks - enables a link within the reaction tooltip to
						show a full user list associated with all reactions with event callbacks shown
					</strong>

					{/* Example 11 */}
					<Example
						title={
							'Connected reactions with reactions dialog enabled and callbacks shown as alert dialogs'
						}
						body={
							<ConnectedReactionsView
								store={store}
								containerAri={`${ExampleConstants.ContainerAriPrefix}1`}
								ari={`${ExampleConstants.AriPrefix}1`}
								emojiProvider={getEmojiResource() as Promise<EmojiProvider>}
								allowUserDialog
								onDialogCloseCallback={(e, event) => {
									alert(`onDialogCloseCallback event`);
								}}
								onDialogOpenCallback={(emojiId, source) => {
									alert(`onDialogOpenCallback event with emojiId = ${emojiId}, source = ${source}`);
								}}
								onDialogSelectReactionCallback={(emojiId: string) => {
									alert(`onDialogSelectReactionCallback event with emojiId = ${emojiId}`);
								}}
							/>
						}
					/>

					<hr role="presentation" />

					{/* Example 11 */}
					<Example
						title={
							'"ConnectedReactionsView" with a built in memory store and particle emojis enabled.'
						}
						body={
							<ConnectedReactionsView
								store={store}
								containerAri={`${ExampleConstants.ContainerAriPrefix}1`}
								ari={`${ExampleConstants.AriPrefix}1`}
								emojiProvider={getEmojiResource() as Promise<EmojiProvider>}
								particleEffectByEmojiEnabled
							/>
						}
					/>

					{/* Example 12 */}
					<Example
						title={'"ConnectedReactionsView" with isViewOnly'}
						body={
							<ConnectedReactionsView
								store={store}
								containerAri={`${ExampleConstants.ContainerAriPrefix}1`}
								ari={`${ExampleConstants.AriPrefix}1`}
								emojiProvider={getEmojiResource() as Promise<EmojiProvider>}
								isViewOnly
							/>
						}
					/>
				</>
			)}
		</ExampleWrapper>
	);
};
