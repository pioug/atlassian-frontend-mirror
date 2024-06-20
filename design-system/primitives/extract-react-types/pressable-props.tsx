// TODO: Switch from ERT to ts-morph when this is completed and has reasonable adoption: https://product-fabric.atlassian.net/browse/DSP-10364
import type React from 'react';

import { type UIAnalyticsEvent } from '@atlaskit/analytics-next';

import { type BasePrimitiveProps, type StyleProp } from '../src/components/types';

// eslint-disable-next-line @typescript-eslint/no-namespace
namespace Token {
	// BoxProps['backgroundColor'] uses keyof, which ERT does not understand
	export type BackgroundColor = 'BackgroundColor';
}

type Space =
	| 'space.0'
	| 'space.025'
	| 'space.050'
	| 'space.075'
	| 'space.100'
	| 'space.150'
	| 'space.200'
	| 'space.250'
	| 'space.300'
	| 'space.400'
	| 'space.500'
	| 'space.600'
	| 'space.800'
	| 'space.1000';

export default function Pressable(
	_: {
		/**
		 * Controls whether the button is disabled.
		 */
		isDisabled?: boolean;

		/**
		 * The `type` attribute of the Button HTML element. Defaults to `button`.
		 */
		type?: React.ButtonHTMLAttributes<HTMLButtonElement>['type'];

		/**
		 * Tokens representing CSS shorthand for `paddingBlock` and `paddingInline` together.
		 */
		padding?: Space;

		/**
		 * Tokens representing CSS shorthand `paddingBlock`.
		 */
		paddingBlock?: Space;

		/**
		 * Tokens representing CSS `paddingBlockStart`.
		 */
		paddingBlockStart?: Space;

		/**
		 * Tokens representing CSS `paddingBlockEnd`.
		 */
		paddingBlockEnd?: Space;

		/**
		 * Tokens representing CSS shorthand `paddingInline`.
		 */
		paddingInline?: Space;

		/**
		 * Tokens representing CSS `paddingInlineStart`.
		 */
		paddingInlineStart?: Space;

		/**
		 * Tokens representing CSS `paddingInlineEnd`.
		 */
		paddingInlineEnd?: Space;

		/**
		 * A token alias for background color. See [https://atlassian.design/components/tokens/all-tokens#color-background](background tokens) for a list of options.
		 * When the background color is set to a [surface token](/components/tokens/all-tokens#elevation-surface),
		 * the [current surface](/components/tokens/code#current-surface-color) CSS variable will also be set to this value in the Pressable styles.
		 */
		backgroundColor?: Token.BackgroundColor;

		/**
		 * Handler called on click. You can use the second argument to fire Atlaskit analytics events on custom channels. They could then be routed to GASv3 analytics. See the code examples for information on [firing Atlaskit analytics events](https://atlassian.design/components/primitives/pressable/examples#atlaskit-analytics) or [routing these to GASv3 analytics](https://atlassian.design/components/primitives/pressable/examples#gasv3-analytics).
		 */
		onClick?: (e: React.MouseEvent<HTMLButtonElement>, analyticsEvent: UIAnalyticsEvent) => void;

		/**
		 * An optional component name used to identify this component to Atlaskit analytics press listeners. This can be altered if a parent component's name is preferred rather than the default 'Pressable'. See [the code example](https://atlassian.design/components/primitives/pressable/examples#atlaskit-analytics) for more information.
		 */
		componentName?: string;

		/**
		 * Additional information to be included in the `context` of Atlaskit analytics events that come from pressable. See [the code example](https://atlassian.design/components/primitives/pressable/examples#atlaskit-analytics) for more information.
		 */
		analyticsContext?: Record<string, any>;

		/**
		 * An optional name used to identify the pressable to interaction content listeners. By default, pressable fires React UFO (Unified Frontend Observability) press interactions for available listeners. This helps Atlassian measure performance and reliability. See [the code example](https://atlassian.design/components/primitives/pressable/examples#react-ufo-press-interactions) for more information.
		 */
		interactionName?: string;

		/**
		 * Elements to be rendered inside the primitive.
		 */
		children?: React.ReactNode;

		/**
		 * Forwarded ref element.
		 */
		ref?: React.ComponentPropsWithRef<'button'>['ref'];
	} & BasePrimitiveProps &
		StyleProp,
) {}
