import React from 'react';
import { md, Example, code, Props } from '@atlaskit/docs';
import ResourcedEmojiExample from '../examples/23-optimistic-emoji';

const ResourcedEmojiSource = require('!!raw-loader!../examples/23-optimistic-emoji');
const ResourcedEmojiProps = require('!!extract-react-types-loader!../src/components/common/ResourcedEmojiComponent');

export default md`
  ## Usage

  Import the component in your React app as follows:

  ${code`
  import { ResourcedEmoji } from '@atlaskit/emoji';
  import { EmojiResource, EmojiResourceConfig } from '@atlaskit/emoji/resource';

  const config: EmojiResourceConfig = {
    singleEmojiApi: {
      getUrl: (emojiId: string) => 'https://emoji-example/emoji/site-id/emojiId',
      securityProvider: () => ({
        headers: {
          'User-Context': '{{token}}',
          Authorization: 'Bearer {{token}}',
        },
      })
    },
    optimisticImageApi: {
      getUrl: (emojiId: string) => 'https://emoji-example/emoji/site-id/emojiId/path',
      securityProvider: () => ({
        headers: {
          'User-Context': '{{token}}',
          Authorization: 'Bearer {{token}}',
        },
      })
    },
    providers: [
      {
        url: 'https://emoji-example/emoji/standard',
      },
      {
        url: 'https://emoji-example/emoji/site-id/site',
        securityProvider: () => ({
          headers: {
            Authorization: 'Bearer {{token}}',
          },
        }),
      },
    ],
  }

  const emojiProvider = new EmojiResource(config);
  const emojiId = { shortName: ':grimacing:', id: '1f603' };

  ReactDOM.render(
    <ResourcedEmoji
      emojiId={emojiId}
      emojiProvider={emojiProvider}
      optimistic
      optimisticImageURL={emojiProvider.getOptimisticImageURL(emojiId)}
    />,
    container,
  );`}

  ${(
		<Example
			packageName="@atlaskit/emoji"
			Component={ResourcedEmojiExample}
			title="Resourced Emoji"
			source={ResourcedEmojiSource}
		/>
	)}

  ${(<Props props={ResourcedEmojiProps} />)}
`;
