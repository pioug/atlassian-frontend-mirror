import React from 'react';

import { IconButton, LinkIconButton } from '@atlaskit/button/new';
import StarFilledIcon from '@atlaskit/icon/glyph/star-filled';
import { Inline, xcss } from '@atlaskit/primitives';

const wrapperStyles = xcss({
	padding: 'space.200',
});

export default function IconButtonExample() {
	return (
		<Inline space="space.200" xcss={wrapperStyles}>
			<IconButton
				label="Label is also used for tooltip"
				icon={StarFilledIcon}
				isTooltipDisabled={false}
				testId="default"
			/>
			<IconButton
				label="Button"
				icon={StarFilledIcon}
				tooltip={{ content: 'Label can be overridden' }}
				isTooltipDisabled={false}
				testId="label-overridden"
			/>
			<IconButton
				label="Tooltip is disabled"
				icon={StarFilledIcon}
				isTooltipDisabled
				testId="disabled"
			/>
			<IconButton
				label="Tooltip position"
				icon={StarFilledIcon}
				isTooltipDisabled={false}
				tooltip={{ position: 'right' }}
				testId="position-right"
			/>
			<IconButton
				label="Overrides"
				icon={(iconProps) => <StarFilledIcon {...iconProps} size="small" />}
				testId="deprecation"
			/>
			<LinkIconButton
				icon={StarFilledIcon}
				label="Link icon button"
				href="https://atlassian.design"
				isTooltipDisabled={false}
				testId="link-icon-button"
			/>
		</Inline>
	);
}
