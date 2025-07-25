/**
 * @jsxRuntime classic
 * @jsx jsx
 */

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import WarningIcon from '@atlaskit/icon/core/migration/status-warning--warning';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

import { ICON_SIZE_THRESOLD } from './constants';
import { Frame } from './frame';
import { IconWrapper } from './icon-wrapper';

type Props = {
	message: string;
	/** Error icon. Default to document icon. */
	icon?: React.ReactNode;
	testId?: string;
	/** Container height */
	height?: number;
};

export const InlineImageCardErrorView = ({
	testId = 'media-inline-image-card-error-view',
	message,
	icon,
	height = ICON_SIZE_THRESOLD,
}: Props) => {
	return (
		<Frame testId={testId}>
			<Tooltip content={message} position="top" tag="span" hideTooltipOnClick>
				<IconWrapper>
					{icon || (
						<WarningIcon
							label="error"
							LEGACY_size={height > ICON_SIZE_THRESOLD ? 'medium' : 'small'}
							color={token('color.icon.danger')}
						/>
					)}
				</IconWrapper>
			</Tooltip>
		</Frame>
	);
};
