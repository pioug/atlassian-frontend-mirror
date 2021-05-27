import React from 'react';
import { getEmojis } from '@atlaskit/util-data-test/get-emojis';
import ToneSelector from '../src/components/common/ToneSelector';
import filters from '../src/util/filters';
import { onToneSelected } from '../example-helpers';

const toneEmoji = filters.toneEmoji(getEmojis());

export default function Example() {
  return <ToneSelector emoji={toneEmoji} onToneSelected={onToneSelected} />;
}
