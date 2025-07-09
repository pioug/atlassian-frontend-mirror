/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { Fragment, useCallback } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import classnames from 'classnames';
import { defineMessages, useIntl } from 'react-intl-next';

import StatusWarningIcon from '@atlaskit/icon/core/status-warning';
import Link from '@atlaskit/link';
import { Status } from '@atlaskit/status';
import { token } from '@atlaskit/tokens';

const i18n = defineMessages({
	legacyContentHeader: {
		id: 'editor.extension.legacyContentHeader',
		defaultMessage: 'Legacy Content',
		description: 'Header for the legacy content extension in the editor.',
	},
	contentHasLimitedFunctionality: {
		id: 'editor.extension.legacyContentHeader.contentHasLimitedFunctionality',
		defaultMessage: 'This content has limited functionality, ',
		description: 'Message indicating that the legacy content has limited functionality.',
	},
	learnMore: {
		id: 'editor.extension.legacyContentHeader.learnMore',
		defaultMessage: ' Learn more',
		description: 'Link text for learning more about the legacy content.',
	},
});

const lcmHeaderStyles = css({
	padding: `0 ${token('space.200', '16px')} ${token('space.050', '4px')} ${token('space.200', '16px')}`,
	backgroundColor: token('color.background.neutral', '#0515240F'),
	borderRadius: `${token('border.radius', '4px')} ${token('border.radius', '4px')} 0 0`,
	boxShadow: `0 0 0 1px ${token('color.background.neutral', '#0515240F')}`,
	position: 'relative',
	top: `-1px`,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'&.with-hover-border': {
		boxShadow: `0 0 0 1px ${token('color.border.input')}`,
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'&.selected': {
		boxShadow: `0 0 0 1px ${token('color.border.selected')}`,
		backgroundColor: token('color.background.selected'),
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'& .status-lozenge-span': {
		marginRight: token('space.100', '8px'),
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'& > .legacy-content-header-text': {
		font: token('font.body.UNSAFE_small', '12px'),

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'& span': {
			paddingRight: token('space.050', '4px'),
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'& a': {
			cursor: 'pointer',
		},
	},
});

export type LegacyContentHeaderProps = {
	isNodeSelected?: boolean;
	isNodeHovered?: boolean;
	onMouseEnter?: () => void;
	onMouseLeave?: () => void;
};

export const LegacyContentHeader = ({
	isNodeHovered,
	isNodeSelected,
	onMouseEnter,
	onMouseLeave,
}: LegacyContentHeaderProps) => {
	const { formatMessage } = useIntl();

	const classNames = classnames('legacy-content-header', {
		'with-hover-border': isNodeHovered,
		selected: isNodeSelected,
	});

	const learnMore = useCallback(() => {
		window.open(
			'https://support.atlassian.com/confluence-cloud/docs/the-legacy-content-macro/',
			'_blank',
		);
	}, []);

	return (
		<Fragment>
			{/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
			<div
				data-testid="editor-extension-legacy-content-header"
				css={[lcmHeaderStyles]}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
				className={classNames}
				onMouseEnter={onMouseEnter}
				onMouseLeave={onMouseLeave}
			>
				<Status
					text={formatMessage(i18n.legacyContentHeader)}
					color={isNodeSelected ? 'blue' : 'neutral'}
					style="bold"
					isBold
				/>
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766 */}
				<span className="legacy-content-header-text">
					<StatusWarningIcon
						label={formatMessage(i18n.contentHasLimitedFunctionality)}
						size="small"
					/>
					{formatMessage(i18n.contentHasLimitedFunctionality)}&nbsp;
					<Link
						onClick={learnMore}
						href="https://support.atlassian.com/confluence-cloud/docs/the-legacy-content-macro/"
						target="_blank"
					>
						{formatMessage(i18n.learnMore)}
					</Link>
				</span>
			</div>
		</Fragment>
	);
};
