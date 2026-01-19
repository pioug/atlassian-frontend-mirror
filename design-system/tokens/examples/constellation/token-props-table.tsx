/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { cssMap, jsx } from '@compiled/react';

import { Code } from '@atlaskit/code';
import { Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	container: {
		borderRadius: token('radius.large'),
		marginBlockEnd: token('space.0'),
		marginBlockStart: token('space.400'),
		marginInline: token('space.negative.200'),
		paddingBlock: token('space.100'),
		paddingInline: token('space.200'),
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
		'h3 + &': {
			marginBlockStart: '0px',
		},
	},
	table: {
		width: '100%',
		borderCollapse: 'collapse',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		th: {
			paddingBlockEnd: token('space.050'),
			paddingBlockStart: token('space.050'),
			paddingInlineEnd: token('space.200'),
			paddingInlineStart: token('space.100'),
			textAlign: 'left',
			verticalAlign: 'top',
			whiteSpace: 'nowrap',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		td: {
			width: '100%',
			paddingBlockEnd: token('space.050'),
			paddingBlockStart: token('space.050'),
			paddingInlineStart: token('space.100'),
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		tbody: {
			borderBlockEnd: 'none',
		},
	},
	header: {
		borderBlockEnd: `1px solid ${token('color.border')}`,
		fontSize: '1em',
		fontWeight: token('font.weight.regular'),
		lineHeight: '1.4',
		marginBlockEnd: token('space.050'),
		paddingBlockEnd: token('space.100'),
	},
	code: {
		display: 'inline-block',
		backgroundColor: token('color.background.neutral'),
		borderRadius: token('radius.small'),
		color: token('color.text'),
		fontSize: '1em',
		lineHeight: '20px',
		paddingBlock: token('space.050'),
		paddingInline: token('space.100'),
	},
	caption: {
		textAlign: 'left',
		margin: '0',
		fontSize: '1em',
	},
	required: {
		marginLeft: '1em',
		color: `${token('color.text.danger')}`,
	},
	deprecated: {
		marginLeft: '1em',
		color: `${token('color.text.disabled')}`,
	},
	type: {
		display: 'flex',
		flexDirection: 'column',
	},
});

const TokenPropsTable = ({
	propName,
	description,
	typing,
	required,
	defaultValue,
	deprecated,
}: {
	propName: string;
	description: string;
	typing: string;
	required?: boolean;
	defaultValue?: any;
	deprecated?: boolean;
}) => {
	return (
		<div css={styles.container}>
			<table css={styles.table}>
				<caption css={styles.caption}>
					<h3 css={styles.header}>
						<code css={styles.code}>{propName}</code>
						{required && defaultValue === undefined && <code css={styles.required}>required</code>}
						{deprecated && <code css={styles.deprecated}>deprecated</code>}
					</h3>
				</caption>
				<tbody>
					<tr>
						<th scope="row">
							<Text size="small" weight="bold" color="color.text.subtlest">
								Description
							</Text>
						</th>
						<td>{description}</td>
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
						<th>
							<Text size="small" weight="bold" color="color.text.subtlest">
								Type
							</Text>
						</th>
						<td css={styles.type}>
							<span>
								<Code>{typing}</Code>
							</span>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
};

export default TokenPropsTable;
