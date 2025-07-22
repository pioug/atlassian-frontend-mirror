import React from 'react';

import { cx } from '@compiled/react';
import { FormattedMessage } from 'react-intl-next';

import { cssMap } from '@atlaskit/css';
import { Flex, Inline } from '@atlaskit/primitives/compiled';
import { N40 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { asyncPopupSelectMessages } from './messages';

export interface PopupFooterProps {
	currentDisplayCount: number;
	totalCount: number;
	filterName: string;
}

const styles = cssMap({
	footerContainerStyles: {
		paddingTop: token('space.150'),
		paddingBottom: token('space.150'),
		paddingLeft: token('space.200'),
		paddingRight: token('space.200'),
		borderTopWidth: token('border.width', '1px'),
		borderTopStyle: `solid`,
		borderTopColor: token('color.border', N40),
	},
	footerPaginationInfoStyles: {
		color: token('color.text.subtlest'),
	},
});

const PopupFooter = ({ currentDisplayCount, totalCount, filterName }: PopupFooterProps) => {
	return (
		<Flex
			testId={`${filterName}--footer`}
			direction="row"
			alignItems="center"
			justifyContent="end"
			xcss={cx(styles.footerContainerStyles)}
		>
			<Inline xcss={cx(styles.footerPaginationInfoStyles)}>
				<FormattedMessage
					{...asyncPopupSelectMessages.paginationDetails}
					values={{ currentDisplayCount, totalCount }}
				/>
			</Inline>
		</Flex>
	);
};

export default PopupFooter;
