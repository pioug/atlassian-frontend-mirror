import React from 'react';

import { IntlProvider } from 'react-intl';

import { cssMap } from '@atlaskit/css';
import { Content } from '@atlaskit/page-layout/content';
import { LeftSidebarWithoutResize } from '@atlaskit/page-layout/left-sidebar-without-resize';
import { Main } from '@atlaskit/page-layout/main';
import { PageLayout } from '@atlaskit/page-layout/page-layout';
import { TopNavigation } from '@atlaskit/page-layout/top-navigation';
import { Box } from '@atlaskit/primitives/compiled/box';
import { token } from '@atlaskit/tokens';
const styles = cssMap({
	top: { height: '48px', backgroundColor: token('color.background.neutral') },
	side: { height: '192px', backgroundColor: token('color.background.neutral.subtle') },
	main: {
		height: '192px',
		borderStyle: 'dotted',
		borderWidth: token('border.width'),
		borderColor: token('color.border.discovery'),
	},
	subject: {
		width: '440px',
		display: 'block',
		alignItems: 'center',
		justifyContent: 'center',
		gap: token('space.200'),
	},
});

export default function Preview(): React.JSX.Element {
	return (
		<IntlProvider locale="en">
			<Box testId="component-preview" xcss={styles.subject}>
				<PageLayout>
					<TopNavigation isFixed={false} height={48}>
						<Box xcss={styles.top} />
					</TopNavigation>
					<Content>
						<LeftSidebarWithoutResize isFixed={false} width={100}>
							<Box xcss={styles.side} />
						</LeftSidebarWithoutResize>
						<Main>
							<Box xcss={styles.main} />
						</Main>
					</Content>
				</PageLayout>
			</Box>
		</IntlProvider>
	);
}
