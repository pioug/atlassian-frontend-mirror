/** @jsx jsx */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import { useRef, useEffect } from 'react';

import { R400 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
import ErrorIcon from '@atlaskit/icon/glyph/error';
import Flag from '@atlaskit/flag';
import { messages } from '@atlaskit/media-ui';
import { useIntl } from 'react-intl-next';
import { avatarPickerErrorStyles } from './styles';

export const SubmitErrorDialog = () => {
	const intl = useIntl();
	const flagContainerRef: React.RefObject<HTMLDivElement> = useRef(null);

	useEffect(() => {
		if (flagContainerRef.current) {
			(flagContainerRef.current.children[0] as HTMLDivElement).focus();
		}
	}, []);

	return (
		// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		<div css={avatarPickerErrorStyles} ref={flagContainerRef}>
			<Flag
				appearance="error"
				icon={
					<ErrorIcon label="Error" secondaryColor={token('color.background.danger.bold', R400)} />
				}
				id="avatar-picker-error"
				key="error"
				title={intl.formatMessage(messages.or_select_default_avatars)}
			/>
		</div>
	);
};
