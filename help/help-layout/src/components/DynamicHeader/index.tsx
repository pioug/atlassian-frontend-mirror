/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import Heading from '@atlaskit/heading';
import CloseButton from '../Header/CloseButton';
import { Flex, Inline } from '@atlaskit/primitives/compiled';
import { type HeaderContent } from '../../model/HelpLayout';
import { cssMap, jsx } from '@compiled/react';
import { token } from '@atlaskit/tokens';
import { IconButton } from '@atlaskit/button/new';
import { NewChatButton } from './NewChatButton';
import ChevronLeftLargeIcon from '@atlaskit/icon/core/migration/chevron-left--chevron-left-large';

const styles = cssMap({
	container: {
		paddingTop: token('space.200', '16px'),
		paddingRight: token('space.200', '16px'),
		paddingBottom: token('space.200', '16px'),
		paddingLeft: token('space.200', '16px'),
		alignItems: 'center',
	},
});

export const DynamicHeader = ({
	title,
	onCloseButtonClick,
	onNewChatButtonClick,
	newChatButtonDisabled,
	onGoBackToHistoryList,
	isBackButtonVisible,
}: HeaderContent): JSX.Element => {
	return (
		<Flex direction="row" justifyContent="space-between" xcss={styles.container}>
			<Flex direction="row" alignItems="center" justifyContent="start" gap="space.050">
				{onGoBackToHistoryList && isBackButtonVisible && (
					<IconButton
						appearance="subtle"
						label="Back"
						icon={(iconProps) => <ChevronLeftLargeIcon {...iconProps} size="small" />}
						onClick={onGoBackToHistoryList}
						testId="back-button-history-item"
					/>
				)}
				<Heading size="medium" testId="header-title-side-nav">
					{title}
				</Heading>
			</Flex>
			<Inline space="space.050" alignBlock="center">
				{onNewChatButtonClick && (
					<NewChatButton onClick={onNewChatButtonClick} isDisabled={newChatButtonDisabled} />
				)}
				{onCloseButtonClick && <CloseButton onClick={onCloseButtonClick} inDynamicHeader />}
			</Inline>
		</Flex>
	);
};
