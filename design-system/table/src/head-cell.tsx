/* eslint-disable no-unused-vars */
/** @jsx jsx */
import type { FC } from 'react';

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
