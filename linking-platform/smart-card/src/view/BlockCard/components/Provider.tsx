/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { N300 } from '@atlaskit/theme/colors';
import { gs } from '../../common/utils';
import { token } from '@atlaskit/tokens';

export interface ProviderProps {
	name: string;
	icon?: React.ReactNode;
}

const wrapperStyles = css({
	display: 'flex',
	alignItems: 'center',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	fontSize: gs(1.5),
	whiteSpace: 'normal',
});

const imgStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	height: gs(1.5),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	width: gs(1.5),
});

const textStyles = css({
	color: token('color.text.subtlest', N300),
	margin: 0,
	// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage/preview, @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	marginLeft: gs(0.5),
	// EDM-713: fixes copy-paste from renderer to editor for Firefox
	// due to HTML its unwrapping behaviour on paste.
	MozUserSelect: 'none',
});

export const Provider = ({ name, icon }: ProviderProps) => {
	let iconToRender = icon || null;

	if (typeof icon === 'string') {
		iconToRender = (
			<img
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
				className="smart-link-icon"
				css={imgStyles}
				src={icon}
			/>
		);
	}

	return (
		<div css={wrapperStyles}>
			{iconToRender}
			<span css={textStyles}>{name}</span>
		</div>
	);
};
