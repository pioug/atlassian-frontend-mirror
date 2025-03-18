import React from 'react';
// These imports are not included in the manifest file to avoid circular package dependencies blocking our Typescript and bundling tooling
// eslint-disable-next-line import/no-extraneous-dependencies
import { getEmojis } from '@atlaskit/util-data-test/get-emojis';
import { default as EmotionToneSelector } from '../src/components/common/ToneSelector';
import { default as CompiledToneSelector } from '../src/components/compiled/common/ToneSelector';
import filters from '../src/util/filters';
import { onToneSelected } from '../example-helpers';
import { DEFAULT_TONE } from '../src/util/constants';
import { IntlProvider } from 'react-intl-next';

import { fg } from '@atlaskit/platform-feature-flags';

const toneEmoji = filters.toneEmoji(getEmojis());

const selectorWrapper = {
	margin: '3px',
};

export default function Example() {
	return (
		<IntlProvider locale="en">
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
			<div style={selectorWrapper}>
				{fg('platform_editor_css_migrate_emoji') ? (
					<CompiledToneSelector
						emoji={toneEmoji}
						onToneSelected={onToneSelected}
						selectedTone={DEFAULT_TONE}
						isVisible
					/>
				) : (
					<EmotionToneSelector
						emoji={toneEmoji}
						onToneSelected={onToneSelected}
						selectedTone={DEFAULT_TONE}
						isVisible
					/>
				)}
			</div>
		</IntlProvider>
	);
}
