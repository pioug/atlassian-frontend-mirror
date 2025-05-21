/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { forwardRef, Fragment, type MouseEvent } from 'react';

import { cssMap, jsx } from '@compiled/react';

import EmojiAtlassianIcon from '@atlaskit/icon/glyph/emoji/atlassian';
import SettingsIcon from '@atlaskit/icon/glyph/settings';
import { Box } from '@atlaskit/primitives/compiled';

import {
	type CustomItemComponentProps,
	GoBackItem,
	NestableNavigationContent,
	NestingItem,
	Section,
} from '../src';

const styles = cssMap({
	container: {
		overflow: 'hidden',
		height: '340px',
	},
	customItem: {
		// Need to increase specificity here until @atlaskit/menu has been migrated to @compiled/react
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
		'&&': {
			color: 'red',
			'&:hover': {
				color: 'blue',
			},
		},
	},
});

const CustomNestingItem = forwardRef(
	(
		{ children, href, ...props }: CustomItemComponentProps & { href: string },
		ref: React.Ref<HTMLAnchorElement>,
	) => {
		return (
			// eslint-disable-next-line @atlaskit/design-system/no-html-anchor
			<a href={href} {...props} ref={ref}>
				{children}
			</a>
		);
	},
);

const BasicExample = () => {
	return (
		// eslint-disable-next-line @atlassian/a11y/interactive-element-not-keyboard-focusable
		<Box xcss={styles.container} onClick={(e: MouseEvent) => e.preventDefault()}>
			<NestableNavigationContent>
				<Section title="Nesting items">
					<NestingItem id="0" title="Settings">
						<Fragment />
					</NestingItem>
					<NestingItem
						testId="selected"
						id="1"
						isSelected
						iconBefore={<SettingsIcon label="" />}
						title="Settings"
					>
						<Fragment />
					</NestingItem>
					<NestingItem description="I have a description" id="2" title="Settings">
						<Fragment />
					</NestingItem>
					<NestingItem
						id="3"
						iconBefore={<SettingsIcon label="" />}
						iconAfter={<EmojiAtlassianIcon label="" />}
						title="Settings"
						description="I have a custom after element"
					>
						<Fragment />
					</NestingItem>
					<NestingItem
						id="4"
						iconBefore={<SettingsIcon label="" />}
						title="Settings"
						description="I have a custom back button"
						// eslint-disable-next-line @repo/internal/react/no-unsafe-overrides
						overrides={{
							GoBackItem: {
								render: (props) => (
									<GoBackItem isSelected {...props}>
										Go home, man!
									</GoBackItem>
								),
							},
						}}
					>
						<Fragment />
					</NestingItem>
					<NestingItem
						id="5"
						iconBefore={<SettingsIcon label="" />}
						title="Settings"
						description="I'm disabled"
						isDisabled
					>
						<Fragment />
					</NestingItem>
					<NestingItem
						id="6"
						href="/custom-link"
						iconBefore={<SettingsIcon label="" />}
						title="Settings"
						css={styles.customItem}
						description="I have a custom item"
						component={CustomNestingItem}
					>
						<Fragment />
					</NestingItem>
				</Section>
			</NestableNavigationContent>
		</Box>
	);
};

export default BasicExample;
