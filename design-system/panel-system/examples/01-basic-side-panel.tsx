/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { cssMap, jsx } from '@atlaskit/css';
import Heading from '@atlaskit/heading';
import ProjectIcon from '@atlaskit/icon/core/project';
import {
	PanelActionClose,
	PanelActionExpand,
	PanelActionGroup,
	PanelActionMore,
	PanelActionNewTab,
	PanelBody,
	PanelContainer,
	PanelFooter,
	PanelHeader,
	PanelTitle,
} from '@atlaskit/panel-system';
import { Box, Flex, Stack, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	layout: {
		height: '100vh',
		width: '100%',
	},
	mainContent: {
		flex: 1,
		paddingBlockStart: token('space.300'),
		paddingInlineEnd: token('space.300'),
		paddingBlockEnd: token('space.300'),
		paddingInlineStart: token('space.300'),
		backgroundColor: token('color.background.neutral.subtle'),
	},
	panelWrapper: {
		width: '400px',
		borderInlineStart: `${token('border.width')} solid ${token('color.border')}`,
	},
});

export function BasicPanelExample() {
	const handleExpand = () => {
		console.log('Panel expanded');
	};

	const handleNewTab = () => {
		console.log('Opening in new tab');
	};

	const handleMore = () => {
		console.log('More actions clicked');
	};

	const handleClose = () => {
		console.log('Panel closed');
	};

	return (
		<Flex xcss={styles.layout}>
			<Box xcss={styles.mainContent}>
				<Stack space="space.200">
					<Heading size="medium">Main Content Area</Heading>
					<Text>
						This is the main content area where your application content would typically be
						displayed. The panel component appears as a side panel on the right side of the screen.
					</Text>
					<Text>
						The panel system provides a standardized way to display contextual information, forms,
						or additional content without navigating away from the main view.
					</Text>
				</Stack>
			</Box>

			<Box xcss={styles.panelWrapper}>
				<PanelContainer testId="preview-panel">
					<PanelHeader>
						<PanelTitle icon={<ProjectIcon size="small" label="Project" />}>
							Project: Panel System
						</PanelTitle>
						<PanelActionGroup>
							<PanelActionExpand onClick={handleExpand} testId="expand-action" />
							<PanelActionNewTab
								href="/projects/blueshift"
								onClick={handleNewTab}
								testId="new-tab-action"
							/>
							<PanelActionMore onClick={handleMore} testId="more-action" />
							<PanelActionClose onClick={handleClose} testId="close-action" />
						</PanelActionGroup>
					</PanelHeader>
					<PanelBody>
						<Stack space="space.200">
							<Heading size="small">Project Overview</Heading>
							<Text>
								Panel System is a set of platform components to standardize the look and feel of
								panels in Atlassian products.
							</Text>
							<Heading size="xsmall">Key Features</Heading>
							<Box as="ul">
								<Box as="li">Unified design system components</Box>
								<Box as="li">Consistent navigation patterns</Box>
								<Box as="li">Improved accessibility standards</Box>
								<Box as="li">Enhanced performance metrics</Box>
							</Box>
							<Heading size="xsmall">Team</Heading>
							<Text>Led by the Design System team.</Text>
						</Stack>
					</PanelBody>
					<PanelFooter>
						<Stack space="space.100">
							<Text size="small" color="color.text.subtle">
								Status: Active
							</Text>
							<Text size="small" color="color.text.subtle">
								Last modified: {new Date().toLocaleDateString()}
							</Text>
						</Stack>
					</PanelFooter>
				</PanelContainer>
			</Box>
		</Flex>
	);
}

export default BasicPanelExample;
