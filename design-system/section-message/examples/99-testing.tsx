import React from 'react';

import { cssMap } from '@atlaskit/css';
import { Box, Stack, Text } from '@atlaskit/primitives/compiled';
import SectionMessage, { SectionMessageAction } from '@atlaskit/section-message';
import { token } from '@atlaskit/tokens';

const definitionListStyles = cssMap({
	list: {
		display: 'flex',
		justifyContent: 'stretch',
		gap: token('space.100'),
		flexDirection: 'column',
		marginBlockStart: token('space.0'),
		paddingInlineStart: token('space.0'),
	},
	item: {
		marginInlineStart: token('space.0'),
		marginBlockStart: token('space.0'),
		marginBlockEnd: token('space.0'),
		marginInlineEnd: token('space.0'),
	},
});

const Example = (): React.JSX.Element => (
	<Box padding="space.100">
		<Stack space="space.200">
			<SectionMessage
				appearance="information"
				title="Atlassian"
				testId="info-section-message"
				actions={[
					<SectionMessageAction href="#hiAtlassianBitbucket" testId="bitbucket">
						Bitbucket
					</SectionMessageAction>,
					<SectionMessageAction href="#hiAtlassianJira" testId="jira">
						Jira
					</SectionMessageAction>,
				]}
			>
				<Stack space="space.100">
					<Text as="p">
						Atlassian provides the tools to help every team unleash their full potential.
					</Text>
					<Box as="dl" xcss={definitionListStyles.list}>
						<Box as="dt" xcss={definitionListStyles.item}>
							<Text weight="bold">Bitbucket:</Text>
						</Box>
						<Box as="dd" xcss={definitionListStyles.item}>
							<Text as="p">
								Bitbucket is more than just Git code management. Bitbucket gives teams one place to
								plan projects, collaborate on code, test, and deploy.
							</Text>
						</Box>
						<Box as="dt" xcss={definitionListStyles.item}>
							<Text weight="bold">Jira:</Text>
						</Box>
						<Box as="dd" xcss={definitionListStyles.item}>
							<Text as="p">The #1 software development tool used by agile teams.</Text>
						</Box>
					</Box>
				</Stack>
			</SectionMessage>
			<SectionMessage
				appearance="error"
				testId="error-section-message"
				actions={
					<SectionMessageAction href="https://about.google/" testId="google">
						Google
					</SectionMessageAction>
				}
			>
				<Stack space="space.100">
					<Text weight="bold">Google:</Text>
					<Text as="p">
						Our mission is to organise the world’s information and make it universally accessible
						and useful.
					</Text>
				</Stack>
			</SectionMessage>
			<SectionMessage
				title="this/is/a/really/long/path/to/a/file/to/test/if/the/section/message/component/will/correctly/wrap/words/onto/new/lines/to/prevent/the/text/overflowing/the/component/which/causes/display/issues"
				testId="overflow-section-message"
			>
				<Text as="p">
					this/is/a/really/long/path/to/a/file/to/test/if/the/section/message/component/will/correctly/wrap/words/onto/new/lines/to/prevent/the/text/overflowing/the/component/which/causes/display/issues
				</Text>
			</SectionMessage>
			<SectionMessage
				title="Testing actions overflow"
				testId="overflow-actions-section-message"
				actions={[
					<SectionMessageAction href="#1">Action 1</SectionMessageAction>,
					<SectionMessageAction href="#2">Action 2</SectionMessageAction>,
					<SectionMessageAction href="#3">Action 3</SectionMessageAction>,
					<SectionMessageAction href="#4">Action 4</SectionMessageAction>,
					<SectionMessageAction href="#5">Action 5</SectionMessageAction>,
					<SectionMessageAction href="#6">Action 6</SectionMessageAction>,
					<SectionMessageAction href="#7">Action 7</SectionMessageAction>,
					<SectionMessageAction href="#8">Action 8</SectionMessageAction>,
					<SectionMessageAction href="#9">Action 9</SectionMessageAction>,
					<SectionMessageAction href="#10">Action 10</SectionMessageAction>,
					<SectionMessageAction href="#11">Action 11</SectionMessageAction>,
					<SectionMessageAction href="#12">Action 12</SectionMessageAction>,
					<SectionMessageAction href="#13">Action 13</SectionMessageAction>,
					<SectionMessageAction href="#14">Action 14</SectionMessageAction>,
					<SectionMessageAction href="#15">Action 15</SectionMessageAction>,
					<SectionMessageAction href="#16">Action 16</SectionMessageAction>,
					<SectionMessageAction href="#17">Action 17</SectionMessageAction>,
					<SectionMessageAction href="#18">Action 18</SectionMessageAction>,
					<SectionMessageAction href="#19">Action 19</SectionMessageAction>,
					<SectionMessageAction href="#20">Action 20</SectionMessageAction>,
				]}
			>
				<Text as="p">
					This Section Message has lots of actions. This is a test to ensure they don't overflow
				</Text>
			</SectionMessage>
		</Stack>
	</Box>
);

export default Example;
