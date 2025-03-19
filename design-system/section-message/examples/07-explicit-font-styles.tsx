/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { cssMap, jsx } from '@compiled/react';

import { Text } from '@atlaskit/primitives/compiled';
import SectionMessage, { SectionMessageAction } from '@atlaskit/section-message';

const styles = cssMap({
	root: {
		// Setting the default font to something extravagent to ensure the component overrides it.
		font: `italic 1.2rem "Fira Sans"`,
	},
});

export default function ExplicitFontStyles() {
	return (
		<div css={styles.root}>
			<SectionMessage
				title="Editing is restricted"
				testId="section-message"
				actions={[
					<SectionMessageAction href="https://https://atlassian.design/">
						Request edit access
					</SectionMessageAction>,
					<SectionMessageAction href="https://confluence.atlassian.com/jirasoftwareserver/permissions-overview-939938996.html">
						About permissions
					</SectionMessageAction>,
				]}
			>
				<Text as="p">
					You're not allowed to change these restrictions. It's either due to the restrictions on
					the page, or permission settings for this space.
				</Text>
			</SectionMessage>
		</div>
	);
}
