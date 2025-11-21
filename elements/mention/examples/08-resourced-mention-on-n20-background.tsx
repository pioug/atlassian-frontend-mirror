import AnalyticsListener from '@atlaskit/analytics-next/AnalyticsListener';
import type UIAnalyticsEvent from '@atlaskit/analytics-next/UIAnalyticsEvent';
import { N20 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
import React from 'react';
import { onMentionEvent } from '../example-helpers/index';
import { mockMentionData as mentionData } from '../src/__tests__/unit/_test-helpers';
import debug from '../src/util/logger';
// These imports are not included in the manifest file to avoid circular package dependencies blocking our Typescript and bundling tooling
// eslint-disable-next-line import/no-extraneous-dependencies
import { mentionResourceProviderWithResolver } from '@atlaskit/util-data-test/mention-story-data';
import { IntlProvider } from 'react-intl-next';
import { ELEMENTS_CHANNEL } from '../src/_constants';
import ResourcedMention from '../src/components/Mention/ResourcedMention';

const style = {
	backgroundColor: token('elevation.surface.sunken', N20),
	width: '100%',
	padding: `${token('space.250', '20px')}`,
};

const padding = { padding: '10px' };

const listenerHandler = (e: UIAnalyticsEvent) => {
	debug('Analytics Next handler - payload:', e.payload, ' context: ', e.context);
};

export default function Example(): React.JSX.Element {
	const mentionProvider = Promise.resolve(mentionResourceProviderWithResolver);

	return (
		<IntlProvider locale="en">
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
			<div style={style}>
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
				<div style={padding}>
					<AnalyticsListener onEvent={listenerHandler} channel={ELEMENTS_CHANNEL}>
						<ResourcedMention
							{...mentionData}
							accessLevel={'CONTAINER'}
							mentionProvider={mentionProvider}
							onClick={onMentionEvent}
							onMouseEnter={onMentionEvent}
							onMouseLeave={onMentionEvent}
						/>
					</AnalyticsListener>
				</div>
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
				<div style={padding}>
					<ResourcedMention
						id="oscar"
						text="@Oscar Wallhult"
						mentionProvider={mentionProvider}
						onClick={onMentionEvent}
						onMouseEnter={onMentionEvent}
						onMouseLeave={onMentionEvent}
					/>
				</div>
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
				<div style={padding}>
					<ResourcedMention
						{...mentionData}
						accessLevel={'NONE'}
						mentionProvider={mentionProvider}
						onClick={onMentionEvent}
						onMouseEnter={onMentionEvent}
						onMouseLeave={onMentionEvent}
					/>
				</div>
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
				<div style={padding}>
					<ResourcedMention
						{...mentionData}
						text=""
						mentionProvider={mentionProvider}
						onClick={onMentionEvent}
						onMouseEnter={onMentionEvent}
						onMouseLeave={onMentionEvent}
					/>
				</div>
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
				<div style={padding}>
					<ResourcedMention
						id="unknown"
						text=""
						mentionProvider={mentionProvider}
						onClick={onMentionEvent}
						onMouseEnter={onMentionEvent}
						onMouseLeave={onMentionEvent}
					/>
				</div>
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
				<div style={padding}>
					<ResourcedMention
						id="service_error"
						text=""
						mentionProvider={mentionProvider}
						onClick={onMentionEvent}
						onMouseEnter={onMentionEvent}
						onMouseLeave={onMentionEvent}
					/>
				</div>
			</div>
		</IntlProvider>
	);
}
