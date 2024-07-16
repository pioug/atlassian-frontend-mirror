/**
 * @jsxRuntime classic
 */
/** @jsx jsx */

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

const containerStyles = css({
	borderRadius: '8px',
	marginBlockEnd: token('space.0'),
	marginBlockStart: token('space.400'),
	marginInline: token('space.negative.200'),
	paddingBlock: token('space.100'),
	paddingInline: token('space.200'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'h3 + &': {
		marginBlockStart: '0px',
	},
});

const tableStyles = css({
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
});

const headerStyles = css({
	borderBlockEnd: `1px solid ${token('color.border')}`,
	fontSize: '1em',
	fontWeight: 'normal',
	lineHeight: '1.4',
	marginBlockEnd: token('space.050'),
	paddingBlockEnd: token('space.100'),
});

const codeStyles = css({
	display: 'inline-block',
	backgroundColor: token('color.background.neutral'),
	borderRadius: '3px',
	color: token('color.text'),
	fontSize: '1em',
	lineHeight: '20px',
	paddingBlock: token('space.050', '4px'),
	paddingInline: token('space.100', '8px'),
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
		<div css={containerStyles}>
			<table css={tableStyles}>
				{/* eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
				<caption css={{ textAlign: 'left', margin: '0', fontSize: '1em' }}>
					<h3 css={headerStyles}>
						<code css={codeStyles}>{propName}</code>
						{required && defaultValue === undefined && (
							<code
								// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
								css={{
									marginLeft: '1em',
									color: `${token('color.text.danger')}`,
								}}
							>
								required
							</code>
						)}
						{deprecated && (
							<code
								// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
								css={{
									marginLeft: '1em',
									color: `${token('color.text.disabled')}`,
								}}
							>
								deprecated
							</code>
						)}
					</h3>
				</caption>
				<tbody>
					<tr>
						<th scope="row">Description</th>
						<td>{description}</td>
					</tr>
					{defaultValue !== undefined && (
						<tr>
							<th scope="row">Default</th>
							<td>
								<code
									// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
									css={{
										color: `${token('color.text.subtle')}`,
									}}
								>
									{defaultValue}
								</code>
							</td>
						</tr>
					)}
					<tr>
						<th>Type</th>
						{/* eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
						<td css={{ display: 'flex', flexDirection: 'column' }}>
							<span>
								<code
									// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
									css={{
										background: token('color.background.neutral'),
										color: token('color.text.subtle'),
										borderRadius: '3px',
										display: 'inline-block',
										padding: '0 0.2em',
										whiteSpace: 'pre-wrap',
									}}
								>
									{typing}
								</code>
							</span>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
};

export default TokenPropsTable;
