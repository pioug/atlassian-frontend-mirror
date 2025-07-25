/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';

import { IconButton } from '@atlaskit/button/new';
import type { FieldDefinition } from '@atlaskit/editor-common/extensions';
import { configPanelMessages as messages } from '@atlaskit/editor-common/extensions';
import ChevronDownIcon from '@atlaskit/icon/core/chevron-down';
import ChevronRightIcon from '@atlaskit/icon/core/chevron-right';
import { N40 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

const expandContainerStyles = css({
	borderBottom: `1px solid ${token('color.border', N40)}`,
});

const expandControlStyles = css({
	display: 'flex',
	height: token('space.600', '48px'),
	justifyContent: 'center',
	paddingRight: token('space.100', '8px'),
});

const chevronContainerStyles = css({
	display: 'flex',
	alignItems: 'center',

	// eslint-disable-next-line @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'& > button': {
		width: token('space.300', '24px'),
		height: token('space.300', '24px'),
	},
});

const labelContainerStyles = css({
	width: '100%',
	alignItems: 'center',
	display: 'flex',
	fontWeight: token('font.weight.medium'),
});

const expandContentContainerHiddenStyles = css({
	display: 'none',
	marginTop: token('space.negative.100', '-8px'),
});

const expandContentContainerVisibleStyles = css({
	display: 'block',
	marginTop: token('space.negative.100', '-8px'),
});

type Props = {
	field: FieldDefinition;
	children: React.ReactNode;
	isExpanded?: boolean;
} & WrappedComponentProps;

function Expand({ field, children, isExpanded = false, intl }: Props) {
	const [expanded, setExpanded] = useState(isExpanded);

	return (
		<div data-testid="expand-config-field" css={expandContainerStyles}>
			<div css={expandControlStyles}>
				<div css={labelContainerStyles}>{field.label}</div>
				<div css={chevronContainerStyles}>
					<IconButton
						onClick={() => {
							setExpanded(!expanded);
						}}
						label={intl.formatMessage(expanded ? messages.collapse : messages.expand)}
						testId="form-expand-toggle"
						icon={(iconProps) =>
							expanded ? (
								<ChevronDownIcon label={iconProps.label} size="small" />
							) : (
								<ChevronRightIcon label={iconProps.label} size="small" />
							)
						}
					/>
				</div>
			</div>
			<div
				data-testid="expand-content-container"
				css={expanded ? expandContentContainerVisibleStyles : expandContentContainerHiddenStyles}
			>
				{children}
			</div>
		</div>
	);
}

export default injectIntl(Expand);
