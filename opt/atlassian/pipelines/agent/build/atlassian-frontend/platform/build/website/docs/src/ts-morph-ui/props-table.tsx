/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { memo, type ReactNode } from 'react';

import { jsx, keyframes } from '@compiled/react';

import { LayoutRenderer } from 'pretty-proptypes';

import Heading from '@atlaskit/heading';
import SimpleMarkdownRenderer from './simple-markdown-renderer';
import { Code } from '@atlaskit/code';
import { cssMap, cx } from '@atlaskit/css';
import Lozenge from '@atlaskit/lozenge';
import { Inline, Pressable, Text } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

const highlight = keyframes({
	'0%': {
		backgroundColor: token('color.background.accent.blue.subtlest'),
	},
	'100%': {
		backgroundColor: 'transparent',
	},
});

// Disable type-checking as pretty-props > @emotion/core is changing the type of the css-prop
const styles: any = cssMap({
	required: {
		color: token('color.text.danger'),
	},
	container: {
		marginBlockStart: token('space.400'),
		marginInline: token('space.negative.200'),
		paddingBlock: token('space.100'),
		paddingInline: token('space.200'),
		borderRadius: token('radius.large'),
		// @ts-expect-error -- TODO: Nested styles aren't allowed!
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
		'&:first-of-type:is(div)': {
			marginBlockStart: 0,
		},
		'&:target': {
			animationName: highlight,
			animationDuration: '250ms',
			animationDelay: '2.5s',
			animationTimingFunction: 'ease-out',
			animationFillMode: 'forwards',
			backgroundColor: token('color.background.accent.blue.subtlest'),
		},
	},
	code: {
		// @ts-expect-error -- TODO: Nested styles aren't allowed!
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
		'&:first-of-type:is(code)': {
			paddingTop: token('space.050'),
			paddingRight: token('space.100'),
			paddingBottom: token('space.050'),
			paddingLeft: token('space.100'),
			font: token('font.body'),
			fontFamily: token('font.family.code'),
		},
	},
	deprecated: { textDecoration: 'line-through' },
	table: {
		width: '100%',
		borderCollapse: 'collapse',
		// @ts-expect-error -- TODO: Nested styles aren't allowed!
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		th: {
			paddingTop: token('space.050'),
			paddingRight: token('space.200'),
			paddingBottom: token('space.050'),
			paddingLeft: token('space.100'),
			textAlign: 'left',
			verticalAlign: 'top',
			whiteSpace: 'nowrap',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		td: {
			width: '100%',
			paddingTop: token('space.050'),
			paddingRight: token('space.050'),
			paddingBottom: token('space.100'),
			paddingLeft: token('space.050'),
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		tbody: {
			borderBlockEnd: 'none',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		code: {
			overflowWrap: 'anywhere',
			wordBreak: 'normal',
		},
	},
	type: {
		display: 'inline-block',
		marginBlock: token('space.025'),
		paddingInline: token('space.025'),
		backgroundColor: token('color.background.discovery'),
		borderRadius: token('radius.small'),
		color: token('color.text.discovery'),
	},
	typeString: {
		backgroundColor: token('color.background.success'),
		color: token('color.text.success'),
	},
	typeMeta: {
		backgroundColor: token('color.background.neutral'),
		color: token('color.text.subtle'),
	},
	td: {
		display: 'flex',
		flexDirection: 'column',
	},
	description: {
		// @ts-expect-error -- TODO: Nested styles aren't allowed!
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
		'p:first-of-type': {
			marginBlockStart: 0,
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
		'p:last-of-type': {
			marginBlockEnd: 0,
		},
	},
	caption: {
		margin: '0',
		// @ts-expect-error -- …
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		fontSize: '1em',
		textAlign: 'left',
	},
	propTitleContainer: {
		borderBlockEndWidth: token('border.width'),
		borderBlockEndStyle: 'solid',
		borderBlockEndColor: token('color.border'),
		marginBlockEnd: token('space.050'),
		paddingBlockEnd: token('space.100'),
	},
	expander: {
		borderRadius: token('radius.small'),
		font: token('font.body'),
		width: 'auto',
		marginBlock: token('space.025'),
		paddingInline: token('space.025'),
		color: token('color.text.subtle'),
		backgroundColor: token('color.background.neutral'),
	},
	expanderHovered: {
		backgroundColor: token('color.background.discovery.hovered'),
	},
});

const Type = (props: { children: ReactNode }) => <span css={styles.type} {...props} />;

const StringType = (props: { children: ReactNode }) => (
	<span css={[styles.type, styles.stringType]} {...props} />
);
const Required = (props: { children: ReactNode }) => (
	<span css={styles.required}>{props.children}</span>
);

const Expander = ({
	isHovered,
	onMouseEnter,
	onMouseLeave,
	onClick,
	children,
}: {
	isHovered: boolean;
	onMouseEnter: () => void;
	onMouseLeave: () => void;
	onClick: () => void;
	children: ReactNode;
}) => (
	<Pressable
		onClick={onClick}
		xcss={cx(styles.expander, isHovered && styles.expanderHovered)}
		onMouseEnter={onMouseEnter}
		onMouseLeave={onMouseLeave}
	>
		{children}
	</Pressable>
);

const FunctionType = (props: { children: ReactNode }) => <span {...props} />;

const TypeMeta = (props: { children: ReactNode }) => (
	<span css={[styles.type, styles.typeMeta]} {...props} />
);

/**
 * __Prop table__
 */
export const PropTable = ({
	defaultValue,
	deprecated,
	description,
	name,
	required,
	type,
	typeValue,
	componentDisplayName,
}: {
	name: string;
	required: boolean;
	deprecated: boolean;
	defaultValue: any;
	description: string;
	type: any;
	typeValue: any;
	componentDisplayName?: string;
}) => {
	const titleId =
		componentDisplayName && typeof componentDisplayName === 'string'
			? `${componentDisplayName}-${name}`
			: name;

	return (
		<div id={titleId} css={styles.container}>
			<table css={styles.table}>
				<caption css={styles.caption}>
					<Inline xcss={styles.propTitleContainer} space="space.200" alignBlock="center">
						<Heading id={titleId} size="small">
							<Code css={[styles.code, deprecated && styles.deprecated]}>{name}</Code>
						</Heading>
						{required && <Lozenge appearance="removed">Required</Lozenge>}
						{deprecated && <Lozenge appearance="moved">Deprecated</Lozenge>}
					</Inline>
				</caption>
				<tbody>
					<tr>
						<th scope="row">
							<Text size="small" weight="bold" color="color.text.subtlest">
								Description
							</Text>
						</th>
						<td>
							<div css={styles.description}>
								{description ? (
									<SimpleMarkdownRenderer>
										{/* Deprecated tags are already extracted into a lozenge above using pretty-prop-types */}
										{description.replace('@deprecated', '')}
									</SimpleMarkdownRenderer>
								) : (
									<Text color="color.text.subtle">
										<i>No description.</i>
									</Text>
								)}
							</div>
						</td>
					</tr>
					{defaultValue !== undefined && (
						<tr>
							<th scope="row">
								<Text size="small" weight="bold" color="color.text.subtlest">
									Default
								</Text>
							</th>
							<td>
								<Code>{defaultValue}</Code>
							</td>
						</tr>
					)}
					<tr>
						<th scope="row">
							<Text size="small" weight="bold" color="color.text.subtlest">
								Type
							</Text>
						</th>
						<td css={styles.td}>
							<span>
								<Code>{type}</Code>
							</span>
							<span>{typeValue}</span>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
};

/**
 * __Props layout renderer__
 *
 * A props layout renderer {description}.
 *
 * - [Examples](https://atlassian.design/components/{packageName}/examples)
 * - [Code](https://atlassian.design/components/{packageName}/code)
 * - [Usage](https://atlassian.design/components/{packageName}/usage)
 */
const PropsLayoutRenderer = memo((props: any) => (
	<LayoutRenderer
		requiredPropsFirst
		{...props}
		renderType={({ components, typeValue, ...type }: any) => (
			<PropTable
				{...type}
				typeValue={
					<components.PropType
						typeValue={typeValue}
						components={{
							...components,
							Type,
							TypeMeta,
							StringType,
							FunctionType,
							Required,
							Expander,
						}}
					/>
				}
			/>
		)}
	/>
));

export default PropsLayoutRenderer;
