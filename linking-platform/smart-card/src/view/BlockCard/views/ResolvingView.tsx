/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import DocumentFilledIcon from '@atlaskit/icon/glyph/document-filled';
import { N50, N90 } from '@atlaskit/theme/colors';
import { fontSize } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

import { Frame } from '../components/Frame';
import { FormattedMessage } from 'react-intl-next';
import { messages } from '../../../messages';

import { gs } from '../../common/utils';

export interface ResolvingProps {
	isSelected?: boolean;
	testId?: string;
	inheritDimensions?: boolean;
}

/**
 * Class name for selecting non-flexible resolving block card
 *
 * @deprecated {@link https://hello.jira.atlassian.cloud/browse/ENGHEALTH-6878 Internal documentation for deprecation (no external access)}
 * Using this selctor is deprecated as once the flexible block card feature flag is removed, this class will no longer be used.
 */
export const blockCardResolvingViewClassName = 'block-card-resolving-view';

const messageStyles = css({
	fontSize: `${fontSize()}px`,
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
			size="small"
			primaryColor={token('color.icon.subtle', N50)}
			label="document-icon"
		/>
		<span css={messageStyles}>
			<FormattedMessage {...messages.loading} />
		</span>
	</Frame>
);
