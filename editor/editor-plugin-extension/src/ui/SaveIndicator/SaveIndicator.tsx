/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Fragment, useCallback, useEffect, useRef, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import { FormattedMessage } from 'react-intl-next';

import { messages } from '@atlaskit/editor-common/extensions';
import CheckCircleIcon from '@atlaskit/icon/glyph/check-circle';
import { Box, Text, xcss } from '@atlaskit/primitives';
import { G300, N0 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import type { SaveIndicatorProps } from './types';

const noop = () => {};

const saveIndicatorWrapperStyles = css({
	display: 'flex',
	justifyContent: 'center',
});

const saveIndicatorContentStyles = css({
	position: 'fixed',
	width: '256px',
	bottom: token('space.250', '20px'),
	display: 'flex',
	flexDirection: 'row',
	alignItems: 'center',
	padding: `${token('space.075', '6px')} ${token('space.150', '12px')}`,
	background: token('elevation.surface.overlay', N0),

	/* E300 */
	boxShadow: token(
		'elevation.shadow.overlay',
		`0px 8px 12px rgba(9, 30, 66, 0.15), 0px 0px 1px rgba(9, 30, 66, 0.31)`,
	),
	borderRadius: '16px',
});

const saveIndicatorTextStyles = xcss({
	paddingLeft: 'space.075',
});

export const SaveIndicator = ({ children, duration, visible = true }: SaveIndicatorProps) => {
	const [saving, setSaving] = useState(false);
	const shown = useRef(false);

	const onSaveStarted = useCallback(() => {
		if (!shown.current) {
			setSaving(true);
			shown.current = true;
		}
	}, []);

	useEffect(() => {
		if (saving) {
			const handleId = setTimeout(() => {
				setSaving(false);
			}, duration);

			return () => clearTimeout(handleId);
		}
	}, [saving, duration]);

	return (
		<Fragment>
			<div>{children({ onSaveStarted, onSaveEnded: noop })}</div>
			{visible && saving && (
				<div css={saveIndicatorWrapperStyles}>
					<div css={saveIndicatorContentStyles} data-testid="save-indicator-content">
						<CheckCircleIcon
							label="Saving"
							primaryColor={token('color.icon.success', G300)}
							size="small"
						/>
						<Box xcss={saveIndicatorTextStyles}>
							<Text>
								<FormattedMessage {...messages.saveIndicator} />
							</Text>
						</Box>
					</div>
				</div>
			)}
		</Fragment>
	);
};
