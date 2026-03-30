import React, { type ReactNode } from 'react';

import { cssMap, cx } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	tableContainerStyles: {
		borderBottom: `${token('border.width')} solid ${token('color.border')}`,
		borderTop: `${token('border.width')} solid ${token('color.border')}`,
		borderLeft: `${token('border.width')} solid ${token('color.border')}`,
		borderRight: `${token('border.width')} solid ${token('color.border')}`,
		borderTopLeftRadius: token('radius.large', '8px'),
		borderTopRightRadius: token('radius.large', '8px'),
	},
	contentContainerStyles: {
		display: 'grid',
		maxHeight: '420px',
		overflow: 'auto',
		borderBottom: `${token('border.width.selected')} solid ${token('color.border')}`,
		backgroundImage: `
		linear-gradient(90deg, ${token('utility.elevation.surface.current')} 30%, rgba(255, 255, 255, 0)),
		linear-gradient(90deg, ${token('elevation.shadow.overflow.perimeter')}, rgba(0, 0, 0, 0)),
		linear-gradient(90deg, rgba(255, 255, 255, 0), ${token('utility.elevation.surface.current')} 70%),
		linear-gradient(90deg, rgba(0, 0, 0, 0), ${token('elevation.shadow.overflow.perimeter')}),
		linear-gradient(0deg, rgba(255, 255, 255, 0), ${token('utility.elevation.surface.current')} 30%),
		linear-gradient(0deg, rgba(0, 0, 0, 0), ${token('elevation.shadow.overflow.perimeter')}),
		linear-gradient(0deg, ${token('utility.elevation.surface.current')} 30%, rgba(255, 255, 255, 0)),
		linear-gradient(0deg, ${token('elevation.shadow.overflow.perimeter')}, rgba(0, 0, 0, 0))
		`,
		backgroundPosition:
			'left center, left center, right center, right center, center top, 0px 52px, center bottom, center bottom',
		backgroundRepeat: 'no-repeat',
		backgroundSize:
			'40px 100%, 14px 100%, 40px 100%, 14px 100%, 100% 100px, 100% 14px, 100% 40px, 100% 10px',
		backgroundAttachment: 'local, scroll, local, scroll, local, scroll, local, scroll',
	},
	contentContainerRemoveBorderStyles: {
		borderBottom: 'none',
	},
});

export interface ContentContainerProps {
	children: ReactNode;
	withTableBorder?: boolean;
}

export const ContentContainer = ({
	children,
	withTableBorder,
}: ContentContainerProps): React.JSX.Element => {
	return (
		<Box
			xcss={cx(
				styles.contentContainerStyles,
				withTableBorder && styles.tableContainerStyles,
				styles.contentContainerRemoveBorderStyles,
			)}
		>
			{children}
		</Box>
	);
};
