/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import type { CSSProperties, JSX } from 'react';

import { cssMap, jsx } from '@atlaskit/css';

const logoImageStyles = cssMap({
	image: {
		maxWidth: '320px',
		maxHeight: '24px',
		height: 'auto',
	},
	monochromeWrapper: {
		display: 'inline-block',
		// @ts-expect-error - currentColor is a valid CSS value
		color: 'currentColor',
		maxWidth: '320px',
		maxHeight: '24px',
		position: 'relative',
	},
	monochromeImage: {
		maxWidth: '320px',
		maxHeight: '24px',
		height: 'auto',
		display: 'block',
		opacity: 0,
		width: 'auto',
	},
	monochromeMask: {
		position: 'absolute',
		insetBlockStart: 0,
		insetInlineStart: 0,
		insetInlineEnd: 0,
		insetBlockEnd: 0,
		width: '100%',
		height: '100%',
		// @ts-expect-error - currentColor is a valid CSS value
		backgroundColor: 'currentColor',
		maskSize: 'contain',
		maskRepeat: 'no-repeat',
		maskPosition: 'center',
		WebkitMaskSize: 'contain',
		WebkitMaskRepeat: 'no-repeat',
		WebkitMaskPosition: 'center',
	},
});

/**
 * Generate an image component from a URL for use with CustomLogo
 * @param imageUrl The URL of the logo image
 * @param isMonochrome If true, the logo will be rendered in monochrome using currentColor
 */
export const generateImageComponent = (
	imageUrl: string,
	isMonochrome?: boolean,
): (() => JSX.Element) => {
	if (isMonochrome) {
		return () => (
			<span
				css={logoImageStyles.monochromeWrapper}
				style={{ '--logo-url': `url(${imageUrl})` } as CSSProperties}
			>
				{/* eslint-disable-next-line @atlaskit/design-system/no-html-image */}
				<img alt="" src={imageUrl} css={logoImageStyles.monochromeImage} />
				<span
					css={logoImageStyles.monochromeMask}
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
					style={
						{
							maskImage: `url(${imageUrl})`,
							WebkitMaskImage: `url(${imageUrl})`,
						} as CSSProperties
					}
				/>
			</span>
		);
	}
	return () => (
		// eslint-disable-next-line @atlaskit/design-system/no-html-image
		<img alt="" src={imageUrl} css={logoImageStyles.image} />
	);
};
