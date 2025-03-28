/* eslint-disable @repo/internal/react/consistent-props-definitions */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { cssMap, jsx } from '@compiled/react';

import warnOnce from '@atlaskit/ds-lib/warn-once';
import { Box, Stack, Text } from '@atlaskit/primitives/compiled';
import { N500 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { Container, type HeaderProps } from '../Header';
import { CustomItem } from '../Item';

const styles = cssMap({
	iconContainer: {
		display: 'inline-block',
		width: '1.5rem',
		height: '1.5rem',
	},
	oldFooter: {
		// Need to increase specificity here until CustomItem is updated to use @compiled/react
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
		'&&': {
			userSelect: 'auto',
			display: 'block',
			textAlign: 'center',
			minHeight: '24px',
			alignItems: 'center',
			width: '100%',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'[data-item-elem-before]': {
			marginRight: token('space.0', '0px'),
			marginBottom: token('space.100', '8px'),
			display: 'inline-block',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'[data-item-title]': {
			textAlign: 'center',
			font: token('font.body.UNSAFE_small'),
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'[data-item-description]': {
			textAlign: 'center',
			display: 'inline-block',
			marginTop: token('space.075', '6px'),
			marginRight: token('space.075', '6px'),
			marginBottom: token('space.075', '6px'),
			marginLeft: token('space.075', '6px'),
		},
		// Will look interactive if the `component` is anything other than a div.
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'div&:hover': {
			backgroundColor: token('color.background.neutral.subtle', 'transparent'),
			cursor: 'default',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'div&:active': {
			backgroundColor: token('color.background.neutral.subtle', 'transparent'),
			color: token('color.text.subtle', N500),
		},
	},
});

type NewFooterProps = Omit<HeaderProps, 'component' | 'onClick'>;

type FooterFacadeProps =
	| (HeaderProps & {
			/**
			 * @private
			 * @deprecated
			 */
			useDeprecatedApi?: true;
	  })
	| (NewFooterProps & {
			/**
			 * @private
			 * @deprecated
			 */
			useDeprecatedApi?: false;
			component?: never;
			onClick?: never;
	  });

export type FooterProps = HeaderProps | NewFooterProps;

/**
 * __Footer__
 *
 * - [Examples](https://atlassian.design/components/side-navigation/examples#header-and-footer)
 * - [Code](https://atlassian.design/components/side-navigation/code)
 */
const OldFooter = (props: HeaderProps) => {
	// https://stackoverflow.com/a/39333479
	const safeProps = (({ iconBefore, onClick, description, children, testId }) => ({
		iconBefore,
		onClick,
		description,
		children,
		testId,
	}))(props);
	return (
		<CustomItem {...safeProps} component={props.component || Container} css={styles.oldFooter} />
	);
};

/**
 * __Footer__
 *
 * - [Examples](https://atlassian.design/components/side-navigation/examples#header-and-footer)
 * - [Code](https://atlassian.design/components/side-navigation/code)
 */
const Footer = ({ description, children, iconBefore, testId }: NewFooterProps) => {
	return (
		<Box padding="space.100" testId={testId}>
			<Stack space="space.100" alignInline="center">
				<Box xcss={styles.iconContainer}>{iconBefore}</Box>
				<Stack space="space.075">
					<Text size="UNSAFE_small" align="center" color="inherit">
						{children}
					</Text>
					{description && (
						<Text size="UNSAFE_small" as="p" align="center" color="color.text.subtlest">
							{description}
						</Text>
					)}
				</Stack>
			</Stack>
		</Box>
	);
};

/**
 * __Footer__
 *
 * - [Examples](https://atlassian.design/components/side-navigation/examples#header-and-footer)
 * - [Code](https://atlassian.design/components/side-navigation/code)
 */
const FooterFacade = ({
	useDeprecatedApi = true,
	description,
	iconBefore,
	testId,
	children,
	component,
	onClick,
}: FooterFacadeProps) => {
	if (!useDeprecatedApi) {
		return (
			<Footer iconBefore={iconBefore} description={description} testId={testId}>
				{children}
			</Footer>
		);
	}

	if (
		typeof process !== 'undefined' &&
		process.env.NODE_ENV !== 'production' &&
		process.env.NODE_ENV !== 'CI'
	) {
		warnOnce(
			'The `@atlaskit/side-navigation` Footer has simplified its API, removing support for the `component` and `onClick` props.\n\nThese props will stop working in a future major release. Reach out to #help-design-system on slack for help.',
		);
	}

	return (
		<OldFooter
			onClick={onClick}
			component={component}
			iconBefore={iconBefore}
			description={description}
			testId={testId}
		>
			{children}
		</OldFooter>
	);
};

export default FooterFacade;
