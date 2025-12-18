/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Fragment, useCallback, useMemo } from 'react';

import { css, cssMap, jsx } from '@compiled/react';
import { FormattedMessage } from 'react-intl-next';

import { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import ErrorIcon from '@atlaskit/icon/core/status-error';
import { fg } from '@atlaskit/platform-feature-flags';
import { Pressable } from '@atlaskit/primitives/compiled';
import { N800, R50, R500 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { useAnalyticsEvents } from '../../../../../../../../common/analytics/generated/use-analytics-events';
import { messages } from '../../../../../../../../messages';
import useInvokeClientAction from '../../../../../../../../state/hooks/use-invoke-client-action';
import { getFormattedMessage } from '../../../../../utils';

import type { LozengeActionErrorProps } from './types';

const MAX_LINE_NUMBER = 8;

const styles = cssMap({
	contentStyles: {
		display: 'flex',
		gap: token('space.100'),
		font: token('font.body.large'),
		minWidth: 0,
		overflow: 'hidden',
		flexDirection: 'row',
		marginTop: token('space.025'),
		alignItems: 'flex-start',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'> span, > div': {
			font: token('font.body'),
			color: token('color.text', N800),
		},
	},
	linkStyles: {
		display: 'flex',
		gap: token('space.100'),
		minWidth: 0,
		overflow: 'hidden',
		flexDirection: 'row',
		alignItems: 'center',
		cursor: 'pointer',
		font: token('font.body'),
		marginTop: token('space.100'),
		marginLeft: token('space.400'),
		marginBottom: token('space.025'),
	},
	textStylesBase: {
		font: token('font.body.large'),
		whiteSpace: 'normal',
		display: '-webkit-box',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		wordBreak: 'break-word',
		WebkitBoxOrient: 'vertical',
	},
	dropdownItemGroupStyles: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		button: {
			width: '220px',
			'&:hover': {
				backgroundColor: 'inherit',
				cursor: 'default',
			},
		},
	},
	openIssueInJiraStyles: {
		backgroundColor: 'transparent',
		'&:hover': {
			color: token('color.link.pressed'),
			textDecoration: 'underline',
		},
		justifyContent: 'left',
		display: 'inherit',
		color: token('color.link'),
		font: token('font.body'),
		paddingTop: token('space.0'),
		paddingRight: token('space.0'),
		paddingBottom: token('space.0'),
		paddingLeft: token('space.0'),
	},
});

const LozengeActionError = ({
	errorMessage,
	testId,
	maxLineNumber = MAX_LINE_NUMBER,
	invokePreviewAction,
}: LozengeActionErrorProps) => {
	const { fireEvent } = useAnalyticsEvents();
	const invoke = useInvokeClientAction({});

	const isPreviewAvailable = invokePreviewAction !== undefined;

	const handlePreviewOpen = useCallback(() => {
		if (isPreviewAvailable) {
			fireEvent('ui.button.clicked.smartLinkStatusOpenPreview', {});
			if (invokePreviewAction) {
				invoke(invokePreviewAction);
			}
		}
	}, [isPreviewAvailable, invoke, invokePreviewAction, fireEvent]);

	const dynamicCss = css({
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
		WebkitLineClamp: maxLineNumber,
		'@supports not (-webkit-line-clamp: 1)': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			maxHeight: `calc(${maxLineNumber} * 1rem)`,
		},
	});

	const content = useMemo(() => {
		return (
			<Fragment>
				<div css={styles.contentStyles}>
					<ErrorIcon
						testId={`${testId}-icon`}
						LEGACY_size="medium"
						color={token('color.icon.danger', R500)}
						LEGACY_secondaryColor={token('color.background.danger', R50)}
						label={'error'}
						spacing="spacious"
					/>
					{/* eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage */}
					<span css={[styles.textStylesBase, dynamicCss]} data-testid={`${testId}-error-message`}>
						{typeof errorMessage === 'string' ? errorMessage : getFormattedMessage(errorMessage)}
					</span>
				</div>
				{isPreviewAvailable ? (
					<div css={styles.linkStyles}>
						<Pressable
							testId={`${testId}-open-embed`}
							onClick={handlePreviewOpen}
							xcss={styles.openIssueInJiraStyles}
						>
							{fg('confluence-issue-terminology-refresh') ? (
								<FormattedMessage {...messages.open_issue_in_jiraIssueTermRefresh} />
							) : (
								<FormattedMessage {...messages.open_issue_in_jira} />
							)}
						</Pressable>
					</div>
				) : null}
			</Fragment>
		);
	}, [errorMessage, handlePreviewOpen, isPreviewAvailable, testId, dynamicCss]);

	return (
		<span css={styles.dropdownItemGroupStyles} data-testid={`${testId}-error-item-group`}>
			<DropdownItemGroup>
				<DropdownItem testId={`${testId}-error`}>{content}</DropdownItem>
			</DropdownItemGroup>
		</span>
	);
};

export default LozengeActionError;
