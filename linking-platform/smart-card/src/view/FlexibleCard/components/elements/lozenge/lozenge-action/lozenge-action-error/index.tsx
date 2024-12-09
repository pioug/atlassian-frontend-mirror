/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Fragment, useCallback, useMemo } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import { FormattedMessage } from 'react-intl-next';

import { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import ErrorIcon from '@atlaskit/icon/core/migration/error';
import { fg } from '@atlaskit/platform-feature-flags';
import { R50, R500 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { useAnalyticsEvents } from '../../../../../../../common/analytics/generated/use-analytics-events';
import { messages } from '../../../../../../../messages';
import { useFlexibleUiAnalyticsContext } from '../../../../../../../state/flexible-ui-context';
import useResolve from '../../../../../../../state/hooks/use-resolve';
import { getFormattedMessage, openEmbedModalWithFlexibleUiIcon } from '../../../../utils';

import { contentStyles, dropdownItemGroupStyles, linkStyles, textStyles } from './styled';
import type { LozengeActionErrorProps } from './types';

const MAX_LINE_NUMBER = 8;

const LozengeActionError = ({
	errorMessage,
	testId,
	maxLineNumber = MAX_LINE_NUMBER,
	url,
	previewData,
}: LozengeActionErrorProps) => {
	const { fireEvent } = useAnalyticsEvents();
	const reload = useResolve();
	const analytics = useFlexibleUiAnalyticsContext();
	const isPreviewAvailable = previewData && previewData.src !== undefined;

	const handlePreviewClose = useCallback(() => {
		if (url) {
			reload(url, true);
		}
	}, [reload, url]);

	const handlePreviewOpen = useCallback(() => {
		if (isPreviewAvailable) {
			if (fg('platform_migrate-some-ui-events-smart-card')) {
				fireEvent('ui.button.clicked.smartLinkStatusOpenPreview', {});
			} else {
				analytics?.ui.smartLinkLozengeActionErrorOpenPreviewClickedEvent();
			}

			return openEmbedModalWithFlexibleUiIcon({
				...previewData,
				analytics,
				onClose: handlePreviewClose,
			});
		}
	}, [analytics, handlePreviewClose, isPreviewAvailable, previewData, fireEvent]);

	const content = useMemo(() => {
		return (
			<Fragment>
				{/* eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766 */}
				<div css={contentStyles}>
					<ErrorIcon
						testId={`${testId}-icon`}
						LEGACY_size="medium"
						color={token('color.icon.danger', R500)}
						LEGACY_secondaryColor={token('color.background.danger', R50)}
						label={'error'}
						spacing="spacious"
					/>
					{/* eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766 */}
					<span css={textStyles(maxLineNumber)} data-testid={`${testId}-error-message`}>
						{typeof errorMessage === 'string' ? errorMessage : getFormattedMessage(errorMessage)}
					</span>
				</div>
				{isPreviewAvailable ? (
					// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
					<div css={linkStyles}>
						{/* eslint-disable-next-line jsx-a11y/anchor-is-valid, jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
						<a target="_blank" data-testid={`${testId}-open-embed`} onClick={handlePreviewOpen}>
							<FormattedMessage {...messages.open_issue_in_jira} />
						</a>
					</div>
				) : null}
			</Fragment>
		);
	}, [errorMessage, handlePreviewOpen, isPreviewAvailable, maxLineNumber, testId]);

	return (
		// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		<span css={dropdownItemGroupStyles} data-testid={`${testId}-error-item-group`}>
			<DropdownItemGroup>
				<DropdownItem testId={`${testId}-error`}>{content}</DropdownItem>
			</DropdownItemGroup>
		</span>
	);
};

export default LozengeActionError;
