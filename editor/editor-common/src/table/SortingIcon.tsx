/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import type { IntlShape, WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';

import { N20, N30 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

import { SortOrder } from '../types';

import { SORTABLE_COLUMN_ICON_CLASSNAME } from './consts';
import { sortingAriaLabelMessages, sortingIconMessages } from './messages';

export enum StatusClassNames {
	ASC = 'sorting-icon-svg__asc',
	DESC = 'sorting-icon-svg__desc',
	NO_ORDER = 'sorting-icon-svg__no_order',
	SORTING_NOT_ALLOWED = 'sorting-icon-svg__not-allowed',
}

// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression -- needs manual remediation
const buttonStyles = css`
	position: absolute;
	display: flex;
	height: 28px;
	width: 28px;
	margin: ${token('space.075', '6px')};
	right: 0;
	top: 0;
	border: 2px solid ${token('color.border', '#fff')};
	border-radius: ${token('border.radius.100', '4px')};
	background-color: ${token('elevation.surface.overlay', N20)};
	justify-content: center;
	align-items: center;
	cursor: pointer;

	&:hover {
		background-color: ${token('elevation.surface.overlay.hovered', N30)};
	}

	&:active {
		background-color: ${token('elevation.surface.overlay.pressed', 'rgba(179, 212, 255, 0.6)')};
	}

	&.${SORTABLE_COLUMN_ICON_CLASSNAME}__not-allowed {
		cursor: not-allowed;
	}
`;

// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression -- needs manual remediation
const iconWrapperStyles = css`
	width: 8px;
	height: 12px;
	transition: transform 0.3s cubic-bezier(0.15, 1, 0.3, 1);
	transform-origin: 50% 50%;
	display: flex;
	justify-content: center;

	&.${StatusClassNames.DESC} {
		transform: rotate(-180deg);
	}

	&.${SORTABLE_COLUMN_ICON_CLASSNAME}-inactive {
		opacity: 0.7;
	}
`;

// The icon is created with CSS due to the following Firefox issue: https://product-fabric.atlassian.net/browse/ED-8001
// The TL;DR is that svg's in tables mess up how HTML is copied in Firefox. Using a styled div instead solves the problem.
// For this reason, svg's should be avoided in tables until this issue is fixed: https://bugzilla.mozilla.org/show_bug.cgi?id=1664350
const iconStyles = css({
	height: '100%',
	width: '2px',
	borderRadius: '50px',
	background: token('color.icon', '#42526E'),
	'&::before, &::after': {
		background: token('color.icon', '#42526E'),
		content: "''",
		height: '2px',
		width: '6px',
		position: 'absolute',
		borderRadius: '50px',
	},
	'&::before': {
		transform: 'rotate(45deg) translate(3.4px, 8.5px)',
	},
	'&::after': {
		transform: 'rotate(-45deg) translate(-6.3px, 5.7px)',
	},
});

const getIconClassName = (isSortingAllowed: boolean, sortOrdered?: SortOrder) => {
	const activated = sortOrdered !== SortOrder.NO_ORDER;
	const activeStatusClass = `${SORTABLE_COLUMN_ICON_CLASSNAME}-${
		activated ? 'active' : 'inactive'
	}`;

	if (!isSortingAllowed) {
		return `${StatusClassNames.SORTING_NOT_ALLOWED} ${activeStatusClass}`;
	}

	switch (sortOrdered) {
		case SortOrder.ASC:
			return `${StatusClassNames.ASC} ${activeStatusClass}`;
		case SortOrder.DESC:
			return `${StatusClassNames.DESC} ${activeStatusClass}`;
		default:
			return `${StatusClassNames.NO_ORDER} ${activeStatusClass}`;
	}
};

type SortingIconProps = {
	isSortingAllowed: boolean;
	sortOrdered?: SortOrder;
	onClick: () => void;
	onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => void;
} & WrappedComponentProps;

const getTooltipTitle = (
	intl: IntlShape,
	isSortingAllowed: boolean,
	sortOrdered?: SortOrder,
): string => {
	const { noOrderLabel, ascOrderLabel, descOrderLabel, invalidLabel } = sortingIconMessages;

	if (!isSortingAllowed) {
		return intl.formatMessage(invalidLabel);
	}

	switch (sortOrdered) {
		case SortOrder.NO_ORDER:
			return intl.formatMessage(noOrderLabel);
		case SortOrder.ASC:
			return intl.formatMessage(ascOrderLabel);
		case SortOrder.DESC:
			return intl.formatMessage(descOrderLabel);
	}

	return '';
};

const getAriaLabel = (
	intl: IntlShape,
	isSortingAllowed: boolean,
	sortOrdered?: SortOrder,
): string => {
	const { noOrderLabel, ascOrderLabel, descOrderLabel, invalidLabel, defaultLabel } =
		sortingAriaLabelMessages;

	if (!isSortingAllowed) {
		return intl.formatMessage(invalidLabel);
	}

	switch (sortOrdered) {
		case SortOrder.NO_ORDER:
			return intl.formatMessage(noOrderLabel);
		case SortOrder.ASC:
			return intl.formatMessage(ascOrderLabel);
		case SortOrder.DESC:
			return intl.formatMessage(descOrderLabel);
	}

	return intl.formatMessage(defaultLabel);
};

const SortingIcon = ({
	isSortingAllowed,
	sortOrdered,
	intl,
	onClick,
	onKeyDown,
}: SortingIconProps) => {
	const buttonClassName = `${SORTABLE_COLUMN_ICON_CLASSNAME} ${
		sortOrdered !== SortOrder.NO_ORDER ? 'is-active' : ''
	}${isSortingAllowed ? '' : ` ${SORTABLE_COLUMN_ICON_CLASSNAME}__not-allowed `}`;

	const content = getTooltipTitle(intl, isSortingAllowed, sortOrdered);
	const ariaLabel = getAriaLabel(intl, isSortingAllowed, sortOrdered);

	const handleClick = () => {
		if (isSortingAllowed) {
			onClick();
		}
	};

	const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
		if (isSortingAllowed) {
			onKeyDown(event);
		}
	};

	return (
		<Tooltip delay={0} content={content} position="top">
			<div
				css={buttonStyles}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
				className={buttonClassName}
				role="button"
				tabIndex={isSortingAllowed ? 0 : -1}
				aria-label={ariaLabel}
				aria-disabled={!isSortingAllowed}
				onClick={handleClick}
				onKeyDown={handleKeyDown}
			>
				<div
					css={iconWrapperStyles}
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
					className={getIconClassName(isSortingAllowed, sortOrdered)}
				>
					<div css={iconStyles} />
				</div>
			</div>
		</Tooltip>
	);
};

export default injectIntl(SortingIcon);
