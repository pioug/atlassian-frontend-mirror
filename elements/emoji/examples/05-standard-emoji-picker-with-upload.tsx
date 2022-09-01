import React, { FC, useMemo, useState } from 'react';
import { EmojiPicker } from '../src/picker';
import { getEmojiResource } from '@atlaskit/util-data-test/get-emoji-resource';
import { getEmojiResourceWithStandardAndAtlassianEmojis } from '@atlaskit/util-data-test/get-emoji-resource-standard-atlassian';
import { loggedUser } from '@atlaskit/util-data-test/logged-user';
import { onSelection } from '../example-helpers';
import { EmojiProvider } from '../src/resource';
import { IntlProvider } from 'react-intl-next';

const EmojiPickerWithUpload: FC = () => {
  const [siteEmojiEnabled, setSiteEmojiEnabled] = useState(true);

  const emojiProvider = useMemo<Promise<EmojiProvider>>(() => {
    return siteEmojiEnabled
      ? getEmojiResource({
          uploadSupported: true,
          currentUser: { id: loggedUser },
        })
      : getEmojiResourceWithStandardAndAtlassianEmojis({
          uploadSupported: true,
          currentUser: { id: loggedUser },
        });
  }, [siteEmojiEnabled]);

  return (
    <IntlProvider locale="en">
      <div style={{ padding: '10px' }}>
        <EmojiPicker emojiProvider={emojiProvider} onSelection={onSelection} />

        <button onClick={() => setSiteEmojiEnabled(true)}>
          EmojiProvider with Site emoji
        </button>
        <button onClick={() => setSiteEmojiEnabled(false)}>
          EmojiProvider without Site emoji
        </button>
      </div>
    </IntlProvider>
  );
};

export default EmojiPickerWithUpload;
