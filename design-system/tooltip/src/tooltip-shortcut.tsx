/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { cssMap, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';

const styles = cssMap({
	shortcutSegmentsContainer: {
		display: 'flex',
		gap: token('space.025'),
		paddingBlockStart: token('space.050'),
		paddingBlockEnd: token('space.025'),
	},
	shortcutSegment: {
		display: 'flex',
		alignItems: 'center',
		height: '1.25rem', // 20px
		boxSizing: 'border-box',
		paddingBlockStart: token('space.025'),
		paddingBlockEnd: token('space.025'),
		paddingInlineStart: token('space.075'),
		paddingInlineEnd: token('space.075'),
		font: token('font.body.small'),
		borderStyle: 'solid',
		borderWidth: token('border.width'),
		borderColor: token('color.border.bold'),
		borderRadius: token('radius.xsmall'),
		// We need to explicitly unset these properties to override global styles in apps.
		// For example, Jira has global styles targeting `<kbd>` elements:
		// https://bitbucket.org/atlassian/jira/src/bc50abb933ef681a0a9d33eacf27d9863c6c29bd/jira-components/jira-legacy-frontend/jira-legacy-web-resources/src/main/resources/ui/aui-layout/core.less#lines-22:43
		boxShadow: 'unset',
		'-webkit-box-shadow': 'unset',
		'-moz-box-shadow': 'unset',
		color: 'unset',
		marginInlineStart: 'unset',
		marginInlineEnd: 'unset',
		marginBlockStart: 'unset',
		marginBlockEnd: 'unset',
		minWidth: 'unset',
		textShadow: 'unset',
		// This needs `!important` to override a more specific global style in Jira:
		// https://bitbucket.org/atlassian/jira/src/bc50abb933ef681a0a9d33eacf27d9863c6c29bd/jira-components/jira-legacy-frontend/jira-atlaskit-module/src/main/resources/jira-atlaskit-module/css/adg3-general-overrides.less#lines-1449:1451
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
		backgroundColor: 'unset !important',
	},
});

type TooltipShortcutProps = {
	shortcut: string[];
};

/**
 * __Tooltip shortcut__
 *
 * An internal component that is used to display a keyboard shortcut within a tooltip, showing each key
 * as a styled segment after the main tooltip content.
 */
export const TooltipShortcut = ({ shortcut }: TooltipShortcutProps) => {
	return (
		<div css={styles.shortcutSegmentsContainer}>
			{shortcut.map((segment, index) => (
				<kbd
					key={`${segment}-${index}`}
					css={styles.shortcutSegment}
				>
					{segment}
				</kbd>
			))}
		</div>
	);
};
