/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import type { WithIntlProps, WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';

import { IconButton } from '@atlaskit/button/new';
import type { FieldDefinition } from '@atlaskit/editor-common/extensions';
import { configPanelMessages as messages } from '@atlaskit/editor-common/extensions';
import ChevronDownIcon from '@atlaskit/icon/core/chevron-down';
import ChevronRightIcon from '@atlaskit/icon/core/chevron-right';
import { token } from '@atlaskit/tokens';

const expandContainerStyles = css({
	borderBottom: `${token('border.width')} solid ${token('color.border')}`,
});

const expandControlStyles = css({
	display: 'flex',
	height: token('space.600'),
	justifyContent: 'center',
	paddingRight: token('space.100'),
});

const chevronContainerStyles = css({
	display: 'flex',
	alignItems: 'center',

	// eslint-disable-next-line @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'& > button': {
		width: token('space.300'),
		height: token('space.300'),
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
	marginTop: token('space.negative.100'),
});

const expandContentContainerVisibleStyles = css({
	display: 'block',
	marginTop: token('space.negative.100'),
});

type Props = {
	children: React.ReactNode;
	field: FieldDefinition;
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
						// eslint-disable-next-line @atlassian/perf-linting/no-unstable-inline-props -- Ignored via go/ees017 (to be fixed)
						onClick={() => {
							setExpanded(!expanded);
						}}
						label={intl.formatMessage(expanded ? messages.collapse : messages.expand)}
						testId="form-expand-toggle"
						// eslint-disable-next-line @atlassian/perf-linting/no-unstable-inline-props -- Ignored via go/ees017 (to be fixed)
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

// eslint-disable-next-line @typescript-eslint/ban-types
const _default_1: React.FC<WithIntlProps<Props>> & {
	WrappedComponent: React.ComponentType<Props>;
} = injectIntl(Expand);
export default _default_1;
