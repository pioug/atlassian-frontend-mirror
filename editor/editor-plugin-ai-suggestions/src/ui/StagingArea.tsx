// Ignoring i18n rule for now while this is WIP
/* eslint-disable @atlassian/i18n/no-literal-string-in-jsx */
import React from 'react';

import { cssMap } from '@compiled/react';

import { ButtonGroup } from '@atlaskit/button';
import Button, { IconButton } from '@atlaskit/button/new';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import CrossIcon from '@atlaskit/icon/core/cross';
import LayoutTwoColumnsIcon from '@atlaskit/icon/core/layout-two-columns';
import PanelRightIcon from '@atlaskit/icon/core/panel-right';
import Lozenge from '@atlaskit/lozenge';
import Modal, { ModalBody } from '@atlaskit/modal-dialog';
import { Box, Flex, Inline, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import type { AiSuggestionsPlugin } from '../aiSuggestionsPluginType';

const styles = cssMap({
	headerContainer: {
		width: '100%',
		paddingTop: token('space.200'),
		paddingRight: token('space.300'),
		paddingBottom: token('space.300'),
		paddingLeft: token('space.300'),
	},
	columnsContainer: {
		height: '100%',
		paddingTop: token('space.200'),
		paddingRight: token('space.200'),
		paddingBottom: token('space.200'),
		paddingLeft: token('space.200'),
	},
	column: {
		flex: 1,
		backgroundColor: token('elevation.surface'),
		borderRadius: token('radius.large'),
		borderWidth: token('border.width'),
		borderColor: token('color.border'),
		borderStyle: 'solid',
		minHeight: '100%',
		paddingTop: token('space.100'),
		paddingRight: token('space.100'),
		paddingBottom: token('space.100'),
		paddingLeft: token('space.100'),
	},
	viewSwitcherContainer: {
		borderRadius: token('radius.large'),
		backgroundColor: token('elevation.surface'),
		paddingTop: token('space.050'),
		paddingRight: token('space.050'),
		paddingBottom: token('space.050'),
		paddingLeft: token('space.050'),
	},
});
const globalStylesCompiled = `
	.atlaskit-portal [data-testid="suggestions-staging-area-modal"] {
		border-radius: 16px;
        background-color: ${token('elevation.surface.sunken')};
	}
`;

const globalStyles = () => (
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-global-styles
	<style
		data-testid="global-styles"
		type="text/css"
		// eslint-disable-next-line react/no-danger
		dangerouslySetInnerHTML={{ __html: globalStylesCompiled }}
	/>
);

export const StagingArea = ({
	api: _api,
	onClose,
}: {
	api?: ExtractInjectionAPI<AiSuggestionsPlugin>;
	onClose: () => void;
}) => {
	return (
		<Modal onClose={onClose} width="100%" height="100%" testId="suggestions-staging-area-modal">
			{globalStyles()}
			<ModalBody hasInlinePadding={false}>
				<Flex alignItems="center" justifyContent="space-between" xcss={styles.headerContainer}>
					<Inline space="space.100" alignBlock="center">
						<Text weight="bold">Title</Text>
						<Lozenge appearance="neutral">Review • Only visible to you</Lozenge>
					</Inline>
					<Box xcss={styles.viewSwitcherContainer}>
						<Inline space="space.100" alignBlock="center">
							{/* TODO: i18n for "View" */}
							<Text size="small" color="color.text.subtlest">
								View
							</Text>
							<ButtonGroup>
								<IconButton
									icon={LayoutTwoColumnsIcon}
									label="view1"
									appearance="subtle"
									isSelected
									spacing="compact"
								/>
								<IconButton
									icon={PanelRightIcon}
									label="view2"
									appearance="subtle"
									isDisabled
									spacing="compact"
								/>
							</ButtonGroup>
						</Inline>
					</Box>
					<Inline space="space.100">
						<Button appearance="primary">Apply changes</Button>
						<IconButton icon={CrossIcon} label="close" appearance="default" onClick={onClose} />
					</Inline>
				</Flex>
				<Flex gap="space.200" xcss={styles.columnsContainer}>
					<Box xcss={styles.column}>
						<Lozenge appearance="neutral">Original • View only</Lozenge>
					</Box>
					<Box xcss={styles.column}>
						<Lozenge appearance="discovery">Suggested</Lozenge>
					</Box>
				</Flex>
			</ModalBody>
		</Modal>
	);
};
