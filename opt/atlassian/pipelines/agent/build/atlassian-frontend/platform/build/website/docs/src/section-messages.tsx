/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import SectionMessage from '@atlaskit/section-message';
import { token } from '@atlaskit/tokens';
import { cssMap, jsx } from '@atlaskit/css';
import { Text } from '@atlaskit/primitives/compiled';

const wrapperStyles = cssMap({
	root: {
		marginBlockEnd: token('space.100'),
		marginBlockStart: token('space.100'),
	},
});

export const AtlassianInternalWarning = () => (
	<div css={wrapperStyles.root}>
		<SectionMessage
			title="Note: This component is designed for internal Atlassian development."
			appearance="warning"
		>
			<Text as="p">
				External contributors will be able to use this component but will not be able to submit
				issues.
			</Text>
		</SectionMessage>
	</div>
);

export const DevPreviewWarning = () => (
	<div css={wrapperStyles.root}>
		<SectionMessage
			title="Note: This component is currently in developer preview."
			appearance="warning"
		>
			<Text as="p">
				Please experiment with and test this package, but be aware that the API may change at any
				time. Use at your own risk, preferably not in production.
			</Text>
		</SectionMessage>
	</div>
);


