/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import { token } from '@atlaskit/tokens';
import {
	Card,
	type ElementItem,
	type ElementName,
	FooterBlock,
	MetadataBlock,
	PreviewBlock,
	SnippetBlock,
	TitleBlock,
} from '../../src';
import { actionNames, metadataElements } from './flexible-ui';

/**
 * We are hacking flexible smart links styling here to display the information
 * about elements.
 */
const codeStyles = css({
	fontFamily:
		"'SFMono-Medium', 'SF Mono', 'Segoe UI Mono', 'Roboto Mono', 'Ubuntu Mono', Menlo, Consolas, Courier, monospace",
	fontSize: '0.75rem',
	lineHeight: '0.75rem',
});

const labelStyles = css(
	{
		alignItems: 'center',
		backgroundColor: token('color.background.neutral', '#091E420F'),
		borderRadius: '3px',
		color: token('color.text', '#172B4D'),
		justifyContent: 'center',
		padding: '0.125rem 0',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	codeStyles,
);

// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression, @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
export const flexStyles = css`
	[data-smart-block] {
		// MetadataBlock: Element showcase
		${metadataElements.map(
			// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression -- needs manual remediation
			(name) => css`
				&[data-testid^='${name}'] {
					display: flex; // Force block to show even when the element has no data

					&:empty {
						justify-content: space-between;
					}

					&:before {
						display: inline-flex;
						margin-right: 1rem;
						width: 10rem;
						${labelStyles}
					}

					:before {
						content: '${name}';
					}
				}
			`,
		)}

		&[data-testid^='smart-'] {
			display: flex; // Force block to show even when the element has no data
			padding-top: 1.5rem;
			position: relative;
			:before {
				display: flex;
				position: absolute;
				left: 0;
				right: 0;
				top: 0;
				${labelStyles}
			}

			// TODO: If we assign block name to data-smart-block the same way we do
			// on data-smart-element, we can auto generate the block name
			// and don't have to rely on testId
			&[data-testid^='smart-block-title']:before {
				content: 'TitleBlock';
			}

			&[data-testid^='smart-block-preview']:before {
				content: 'PreviewBlock';
			}

			&[data-testid^='smart-block-snippet']:before {
				content: 'SnippetBlock';
			}

			&[data-testid^='smart-footer-block']:before {
				content: 'FooterBlock';
			}

			&[data-testid^='smart-block-metadata']:before {
				content: 'Metadata (ElementItem)';
			}
		}
	}
`;

const FlexibleDataView = ({ url }: { url?: string }) => (
	<div css={flexStyles}>
		<Card appearance="block" url={url}>
			<TitleBlock />
			<PreviewBlock />
			<SnippetBlock />
			<FooterBlock
				actions={actionNames.map((name, idx) => ({
					name,
					onClick: () => {},
				}))}
			/>
			<MetadataBlock primary={[{ name: 'ElementItem' as ElementName } as ElementItem]} />
			{metadataElements.map((name, idx) => (
				<MetadataBlock key={idx} maxLines={1} primary={[{ name } as ElementItem]} testId={name} />
			))}
		</Card>
	</div>
);

export default FlexibleDataView;
