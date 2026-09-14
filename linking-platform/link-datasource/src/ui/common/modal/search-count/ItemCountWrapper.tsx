import React from 'react';

import { cssMap } from '@compiled/react';

import { Flex } from '@atlaskit/primitives/compiled';
import LinkUrl from '@atlaskit/smart-card/link-url';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	searchCountStyles: {
		flex: 1,
	},
});

import type { TableSearchCountProps } from './index';

export const ItemCountWrapper = ({
	url,
	styles: additionalStyles,
	children,
	testId,
}: Pick<TableSearchCountProps, 'testId' | 'url' | 'styles'> & {
	children: React.ReactNode;
}): React.JSX.Element => (
	<Flex testId={testId} xcss={styles.searchCountStyles} alignItems="center">
		<LinkUrl
			href={url}
			target="_blank"
			testId="item-count-url"
			style={{
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				color: token('color.text.subtlest'),
				textDecoration: !url ? 'none' : '',
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				...additionalStyles,
			}}
		>
			{children}
		</LinkUrl>
	</Flex>
);
