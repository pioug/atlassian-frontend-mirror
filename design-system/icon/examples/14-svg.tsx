/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@compiled/react';

import SVG from '@atlaskit/icon/svg';
import type { SVGProps } from '@atlaskit/icon/types';
import { B500, G500 } from '@atlaskit/theme/colors';

const containerStyles = css({ display: 'inline-block' });

const CanonicalGlyph = ({ label, size, primaryColor }: SVGProps) => (
	<SVG label={label} size={size} primaryColor={primaryColor}>
		<path
			fill="currentColor"
			d="M24 12c0 6.627-5.373 12-12 12-6.628 0-12-5.373-12-12C0 5.372 5.372 0 12 0c6.627 0 12 5.372 12 12zM12 2.92A9.08 9.08 0 002.92 12 9.08 9.08 0 0012 21.08 9.08 9.08 0 0021.081 12 9.08 9.08 0 0012 2.92zm0 16.722A7.64 7.64 0 014.36 12 7.64 7.64 0 0112 4.36 7.64 7.64 0 0119.641 12a7.64 7.64 0 01-7.64 7.641z"
		/>
	</SVG>
);

const CustomSVG = () => (
	<span css={containerStyles} id="svg">
		<CanonicalGlyph primaryColor={B500} size="small" label="spinner" />
		<CanonicalGlyph primaryColor={B500} size="medium" label="spinner" />
		<CanonicalGlyph primaryColor={B500} size="large" label="spinner" />
		<CanonicalGlyph primaryColor={G500} size="small" label="spinner" />
		<CanonicalGlyph primaryColor={G500} size="medium" label="spinner" />
		<CanonicalGlyph primaryColor={G500} size="large" label="spinner" />
	</span>
);

export default CustomSVG;
