/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { cssMap, jsx } from '@compiled/react';

import IconButton from '@atlaskit/button/icon/button';
import Heading from '@atlaskit/heading/heading';
import ChevronLeftLargeIcon from '@atlaskit/icon/core/chevron-left';
import { Flex, Inline } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { type HeaderContent } from '../../model/HelpLayout';
import CloseButton from '../Header/CloseButton';
import { NewChatButton } from './NewChatButton';

const styles = cssMap({
	container: {
		paddingTop: token('space.200'),
		paddingRight: token('space.200'),
		paddingBottom: token('space.200'),
		paddingLeft: token('space.200'),
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
