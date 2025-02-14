import React from 'react';

import { FormattedMessage } from 'react-intl-next';

import { cssMap } from '@atlaskit/css';
import { fg } from '@atlaskit/platform-feature-flags';
import { Flex, Inline } from '@atlaskit/primitives/compiled';
import { N40 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import PopupFooterOld from './footer-old';
import { asyncPopupSelectMessages } from './messages';

export interface PopupFooterProps {
	currentDisplayCount: number;
	totalCount: number;
	filterName: string;
}

const styles = cssMap({
	footerContainerStyles: {
		paddingTop: token('space.050'),
		paddingBottom: token('space.050'),
		borderTopWidth: token('border.width', '1px'),
		borderTopStyle: `solid`,
		borderTopColor: token('color.border', N40),
	},
	footerPaginationInfoStyles: {
		color: token('color.text.subtlest'),
		marginBlock: token('space.100'),
		marginInline: token('space.150'),
	},
});

const PopupFooter = ({ currentDisplayCount, totalCount, filterName }: PopupFooterProps) => {
	return (
		<Flex
			testId={`${filterName}--footer`}
			direction="row"
			alignItems="center"
			justifyContent="end"
			xcss={styles.footerContainerStyles}
		>
			<Inline xcss={styles.footerPaginationInfoStyles}>
				<FormattedMessage
					{...asyncPopupSelectMessages.paginationDetails}
					values={{ currentDisplayCount, totalCount }}
				/>
			</Inline>
		</Flex>
	);
};

const PopupFooterExported = (props: PopupFooterProps) => {
	if (fg('bandicoots-compiled-migration-link-datasource')) {
		return <PopupFooter {...props} />;
	} else {
		return <PopupFooterOld {...props} />;
	}
};

export default PopupFooterExported;
