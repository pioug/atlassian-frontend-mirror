import React from 'react';
import { FormattedMessage } from 'react-intl-next';

import EditorWarningIcon from '@atlaskit/icon/utility/migration/warning--editor-warning';
import { messages } from '@atlaskit/media-ui';
import { R300 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
import { ErrorMessageWrapper, TitleBoxWrapper } from './titleBoxComponents';
import { type FailedTitleBoxProps } from './types';

export const FailedTitleBox: React.FC<FailedTitleBoxProps> = ({
	breakpoint,
	customMessage = messages.failed_to_load,
}) => {
	return (
		<TitleBoxWrapper breakpoint={breakpoint}>
			<ErrorMessageWrapper>
				<EditorWarningIcon
					label={'Warning'}
					LEGACY_size={'small'}
					LEGACY_margin={`0 ${token('space.negative.025')}`}
					color={token('color.text.danger', R300)}
				/>
				<span>
					<FormattedMessage {...customMessage} />
				</span>
			</ErrorMessageWrapper>
		</TitleBoxWrapper>
	);
};
