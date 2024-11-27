/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import { FormattedMessage } from 'react-intl-next';

import DocumentFilledIcon from '@atlaskit/icon/core/migration/file--editor-file';
import { Inline } from '@atlaskit/primitives';
import { N50, N90 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { messages } from '../../../messages';
import { gs } from '../../common/utils';
import { Frame } from '../components/Frame';

export interface ResolvingProps {
	isSelected?: boolean;
	testId?: string;
	inheritDimensions?: boolean;
}

/**
 * Class name for selecting non-flexible resolving block card
 *
 * @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-6878 Internal documentation for deprecation (no external access)}
 * Using this selctor is deprecated as once the flexible block card feature flag is removed, this class will no longer be used.
 */
export const blockCardResolvingViewClassName = 'block-card-resolving-view';

const messageStyles = css({
	font: token('font.heading.xsmall'),
	color: token('color.text.subtlest', N90),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	marginLeft: gs(0.5),
});

export const ResolvingView = ({
	isSelected = false,
	testId = 'block-card-resolving-view',
	inheritDimensions,
}: ResolvingProps) => (
	<Frame
		inheritDimensions={inheritDimensions}
		compact={true}
		isSelected={isSelected}
		testId={testId}
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
		className={blockCardResolvingViewClassName}
	>
		<DocumentFilledIcon
			LEGACY_size="medium"
			color={token('color.icon.subtle', N50)}
			label="document-icon"
			LEGACY_margin="0 -4.3px 0 -4px"
		/>
		<Inline xcss={messageStyles}>
			<FormattedMessage {...messages.loading} />
		</Inline>
	</Frame>
);
