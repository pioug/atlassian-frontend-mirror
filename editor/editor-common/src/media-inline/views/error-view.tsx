/**
 * @jsxRuntime classic
 * @jsx jsx
 */

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import WarningIcon from '@atlaskit/icon/core/status-warning';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

import { Frame } from './frame';
import { IconWrapper } from './icon-wrapper';

type Props = {
	/** Error icon. Default to document icon. */
	icon?: React.ReactNode;
	message: string;
	testId?: string;
};

export const InlineImageCardErrorView = ({
	testId = 'media-inline-image-card-error-view',
	message,
	icon,
}: Props) => {
	return (
		<Frame testId={testId}>
			<Tooltip content={message} position="top" tag="span" hideTooltipOnClick>
				<IconWrapper>
					{icon || <WarningIcon label="error" color={token('color.icon.danger')} />}
				</IconWrapper>
			</Tooltip>
		</Frame>
	);
};
