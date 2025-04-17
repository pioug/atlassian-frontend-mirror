/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import type { FC } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import { Text } from '@atlaskit/primitives';

import { TH, type THProps } from './ui/th';

/**
 * __HeadCell__
 *
 * HeadCell element
 */
const HeadCell: FC<THProps> = ({ children, align, testId, backgroundColor, scope = 'col' }) => {
	return (
		<TH scope={scope} align={align} testId={testId} backgroundColor={backgroundColor}>
			{children && <Text weight="medium">{children}</Text>}
		</TH>
	);
};

export default HeadCell;
