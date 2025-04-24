import React from 'react';

import { cx } from '@compiled/react';
import { FormattedMessage } from 'react-intl-next';

import { cssMap } from '@atlaskit/css';
import { fg } from '@atlaskit/platform-feature-flags';
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
	footerContainerStylesOld: {
		paddingTop: token('space.050'),
		paddingBottom: token('space.050'),
		borderTopWidth: token('border.width', '1px'),
		borderTopStyle: `solid`,
		borderTopColor: token('color.border', N40),
	},
	footerContainerStyles: {
		paddingTop: token('space.150'),
		paddingBottom: token('space.150'),
		paddingLeft: token('space.200'),
		paddingRight: token('space.200'),
		borderTopWidth: token('border.width', '1px'),
		borderTopStyle: `solid`,
		borderTopColor: token('color.border', N40),
	},
	footerPaginationInfoStylesOld: {
		color: token('color.text.subtlest'),
		marginBlock: token('space.100'),
		marginInline: token('space.150'),
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
			xcss={cx(
				fg('platform-linking-visual-refresh-sllv')
					? styles.footerContainerStyles
					: styles.footerContainerStylesOld,
			)}
		>
			<Inline
				xcss={cx(
					fg('platform-linking-visual-refresh-sllv')
						? styles.footerPaginationInfoStyles
						: styles.footerPaginationInfoStylesOld,
				)}
			>
				<FormattedMessage
					{...asyncPopupSelectMessages.paginationDetails}
					values={{ currentDisplayCount, totalCount }}
				/>
			</Inline>
		</Flex>
	);
};

export default PopupFooter;
