import React from 'react';

import { IntlProvider } from 'react-intl';

// These imports are not included in the manifest file to avoid circular package dependencies blocking our Typescript and bundling tooling
// eslint-disable-next-line import/no-extraneous-dependencies
import { getEmojis } from '@atlaskit/util-data-test/get-emojis';

import { onToneSelected } from '../example-helpers/on-tone-selected';
import ToneSelector from '../src/components/common/ToneSelector';
import { DEFAULT_TONE } from '../src/util/constants';
import filters from '../src/util/filters';

const toneEmoji = filters.toneEmoji(getEmojis());

export default function Example(): React.JSX.Element {
	return (
		<IntlProvider locale="en">
			<ToneSelector
				emoji={toneEmoji}
				onToneSelected={onToneSelected}
				selectedTone={DEFAULT_TONE}
				isVisible
			/>
		</IntlProvider>
	);
}
