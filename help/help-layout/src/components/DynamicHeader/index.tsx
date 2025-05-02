/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import Heading from '@atlaskit/heading';
import CloseButton from '../Header/CloseButton';
import { Flex } from '@atlaskit/primitives/compiled';
import { type HeaderContent } from '../../model/HelpLayout';
import { cssMap, jsx } from '@compiled/react';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	container: {
		paddingTop: token('space.200', '16px'),
		paddingRight: token('space.200', '16px'),
		paddingBottom: token('space.200', '16px'),
		paddingLeft: token('space.200', '16px'),
	},
});

export const DynamicHeader = ({
	title,
	onCloseButtonClick,
	onNewChatButtonClick,
}: HeaderContent) => {
	return (
		<Flex direction="row" justifyContent="space-between" xcss={styles.container}>
			<Heading size="medium" testId="header-title-side-nav">
				{title}
			</Heading>
			{onCloseButtonClick && <CloseButton onClick={onCloseButtonClick} />}
		</Flex>
	);
};
