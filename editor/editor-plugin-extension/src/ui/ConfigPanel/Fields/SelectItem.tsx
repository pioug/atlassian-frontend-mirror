/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import Avatar from '@atlaskit/avatar';
import type { Option } from '@atlaskit/editor-common/extensions';
import type { FormatOptionLabelMeta } from '@atlaskit/select';
import { token } from '@atlaskit/tokens';

const itemWrapperStyles = css({
	display: 'flex',
	alignItems: 'center',
	// eslint-disable-next-line @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	small: {
		margin: 0,
		display: 'block',
		color: 'currentColor',
	},
});

const iconWrapperStyles = css({
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
	lineHeight: 1,
});

// Adding 4px instead of 3px, since Design tokens supports space sizes in 2 multiples only Ref: https://atlassian.design/components/tokens/all-tokens
const iconWrapperMenuStyles = css({
	alignSelf: 'flex-start',
	marginTop: token('space.050', '4px'),
});

const getIconSize = (context: 'menu' | 'value', description?: string) => {
	if (context === 'value' || !description) {
		return 'xsmall';
	}

	return 'small';
};

export const formatOptionLabel = (
	{ label, icon, description }: Option,
	{ context }: FormatOptionLabelMeta<Option>,
) => {
	return (
		<div css={itemWrapperStyles}>
			<span css={[iconWrapperStyles, context === 'menu' && iconWrapperMenuStyles]}>
				{typeof icon === 'string' ? (
					<Avatar src={icon} size={getIconSize(context, description)} appearance="square" />
				) : (
					icon
				)}
			</span>
			<div
				style={{ paddingLeft: icon ? token('space.100', '8px') : token('space.0', '0') }}
				data-testid="extension-option-label"
			>
				{label}
				{description && context !== 'value' && <small>{description}</small>}
			</div>
		</div>
	);
};
