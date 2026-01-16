import React from 'react';
import { md, Example, code, Props } from '@atlaskit/docs';
import EmojiPickerExample from '../examples/05-standard-emoji-picker-with-upload';

const EmojiPickerSource = require('!!raw-loader!../examples/05-standard-emoji-picker-with-upload');
const EmojiPickerProps = require('!!extract-react-types-loader!../src/components/picker/EmojiPickerComponent');

const _default_1: any = md`
  ## Usage

  Import the component in your React app as follows:

  ${code`
  import EmojiPicker from '@atlaskit/emoji/picker';
  import { EmojiResource, EmojiResourceConfig } from '@atlaskit/emoji/resource';

  const config: EmojiResourceConfig = {
    providers: [
      {
        url: 'https://emoji-example/emoji/standard',
      },
      {
        url: 'https://emoji-example/emoji/site-id/site',
        securityProvider: () => ({
          headers: {
            Authorization: 'Bearer token',
          },
        }),
      },
    ],
  }

  const emojiProvider = new EmojiResource(config);

  ReactDOM.render(
    <EmojiPicker
      emojiProvider={emojiProvider}
      onSelection={emoji => {
        /* do something */
      }}
    />,
    container,
  );
  `}

  ${(
		<Example
			packageName="@atlaskit/emoji"
			Component={EmojiPickerExample}
			title="Emoji Picker"
			source={EmojiPickerSource}
		/>
	)}

  ${(<Props props={EmojiPickerProps} />)}
`;
export default _default_1;
