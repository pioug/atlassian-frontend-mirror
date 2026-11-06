/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx, cssMap as unboundedCssMap } from '@compiled/react';

import { Inline } from '@atlaskit/primitives/compiled/inline';
import { token } from '@atlaskit/tokens';

const shortcutStyles = unboundedCssMap({
	shortcutSegment: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		height: '1.25rem', // 20px
		minWidth: '1.25rem',
		boxSizing: 'border-box',
		paddingInlineStart: token('space.075'),
		paddingInlineEnd: token('space.075'),
		font: token('font.body.small'),
		border: 'none',
		borderRadius: token('radius.xsmall'),
		// We need to explicitly unset these properties to override global styles in apps.
		// For example, Jira has global styles targeting `<kbd>` elements:
		// https://bitbucket.org/atlassian/jira/src/bc50abb933ef681a0a9d33eacf27d9863c6c29bd/jira-components/jira-legacy-frontend/jira-legacy-web-resources/src/main/resources/ui/aui-layout/core.less#lines-22:43
		boxShadow: 'unset',
		'-webkit-box-shadow': 'unset',
		'-moz-box-shadow': 'unset',
		color: token('color.text'),
		marginInlineStart: 'unset',
		marginInlineEnd: 'unset',
		marginBlockStart: 'unset',
		marginBlockEnd: 'unset',
		textShadow: 'unset',
		// This needs `!important` to override a more specific global style in Jira:
		// https://bitbucket.org/atlassian/jira/src/bc50abb933ef681a0a9d33eacf27d9863c6c29bd/jira-components/jira-legacy-frontend/jira-atlaskit-module/src/main/resources/jira-atlaskit-module/css/adg3-general-overrides.less#lines-1449:1451
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
		backgroundColor: `${token('color.background.neutral')} !important`,
	},
});

export type Shortcut = string[];

type KeyboardShortcutProps = {
	shortcut: Shortcut;
};

const KeyboardShortcut = ({ shortcut }: KeyboardShortcutProps): JSX.Element => (
	<Inline space="space.025">
		{shortcut.map((segment, index) => (
			<kbd key={`${segment}-${index}`} css={shortcutStyles.shortcutSegment}>
				{segment}
			</kbd>
		))}
	</Inline>
);

export default KeyboardShortcut;
