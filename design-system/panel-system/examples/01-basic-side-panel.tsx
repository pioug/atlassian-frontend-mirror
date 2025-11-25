/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import Button from '@atlaskit/button/new';
import { Checkbox } from '@atlaskit/checkbox';
import { cssMap, jsx } from '@atlaskit/css';
import Heading from '@atlaskit/heading';
import { IconTile } from '@atlaskit/icon';
import { ConfluenceIcon } from '@atlaskit/logo';
import {
	PanelActionBack,
	PanelActionClose,
	PanelActionGroup,
	PanelActionMore,
	PanelActionNewTab,
	PanelBody,
	PanelContainer,
	PanelFooter,
	PanelHeader,
	PanelSubheader,
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
	},
});

export function BasicPanelExample() {
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
						<PanelActionBack onClick={() => {}} testId="back-action" />
						<PanelTitle
							icon={
								<IconTile
									icon={() => <ConfluenceIcon shouldUseNewLogoDesign label="" size="xxsmall" />}
									label="Confluence"
									appearance="blueBold"
									size="xsmall"
								/>
							}
						>
							Confluence Page
						</PanelTitle>
						<PanelActionGroup>
							<PanelActionNewTab
								href="/projects/blueshift"
								onClick={() => {}}
								testId="new-tab-action"
							/>
							<PanelActionMore onClick={() => {}} testId="more-action" />
							<PanelActionClose onClick={() => {}} testId="close-action" />
						</PanelActionGroup>
					</PanelHeader>
					<PanelSubheader title="Subheading title" />
					<PanelBody>
						<Stack space="space.200">
							<Heading size="small" as="h3">
								Project Overview
							</Heading>
							<Text>
								Panel System is a set of platform components to standardize the look and feel of
								panels in Atlassian products.
							</Text>
							<Heading size="xsmall" as="h4">
								Key Features
							</Heading>
							<Box as="ul">
								<Box as="li">Unified design system components</Box>
								<Box as="li">Consistent navigation patterns</Box>
								<Box as="li">Improved accessibility standards</Box>
								<Box as="li">Enhanced performance metrics</Box>
							</Box>
							<Heading size="xsmall" as="h4">
								Team
							</Heading>
							<Text>Led by the Design System team.</Text>
						</Stack>
					</PanelBody>
					<PanelFooter>
						<Checkbox label="Create another" isChecked={false} onChange={() => {}} />
						<Button appearance="primary" onClick={() => {}}>
							Save
						</Button>
					</PanelFooter>
				</PanelContainer>
			</Box>
		</Flex>
	);
}

export default BasicPanelExample;
