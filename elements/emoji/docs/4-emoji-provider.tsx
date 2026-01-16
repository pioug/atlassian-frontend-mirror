import React from 'react';
import { md, code } from '@atlaskit/docs';
import SectionMessage from '@atlaskit/section-message';
import { Text } from '@atlaskit/primitives/compiled';

const _default_1: any = md`
Emoji provider mainly controls what type of emojis you want to support, how to resolve emojis, and how to upload custom emojis if enabled.

This is a basic example of emoji provider, supporting standard, atlassian, and site emojis:

${code`
  const emojiProvider = new EmojiResource({
    providers: [
      {
        url: '/gateway/emoji/standard',
      },
      {
        url: '/gateway/emoji/atlassian',
      },
      {
        url: '/gateway/emoji/{cloudId}/site',
        securityProvider: () => ({ headers: { Authorization: 'Bearer token' }}), // not needed if session token cookie is available.
      },
    ],
    allowUpload: true,
    currentUser: { id: { uid } }
  });`}

  ${(
		<>
			<br />
			<SectionMessage
				appearance="warning"
				title="There should be only one instance of EmojiResource in your application"
			>
				<Text as="p">Make sure EmojiResource is initialised only once.</Text>
			</SectionMessage>
		</>
	)}

The emoji provider plays a vital role to glue with our backend emoji service. Emoji metadata is fetched based on the url defined in providers array.
After a successful fetch the emoji resource holds emoji data for rendering emoji in picker, single emoji or the typeahead component.
Uploading and rendering site specific emojis is only available for Atlassian services.

Initialising EmojiResource doesn't fetch emoji data on initialization. If EmojiResource is being passed into ResourcedEmoji, EmojiPicker or Typeahead no further action is required.
Emoji meta data will be fetched on first component render. If EmojiResource is being used outside of the context of the above components, fetching meta data requires to be triggered manually.

${code`
  const emojiProvider = new EmojiResource(emojiConfig);
  emojiProvider.fetchEmojiProvider();
`}

### Configuration options

${code`
  interface EmojiResourceConfig {
    /**
     * The service configuration for remotely recording emoji selections.
     * A post will be performed to this URL with the EmojiId as the body.
     */
    recordConfig?: ServiceConfig;

    /**
     * This defines the different providers. Later providers will override earlier
     * providers when performing shortName based look up.
     */
    providers: ServiceConfig[];

    /**
     * Must be set to true to enable upload support in the emoji components.
     *
     * Can be used for the restriction of the upload UI based on permissions, or feature flags.
     *
     * Note this also requires that other conditions are met (for example, one of the providers
     * must support upload for the UploadingEmojiResource implementation of UploadingEmojiProvider).
     */
    allowUpload?: boolean;

    /**
     * Logged user in the Product.
     */
    currentUser?: User;

    /**
     * This is specifically used for fetching a meta information of a single emoji.
     * Useful for when rendering a single or a subset of emojis on a page that does not require the
     * whole provider list to be downloaded.
     */
    singleEmojiApi?: SingleEmojiApiLoaderConfig;

    /**
     * Renders an image while the provider is being downloaded to reduce the time
     * the user is being presented with a placeholder
     */
    optimisticImageApi?: OptimisticImageApiLoaderConfig;
  }
`}

`;
export default _default_1;
