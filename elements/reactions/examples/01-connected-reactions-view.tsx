import React from 'react';
import { EmojiProvider } from '@atlaskit/emoji/resource';
import { getEmojiResource } from '@atlaskit/util-data-test/get-emoji-resource';
import { ConnectedReactionsView, StorePropInput } from '../src';
import {
  ExampleWrapper,
  Example,
  Constants as ExampleConstants,
} from './utils';
import { constants } from '../src/shared';

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

          <hr />

          <strong style={{ fontSize: '14px', textDecoration: 'underline' }}>
            "allowAllEmojis" prop - Show the "more emoji" selector icon for
            choosing emoji icons beyond the default list of emojis (defaults to
            constants.DEFAULT_REACTION_EMOJI_IDS)
          </strong>

          {/* Example 2 */}
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

          {/* Example 3 */}
          <Example
            title={
              '"ConnectedReactionsView" with allowAllEmojis flag set is not provided or false'
            }
            body={
              <ConnectedReactionsView
                store={store}
                containerAri={`${ExampleConstants.ContainerAriPrefix}1`}
                ari={`${ExampleConstants.AriPrefix}3`}
                emojiProvider={getEmojiResource() as Promise<EmojiProvider>}
              />
            }
          />

          <hr />

          <strong style={{ fontSize: '14px', textDecoration: 'underline' }}>
            "pickerQuickReactionEmojiIds" prop - emojis shown for user to select
            from the picker popup when the reaction add button is clicked
          </strong>

          {/* Example 4 */}
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
                pickerQuickReactionEmojiIds={[
                  { id: '1f44d', shortName: ':thumbsup:' },
                ]}
              />
            }
          />

          {/* Example 5 */}
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

          <hr />

          <strong style={{ fontSize: '14px', textDecoration: 'underline' }}>
            "quickReactionEmojiIds" prop - emojis that will be shown in the the
            primary view even if the reaction count is zero and no emojis were
            created on the post/reply yet
          </strong>

          {/* Example 6 */}
          <Example
            title={
              '"ConnectedReactionsView" with quickReactionEmojiIds array without any emoji (undefined or empty array) added to the container|ari item'
            }
            body={
              <ConnectedReactionsView
                store={store}
                containerAri={`${ExampleConstants.ContainerAriPrefix}1`}
                ari={`${ExampleConstants.AriPrefix}6`}
                emojiProvider={getEmojiResource() as Promise<EmojiProvider>}
                allowAllEmojis
                pickerQuickReactionEmojiIds={[]}
                quickReactionEmojiIds={undefined}
              />
            }
          />

          {/* Example 7 */}
          <Example
            title={
              '"ConnectedReactionsView" with quickReactionEmojiIds array with some quick emoji icons selections to choose'
            }
            body={
              <ConnectedReactionsView
                store={store}
                containerAri={`${ExampleConstants.ContainerAriPrefix}1`}
                ari={`${ExampleConstants.AriPrefix}7`}
                emojiProvider={getEmojiResource() as Promise<EmojiProvider>}
                quickReactionEmojiIds={constants.DefaultReactions.slice(
                  3,
                  5,
                ).map((item) => item.id ?? '')}
              />
            }
          />
        </>
      )}
    </ExampleWrapper>
  );
};
