import React from 'react';

import { LinkSearchListItem, type LinkSearchListItemProps } from './index';

const NOOP = () => {};

const createExample = (props: Partial<LinkSearchListItemProps> = {}) => {
	return function Example() {
		return (
			<div
				style={{
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					maxWidth: 400,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					['--link-picker-padding-left' as string]: '16px',
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					['--link-picker-padding-right' as string]: '16px',
				}}
			>
				<LinkSearchListItem
					item={{
						objectId: 'id',
						name: 'Link Suggestion',
						url: 'https://atlassian.com',
						icon: '',
						lastViewedDate: new Date(Date.now() - 60 * 1000 * 60 * 24 * 5),
						iconAlt: '',
						container: 'Some Space',
					}}
					selected={false}
					active={false}
					onSelect={NOOP}
					onKeyDown={NOOP}
					onFocus={NOOP}
					{...props}
				/>
			</div>
		);
	};
};

export const DefaultExample = createExample();

export const SelectedExample = createExample({
	selected: true,
});
