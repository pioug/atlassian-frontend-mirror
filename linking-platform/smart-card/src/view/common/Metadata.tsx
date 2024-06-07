/** @jsx jsx */
import { jsx } from '@emotion/react';
import Tooltip from '@atlaskit/tooltip';

import { N300 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

export interface MetadataProps {
	/* Text to be displayed at the bottom of a card - most often the provider name. */
	text: string;
	/* Icon to be displayed at the bottom of a card - most often the provider's logo. */
	icon?: React.ReactNode;
	iconUrl?: string;
	tooltip?: string;
}

export const Metadata = ({ text, icon, iconUrl, tooltip }: MetadataProps) => {
	let metadataIcon = icon || null;

	if (!metadataIcon && iconUrl) {
		metadataIcon = (
			<img
				src={iconUrl}
				css={{
					width: token('space.100', '8px'),
					height: token('space.100', '8px'),
				}}
			/>
		);
	}

	const metadata = (
		<div
			css={{
				display: 'flex',
				alignItems: 'center',
				marginRight: token('space.050', '4px'),
			}}
		>
			{metadataIcon}
			<span
				css={{
					fontSize: token('space.150', '12px'),
					color: `${token('color.text.subtlest', N300)}`,
					marginRight: token('space.050', '4px'),
					marginLeft: token('space.025', '2px'),
				}}
			>
				{text}
			</span>
		</div>
	);
	if (tooltip) {
		return <Tooltip content={tooltip}>{metadata}</Tooltip>;
	}

	return metadata;
};
