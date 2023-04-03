import React from 'react';
import { getEmojis } from '@atlaskit/util-data-test/get-emojis';
import ToneSelector from '../src/components/common/ToneSelector';
import filters from '../src/util/filters';
import { onToneSelected } from '../example-helpers';
import { DEFAULT_TONE } from '../src/util/constants';
import { IntlProvider } from 'react-intl-next';

const toneEmoji = filters.toneEmoji(getEmojis());

const selectorWrapper = {
  margin: '3px',
};

export default function Example() {
  return (
    <IntlProvider locale="en">
      <div style={selectorWrapper}>
        <ToneSelector
          emoji={toneEmoji}
          onToneSelected={onToneSelected}
          selectedTone={DEFAULT_TONE}
          isVisible
        />
      </div>
    </IntlProvider>
  );
}
