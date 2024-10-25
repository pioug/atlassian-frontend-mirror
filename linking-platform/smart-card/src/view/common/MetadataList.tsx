/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { Metadata, type MetadataProps } from './Metadata';
import { gs } from './utils';

export interface MetadataListProps {
	items: MetadataProps[];
	testId?: string;
}

export const metadataListClassName = 'smart-link-metadata-list';

const wrapperStyles = css({
	display: 'flex',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	marginTop: gs(0.5),
	alignItems: 'center',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'&:last-child': {
		marginRight: '0px',
	},
});

export const MetadataList = ({ items, testId }: MetadataListProps) => {
	return (
		<div
			css={wrapperStyles}
			data-testid={testId}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className={metadataListClassName}
		>
			{items.map((item) => (
				<Metadata key={item.text} {...item} />
			))}
		</div>
	);
};
