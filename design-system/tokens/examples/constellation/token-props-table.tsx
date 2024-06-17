/** @jsx jsx */

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import { gridSize } from '@atlaskit/theme/constants';

import token from '../../src/get-token';

const containerStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	margin: `${gridSize() * 4}px -${gridSize() * 2}px 0`,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	padding: `${gridSize()}px ${gridSize() * 2}px`,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	borderRadius: `${gridSize()}px`,
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
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		padding: `${gridSize() / 2}px ${gridSize() * 2}px ${gridSize() / 2}px ${gridSize()}px`,
		textAlign: 'left',
		verticalAlign: 'top',
		whiteSpace: 'nowrap',
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	td: {
		width: '100%',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		padding: `${gridSize() / 2}px 0 ${gridSize() / 2}px ${gridSize()}px`,
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	tbody: {
		borderBlockEnd: 'none',
	},
});

const headerStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	margin: `0 0 ${gridSize() / 2}px 0`,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	borderBlockEnd: `1px solid ${token('color.border')}`,
	fontSize: '1em',
	fontWeight: 'normal',
	lineHeight: '1.4',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	paddingBlockEnd: `${gridSize()}px`,
});

const codeStyles = css({
	display: 'inline-block',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	backgroundColor: token('color.background.neutral'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	borderRadius: token('border.radius.100', '3px'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	color: `${token('color.text')}`,
	fontSize: '1em',
	lineHeight: '20px',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	paddingBlock: token('space.050', '4px'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
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
				<caption css={{ textAlign: 'left', margin: '0', fontSize: '1em' }}>
					<h3 css={headerStyles}>
						<code css={codeStyles}>{propName}</code>
						{required && defaultValue === undefined && (
							<code
								css={{
									marginLeft: '1em',
									// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
									color: `${token('color.text.danger')}`,
								}}
							>
								required
							</code>
						)}
						{deprecated && (
							<code
								css={{
									marginLeft: '1em',
									// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
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
									css={{
										// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
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
						<td css={{ display: 'flex', flexDirection: 'column' }}>
							<span>
								<code
									css={{
										// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
										background: `${token('color.background.neutral')}`,
										// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
										color: `${token('color.text.subtle')}`,
										// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
										borderRadius: token('border.radius.100', '3px'),
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
