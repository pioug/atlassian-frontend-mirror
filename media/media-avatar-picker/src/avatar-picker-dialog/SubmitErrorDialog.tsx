/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx, css } from '@compiled/react';
import { useRef, useEffect } from 'react';

import { R400 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
import ErrorIcon from '@atlaskit/icon/core/migration/status-error--error';
import Flag from '@atlaskit/flag';
import { messages } from '@atlaskit/media-ui';
import { useIntl } from 'react-intl-next';

const avatarPickerErrorStyles = css({
	marginTop: token('space.0', '0px'),
	marginRight: token('space.200', '16px'),
	marginLeft: token('space.200', '16px'),
	marginBottom: token('space.200', '16px'),
});

export const SubmitErrorDialog = () => {
	const intl = useIntl();
	const flagContainerRef: React.RefObject<HTMLDivElement> = useRef(null);

	useEffect(() => {
		if (flagContainerRef.current) {
			(flagContainerRef.current.children[0] as HTMLDivElement).focus();
		}
	}, []);

	return (
		<div css={avatarPickerErrorStyles} ref={flagContainerRef}>
			<Flag
				appearance="error"
				icon={
					<ErrorIcon
						label="Error"
						color="currentColor"
						LEGACY_secondaryColor={token('color.background.danger.bold', R400)}
						spacing="spacious"
					/>
				}
				id="avatar-picker-error"
				key="error"
				title={intl.formatMessage(messages.or_select_default_avatars)}
			/>
		</div>
	);
};
