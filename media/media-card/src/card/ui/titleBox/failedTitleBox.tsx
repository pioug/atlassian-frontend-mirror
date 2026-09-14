/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import React from 'react';

import { jsx, css } from '@compiled/react';
import { FormattedMessage } from 'react-intl';

import EditorWarningIcon from '@atlaskit/icon/core/status-warning';
import { messages } from '@atlaskit/media-ui/messages';
import { token } from '@atlaskit/tokens';

import { ErrorMessageWrapper } from './ErrorMessageWrapper';
import { TitleBoxWrapper } from './TitleBoxWrapper';
import { type FailedTitleBoxProps } from './types';

const errorMessageWrapperStyles = css({
	verticalAlign: 'middle',
	marginLeft: token('space.050'),
	marginRight: token('space.050'),
});

export const FailedTitleBox: React.FC<FailedTitleBoxProps> = ({
	breakpoint,
	customMessage = messages.failed_to_load,
}) => {
	return (
		<TitleBoxWrapper breakpoint={breakpoint}>
			<ErrorMessageWrapper>
				<EditorWarningIcon label={'Warning'} color={token('color.text.danger')} size="small" />
				{/* eslint-disable-next-line @atlaskit/design-system/use-primitives-text */}
				<span css={errorMessageWrapperStyles}>
					<FormattedMessage {...customMessage} />
				</span>
			</ErrorMessageWrapper>
		</TitleBoxWrapper>
	);
};
