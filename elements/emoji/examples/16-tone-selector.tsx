import React from 'react';
import ToneSelector from '../src/components/common/ToneSelector';
import filters from '../src/util/filters';
import { onToneSelected, getEmojis } from '../example-helpers';

const toneEmoji = filters.toneEmoji(getEmojis());

export default function Example() {
  return <ToneSelector emoji={toneEmoji} onToneSelected={onToneSelected} />;
}
