import React from 'react';
// These imports are not included in the manifest file to avoid circular package dependencies blocking our Typescript and bundling tooling
// eslint-disable-next-line import/no-extraneous-dependencies
import { getEmojis } from '@atlaskit/util-data-test/get-emojis';
import { setBooleanFeatureFlagResolver } from '@atlaskit/platform-feature-flags';
import ToneSelector from '../src/components/common/ToneSelector';
import filters from '../src/util/filters';
import { onToneSelected } from '../example-helpers';
import { DEFAULT_TONE } from '../src/util/constants';
import { IntlProvider } from 'react-intl-next';

const FLAG = 'platform_suppression_removal_emoji_radio_a11y';

const toneEmoji = filters.toneEmoji(getEmojis());

const containerStyles = {
	display: 'flex',
	gap: '48px',
	alignItems: 'flex-start',
	padding: '16px',
};

const columnStyles = {
	display: 'flex',
	flexDirection: 'column' as const,
	gap: '8px',
};

const labelStyles = {
	fontSize: '12px',
	fontWeight: 600,
	color: '#626F86',
	textTransform: 'uppercase' as const,
	letterSpacing: '0.04em',
};

function ToneSelectorWithFlag({ flag }: { flag: boolean }): React.JSX.Element {
	setBooleanFeatureFlagResolver((key) => (key === FLAG ? flag : false));
	return (
		<ToneSelector
			emoji={toneEmoji}
			onToneSelected={onToneSelected}
			selectedTone={DEFAULT_TONE}
			isVisible
		/>
	);
}

export default function Example(): React.JSX.Element {
	return (
		<IntlProvider locale="en">
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
			<div style={containerStyles}>
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
				<div style={columnStyles}>
					{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
					<span style={labelStyles}>Flag off (original)</span>
					<ToneSelectorWithFlag flag={false} />
				</div>
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
				<div style={columnStyles}>
					{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
					<span style={labelStyles}>Flag on (new a11y)</span>
					<ToneSelectorWithFlag flag={true} />
				</div>
			</div>
		</IntlProvider>
	);
}
