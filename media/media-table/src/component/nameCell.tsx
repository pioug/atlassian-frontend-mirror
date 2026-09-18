/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { type FC } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import { type MediaType } from '@atlaskit/media-client';
import { MediaTypeIcon } from '@atlaskit/media-ui/media-type-icon';
import { Truncate } from '@atlaskit/media-ui/truncateText/truncate';
import type { TruncateProps } from '@atlaskit/media-ui/truncateText/types';
import Tooltip from '@atlaskit/tooltip/Tooltip';

import { nameCellWrapperStyles, truncateWrapperStyles } from './styles';
export interface NameCellProps extends TruncateProps {
	mediaType?: MediaType;
}
export const NameCell: FC<NameCellProps> = (props) => {
	const { mediaType, text, ...rest } = props;

	return (
		// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		<div css={nameCellWrapperStyles}>
			{mediaType && <MediaTypeIcon type={mediaType} />}
			{/* eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766 */}
			<div css={truncateWrapperStyles}>
				<Tooltip content={text}>
					<Truncate text={text} {...rest} />
				</Tooltip>
			</div>
		</div>
	);
};
