/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx, css } from '@compiled/react';
import React from 'react';
import { FormattedMessage } from 'react-intl-next';

import EditorWarningIcon from '@atlaskit/icon/core/status-warning';
import { messages } from '@atlaskit/media-ui';
import { R300 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
import { ErrorMessageWrapper, TitleBoxWrapper } from './titleBoxComponents';
import { type FailedTitleBoxProps } from './types';

const errorMessageWrapperStyles = css({
	verticalAlign: 'middle',
	marginLeft: token('space.050', '4px'),
	marginRight: token('space.050', '4px'),
});

export const FailedTitleBox: React.FC<FailedTitleBoxProps> = ({
	breakpoint,
	customMessage = messages.failed_to_load,
}) => {
	return (
		<TitleBoxWrapper breakpoint={breakpoint}>
			<ErrorMessageWrapper>
				<EditorWarningIcon
					label={'Warning'}
					color={token('color.text.danger', R300)}
					size="small"
				/>
				{/* eslint-disable-next-line @atlaskit/design-system/use-primitives-text */}
				<span css={errorMessageWrapperStyles}>
					<FormattedMessage {...customMessage} />
				</span>
			</ErrorMessageWrapper>
		</TitleBoxWrapper>
	);
};
