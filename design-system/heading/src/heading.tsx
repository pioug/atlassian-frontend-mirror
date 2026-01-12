/* eslint-disable @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { forwardRef, type ReactNode, type Ref } from 'react';

import { type CompiledStyles, cssMap as unboundedCssMap } from '@compiled/react';

import { cssMap, jsx } from '@atlaskit/css';
import { fg } from '@atlaskit/platform-feature-flags';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { UNSAFE_inverseColorMap } from '@atlaskit/primitives';
import { UNSAFE_useSurface } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { useHeading } from './heading-context';

type HeadingColor = 'color.text' | 'color.text.inverse' | 'color.text.warning.inverse';

export type HeadingProps = {
	/**
	 * Determines which text styles are applied. A corresponding HTML element is automatically applied from h1 to h6 based on the size.
	 * This can be overriden using the `as` prop to allow for more flexibility.
	 */
	size: HeadingSize;
	/**
	 * Allows the component to be rendered as the specified HTML element, overriding a default element set by the `size` prop.
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
	 * Unique identifier for the heading HTML element.
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

/**
 * Remove with `platform-dst-heading-specificity` fg cleanup
 */
const styles = unboundedCssMap({
	reset: {
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		letterSpacing: 'normal',
		marginBlock: 0,
		textTransform: 'none',
	},
});

/**
 * Remove with `platform-dst-heading-specificity` fg cleanup
 */
const headingColorStyles = cssMap({
	'color.text': {
		color: token('color.text'),
	},
	'color.text.inverse': {
		color: token('color.text.inverse'),
	},
	'color.text.warning.inverse': {
		color: token('color.text.warning.inverse'),
	},
});

/**
 * Remove with `platform-dst-heading-specificity` fg cleanup
 */
const headingSizeStyles: {
	readonly xxlarge: CompiledStyles<{
		font: 'var(--ds-font-heading-xxlarge)';
	}>;
	readonly xlarge: CompiledStyles<{
		font: 'var(--ds-font-heading-xlarge)';
	}>;
	readonly large: CompiledStyles<{
		font: 'var(--ds-font-heading-large)';
	}>;
	readonly medium: CompiledStyles<{
		font: 'var(--ds-font-heading-medium)';
	}>;
	readonly small: CompiledStyles<{
		font: 'var(--ds-font-heading-small)';
	}>;
	readonly xsmall: CompiledStyles<{
		font: 'var(--ds-font-heading-xsmall)';
	}>;
	readonly xxsmall: CompiledStyles<{
		font: 'var(--ds-font-heading-xxsmall)';
	}>;
} = cssMap({
	xxlarge: { font: token('font.heading.xxlarge') },
	xlarge: { font: token('font.heading.xlarge') },
	large: { font: token('font.heading.large') },
	medium: { font: token('font.heading.medium') },
	small: { font: token('font.heading.small') },
	xsmall: { font: token('font.heading.xsmall') },
	xxsmall: { font: token('font.heading.xxsmall') },
});

/**
 * Using '&&' here to increase specificity of Heading styles such that app styles like ".wiki-content h4" cannot override this component.
 */
const stylesWithSpecificity = unboundedCssMap({
	reset: {
		'&&': {
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
			letterSpacing: 'normal',
			marginBlock: 0,
			textTransform: 'none',
		},
	},
});

/**
 * Using '&&' here to increase specificity of Heading styles such that app styles like ".wiki-content h4" cannot override this component.
 */
const headingColorStylesWithSpecificity = unboundedCssMap({
	'color.text': {
		'&&': { color: token('color.text') },
	},
	'color.text.inverse': {
		'&&': { color: token('color.text.inverse') },
	},
	'color.text.warning.inverse': {
		'&&': { color: token('color.text.warning.inverse') },
	},
});

/**
 * Using '&&' here to increase specificity of Heading styles such that app styles like ".wiki-content h4" cannot override this component.
 */
const headingSizeWithSpecificityStyles: {
	readonly xxlarge: CompiledStyles<{
		'&&': { font: 'var(--ds-font-heading-xxlarge)' };
	}>;
	readonly xlarge: CompiledStyles<{
		'&&': { font: 'var(--ds-font-heading-xlarge)' };
	}>;
	readonly large: CompiledStyles<{
		'&&': { font: 'var(--ds-font-heading-large)' };
	}>;
	readonly medium: CompiledStyles<{
		'&&': { font: 'var(--ds-font-heading-medium)' };
	}>;
	readonly small: CompiledStyles<{
		'&&': { font: 'var(--ds-font-heading-small)' };
	}>;
	readonly xsmall: CompiledStyles<{
		'&&': { font: 'var(--ds-font-heading-xsmall)' };
	}>;
	readonly xxsmall: CompiledStyles<{
		'&&': { font: 'var(--ds-font-heading-xxsmall)' };
	}>;
} = unboundedCssMap({
	xxlarge: { '&&': { font: token('font.heading.xxlarge') } },
	xlarge: { '&&': { font: token('font.heading.xlarge') } },
	large: { '&&': { font: token('font.heading.large') } },
	medium: { '&&': { font: token('font.heading.medium') } },
	small: { '&&': { font: token('font.heading.small') } },
	xsmall: { '&&': { font: token('font.heading.xsmall') } },
	xxsmall: { '&&': { font: token('font.heading.xxsmall') } },
});

type HeadingSize = keyof typeof headingSizeWithSpecificityStyles;

/**
 * @codegenEnd
 */

const useColor = (colorProp?: HeadingColor): HeadingColor => {
	const surface = UNSAFE_useSurface();

	if (colorProp) {
		return colorProp;
	}

	if (UNSAFE_inverseColorMap.hasOwnProperty(surface)) {
		return UNSAFE_inverseColorMap[surface as keyof typeof UNSAFE_inverseColorMap];
	}

	return 'color.text';
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
const Heading: React.ForwardRefExoticComponent<
	React.PropsWithoutRef<HeadingProps> & React.RefAttributes<HTMLHeadingElement>
> = forwardRef((props: HeadingProps, ref: Ref<HTMLHeadingElement>) => {
	const { children, size, id, testId, as, color: colorProp } = props;

	if (
		typeof process !== 'undefined' &&
		process.env.NODE_ENV !== 'production' &&
		as &&
		typeof as !== 'string'
	) {
		throw new Error('`as` prop should be a string.');
	}

	const [hLevel, inferredElement] = useHeading(sizeTagMap[size]);
	const Component = as || inferredElement;
	const needsAriaRole = Component === 'div' && hLevel;
	const color = useColor(colorProp);

	return (
		<Component
			id={id}
			ref={ref}
			data-testid={testId}
			role={needsAriaRole ? 'heading' : undefined}
			aria-level={needsAriaRole ? hLevel : undefined}
			css={[
				styles.reset,
				fg('platform-dst-heading-specificity') && stylesWithSpecificity.reset,
				headingSizeStyles[size],
				fg('platform-dst-heading-specificity') && headingSizeWithSpecificityStyles[size],
				headingColorStyles[color],
				fg('platform-dst-heading-specificity') && headingColorStylesWithSpecificity[color],
			]}
		>
			{children}
		</Component>
	);
});

export default Heading;
