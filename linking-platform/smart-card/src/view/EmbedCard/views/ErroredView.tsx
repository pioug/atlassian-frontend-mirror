/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import { FormattedMessage } from 'react-intl-next';

import Button from '@atlaskit/button';
import ErrorIcon from '@atlaskit/icon/core/migration/error';
import { R300 } from '@atlaskit/theme/colors';
import { fontSize } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

import { messages } from '../../../messages';
import { Frame } from '../../BlockCard/components/Frame';
import { gs } from '../../common/utils';

export interface ErroredViewProps {
	onRetry?: (val: any) => void;
	isSelected?: boolean;
	testId?: string;
	inheritDimensions?: boolean;
}

const messageStyles = css({
	fontSize: `${fontSize()}px`,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	marginLeft: gs(0.5),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	marginRight: gs(0.5),
	display: '-webkit-box',
	overflow: 'hidden',
	textOverflow: 'ellipsis',
	WebkitLineClamp: 1,
	WebkitBoxOrient: 'vertical',
	// Fallback options.
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	maxHeight: gs(3),
});

export const EmbedCardErroredView = ({
	onRetry,
	isSelected = false,
	testId = 'embed-card-errored-view',
	inheritDimensions,
}: ErroredViewProps) => (
	<Frame
		inheritDimensions={inheritDimensions}
		compact={true}
		isSelected={isSelected}
		testId={testId}
	>
		<ErrorIcon LEGACY_size="small" color={token('color.icon.danger', R300)} label="error-icon" />
		<span css={messageStyles}>
			<FormattedMessage {...messages.could_not_load_link} />
		</span>
		<Button testId="err-view-retry" appearance="link" spacing="none" onClick={onRetry}>
			<FormattedMessage {...messages.try_again} />
		</Button>
	</Frame>
);
