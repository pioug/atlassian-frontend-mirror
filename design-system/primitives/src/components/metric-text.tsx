/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import {
	type ComponentPropsWithRef,
	type ElementType,
	forwardRef,
	type ReactNode,
	type Ref,
} from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import invariant from 'tiny-invariant';

import { type MetricTextSize, metricTextSizeStylesMap } from '../xcss/style-maps.partial';

import type { BasePrimitiveProps } from './types';

const asAllowlist = ['span', 'div'] as const;
type AsElement = (typeof asAllowlist)[number];

type MetricTextPropsBase<T extends ElementType = 'span'> = {
	/**
	 * HTML tag to be rendered. Defaults to `span`.
	 */
	as?: AsElement;
	/**
	 * Elements rendered within the Text element.
	 */
	children: ReactNode;
	/**
	 * The [HTML `id` attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id).
	 */
	id?: string;
	/**
	 * Text alignment.
	 */
	align?: TextAlign;
	/**
	 * Text size.
	 */
	size: MetricTextSize;
	/**
	 * Forwarded ref.
	 */
	ref?: ComponentPropsWithRef<T>['ref'];
};

export type MetricTextProps<T extends ElementType = 'span'> = MetricTextPropsBase<T> &
	Omit<BasePrimitiveProps, 'xcss'>;

// We're doing this because our CSS reset can add top margins to elements such as `p` which is totally insane.
// Long term we should remove those instances from the reset - it should be a reset to 0.
// For now, at least we know <MetricText> will be unaffected by this.
const resetStyles = css({
	margin: 0,
});

type TextAlign = keyof typeof textAlignMap;
const textAlignMap = {
	center: css({ textAlign: 'center' }),
	end: css({ textAlign: 'end' }),
	start: css({ textAlign: 'start' }),
};

/**
 * __MetricText__
 *
 * MetricText is a primitive component that has the Atlassian Design System's design guidelines baked in.
 * It is designed for use specifically with displaying metrics and is not to be used for headings or general UI text.
 * It renders a `span` by default.
 *
 * @internal
 */
const MetricText = forwardRef(
	<T extends ElementType = 'span'>(
		{ as: Component = 'span', align, testId, id, size, children }: MetricTextProps<T>,
		ref: Ref<any>,
	) => {
		invariant(
			asAllowlist.includes(Component),
			`@atlaskit/primitives: MetricText received an invalid "as" value of "${Component}"`,
		);

		const component = (
			<Component
				ref={ref}
				css={[
					resetStyles,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					size && metricTextSizeStylesMap[size],
					align && textAlignMap[align],
				]}
				data-testid={testId}
				id={id}
			>
				{children}
			</Component>
		);

		return component;
	},
);

export default MetricText;
