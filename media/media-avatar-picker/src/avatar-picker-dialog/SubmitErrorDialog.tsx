/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { useRef, useEffect } from 'react';

import { jsx, css } from '@compiled/react';
import { useIntl } from 'react-intl';

import Flag from '@atlaskit/flag/flag';
import ErrorIcon from '@atlaskit/icon/core/status-error';
import { messages } from '@atlaskit/media-ui/messages';
import { token } from '@atlaskit/tokens';

const avatarPickerErrorStyles = css({
	marginTop: token('space.0'),
	marginRight: token('space.200'),
	marginLeft: token('space.200'),
	marginBottom: token('space.200'),
});

export const SubmitErrorDialog = (): JSX.Element => {
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
				icon={<ErrorIcon label="Error" color="currentColor" spacing="spacious" />}
				id="avatar-picker-error"
				key="error"
				title={intl.formatMessage(messages.or_select_default_avatars)}
			/>
		</div>
	);
};
