/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { type ReactNode } from 'react';

import { css, jsx, type SerializedStyles } from '@emotion/react';

import { UNSAFE_inverseColorMap, UNSAFE_useSurface } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

import { useHeading } from './heading-context';

export type HeadingColor = 'color.text' | 'color.text.inverse' | 'color.text.warning.inverse';

export type HeadingProps = {
	/**
	 * Heading size. This value is detached from the specific heading level applied to allow for more flexibility.
	 * Use instead of the deprecated `level` prop.
	 *
	 */
	size: HeadingSize;
	/**
	 * Allows the component to be rendered as the specified DOM element, overriding a default element set by `level` prop.
	 */
	as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div' | 'span';
	/**
	 * Token representing text color with a built-in fallback value.
	 * Will apply inverse text color automatically if placed within a Box with bold background color.
	 * Defaults to `color.text`.
	 */
	color?: HeadingColor;
	/**
	 * The text of the heading.
	 */
	children: ReactNode;
	/**
	 * Unique identifier for the heading DOM element.
	 */
	id?: string;
	/**
	 * A `testId` prop is provided for specified elements, which is a unique
	 * string that appears as a data attribute `data-testid` in the rendered code,
	 * serving as a hook for automated tests.
	 */
	testId?: string;
};

const sizeTagMap = {
	xxlarge: 'h1',
	xlarge: 'h1',
	large: 'h2',
	medium: 'h3',
	small: 'h4',
	xsmall: 'h5',
	xxsmall: 'h6',
} as const;

const headingResetStyles = css({
	letterSpacing: 'normal',
	marginBlock: 0,
	textTransform: 'none',
});

const useColor = (colorProp?: HeadingColor): HeadingColor => {
	const surface = UNSAFE_useSurface();

	/**
	 * Where the color of the surface is inverted we always override the color
	 * as there is no valid choice that is not covered by the override.
	 */
	if (UNSAFE_inverseColorMap.hasOwnProperty(surface)) {
		return UNSAFE_inverseColorMap[surface as keyof typeof UNSAFE_inverseColorMap];
	}

	return colorProp || 'color.text';
};

/**
 * __Heading__
 *
 * Heading is a typography component used to display text in defined sizes and styles.
 *
 * @example
 *
 * ```jsx
 * <Heading size="xxlarge">Page title</Heading>
 * ```
 */
const Heading = ({ children, size, id, testId, as, color: colorProp }: HeadingProps) => {
	if (
		typeof process !== 'undefined' &&
		process.env.NODE_ENV !== 'production' &&
		as &&
		typeof as !== 'string'
	) {
		throw new Error('`as` prop should be a string.');
	}

	// Technically size can be undefined here due to how the types work.
	// Once removing the level prop this assertion can be removed since size will be a required prop.
	const [hLevel, inferredElement] = useHeading(sizeTagMap[size!]);
	const Component = as || inferredElement;
	const needsAriaRole = Component === 'div' && hLevel;
	const color = useColor(colorProp);

	return (
		<Component
			id={id}
			data-testid={testId}
			role={needsAriaRole ? 'heading' : undefined}
			aria-level={needsAriaRole ? hLevel : undefined}
			css={[headingResetStyles, size && headingSizeStylesMap[size], headingColorStylesMap[color]]}
		>
			{children}
		</Component>
	);
};

const headingColorStylesMap: Record<HeadingColor, SerializedStyles> = {
	'color.text': css({
		color: token('color.text'),
	}),
	'color.text.inverse': css({
		color: token('color.text.inverse'),
	}),
	'color.text.warning.inverse': css({
		color: token('color.text.warning.inverse'),
	}),
};

/**
 * THIS SECTION WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::df829c6c0aa19bb57c0c77dc08d12d60>>
 * @codegenId typography
 * @codegenCommand yarn workspace @atlaskit/heading codegen
 */
const headingSizeStylesMap = {
	xxlarge: css({ font: token('font.heading.xxlarge') }),
	xlarge: css({ font: token('font.heading.xlarge') }),
	large: css({ font: token('font.heading.large') }),
	medium: css({ font: token('font.heading.medium') }),
	small: css({ font: token('font.heading.small') }),
	xsmall: css({ font: token('font.heading.xsmall') }),
	xxsmall: css({ font: token('font.heading.xxsmall') }),
};

export type HeadingSize = keyof typeof headingSizeStylesMap;

/**
 * @codegenEnd
 */

export default Heading;
