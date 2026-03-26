/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Fragment, useCallback, useEffect, useRef, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled, @typescript-eslint/consistent-type-imports
import { css, jsx } from '@emotion/react';
import { FormattedMessage } from 'react-intl-next';

import { messages } from '@atlaskit/editor-common/extensions';
import CheckCircleIcon from '@atlaskit/icon/core/status-success';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, Text, xcss } from '@atlaskit/primitives';
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
	bottom: token('space.250'),
	display: 'flex',
	flexDirection: 'row',
	alignItems: 'center',
	padding: `${token('space.075')} ${token('space.150')}`,
	background: token('elevation.surface.overlay'),

	/* E300 */
	boxShadow: token('elevation.shadow.overlay'),
	borderRadius: token('radius.xxlarge'),
});

const saveIndicatorTextStyles = xcss({
	paddingLeft: 'space.075',
});

export const SaveIndicator = ({
	children,
	duration,
	visible = true,
}: SaveIndicatorProps): jsx.JSX.Element => {
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
						<CheckCircleIcon label="Saving" color={token('color.icon.success')} spacing="none" />
						<Box xcss={saveIndicatorTextStyles}>
							<Text>
								<FormattedMessage
									// Ignored via go/ees005
									// eslint-disable-next-line react/jsx-props-no-spreading
									{...messages.saveIndicator}
								/>
							</Text>
						</Box>
					</div>
				</div>
			)}
		</Fragment>
	);
};
