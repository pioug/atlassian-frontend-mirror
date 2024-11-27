/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import { FormattedMessage } from 'react-intl-next';

import Button from '@atlaskit/button';
import ErrorIcon from '@atlaskit/icon/core/migration/error';
import { Box, Inline, xcss } from '@atlaskit/primitives';
import { R300 } from '@atlaskit/theme/colors';
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
	font: token('font.heading.xsmall'),
	fontWeight: token('font.weight.regular'),
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

const boxStyles = xcss({
	paddingLeft: 'space.050',
	paddingRight: 'space.050',
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
		<Box xcss={boxStyles}>
			<Inline xcss={messageStyles}>
				<FormattedMessage {...messages.could_not_load_link} />
			</Inline>
		</Box>
		<Button testId="err-view-retry" appearance="link" spacing="none" onClick={onRetry}>
			<FormattedMessage {...messages.try_again} />
		</Button>
	</Frame>
);
