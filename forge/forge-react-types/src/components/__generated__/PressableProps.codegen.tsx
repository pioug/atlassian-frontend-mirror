/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - PressableProps
 *
 * @codegen <<SignedSource::7718a6c12cf7232dc9e82a226b7af971>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/pressable/__generated__/index.partial.tsx <<SignedSource::428e189d3e2a55cdd7cf86aef5a1eed7>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import React from 'react';
import { Pressable as PlatformPressable } from '@atlaskit/primitives';

type _PlatformPressableProps = React.ComponentProps<typeof PlatformPressable>;
export type PlatformPressableProps = Omit<_PlatformPressableProps, 'backgroundColor' | 'isDisabled' | 'onClick' | 'padding' | 'paddingBlock' | 'paddingBlockEnd' | 'paddingBlockStart' | 'paddingInline' | 'paddingInlineEnd' | 'paddingInlineStart' | 'testId'> & {
/**
 * Token representing background color with a built-in fallback value.
 */
	backgroundColor?: _PlatformPressableProps['backgroundColor'];
/**
 * Whether the button is disabled.
 */
	isDisabled?: _PlatformPressableProps['isDisabled'];
/**
 * Handler called on click. The second argument provides an Atlaskit UI analytics event that can be fired to a listening channel. See the ['analytics-next' package](https://atlaskit.atlassian.com/packages/analytics/analytics-next) documentation for more information.
 */
	onClick?: _PlatformPressableProps['onClick'];
/**
 * Tokens representing CSS shorthand for `paddingBlock` and `paddingInline` together.
 * 
 * @see paddingBlock
 * @see paddingInline
 */
	padding?: _PlatformPressableProps['padding'];
/**
 * Tokens representing CSS shorthand `paddingBlock`.
 * 
 * @see paddingBlockStart
 * @see paddingBlockEnd
 */
	paddingBlock?: _PlatformPressableProps['paddingBlock'];
/**
 * Tokens representing CSS `paddingBlockEnd`.
 */
	paddingBlockEnd?: _PlatformPressableProps['paddingBlockEnd'];
/**
 * Tokens representing CSS `paddingBlockStart`.
 */
	paddingBlockStart?: _PlatformPressableProps['paddingBlockStart'];
/**
 * Tokens representing CSS shorthand `paddingInline`.
 * 
 * @see paddingInlineStart
 * @see paddingInlineEnd
 */
	paddingInline?: _PlatformPressableProps['paddingInline'];
/**
 * Tokens representing CSS `paddingInlineEnd`.
 */
	paddingInlineEnd?: _PlatformPressableProps['paddingInlineEnd'];
/**
 * Tokens representing CSS `paddingInlineStart`.
 */
	paddingInlineStart?: _PlatformPressableProps['paddingInlineStart'];
/**
 * A unique string that appears as data attribute data-testid in the rendered code, serving as a hook for automated tests.
 */
	testId?: _PlatformPressableProps['testId'];
}

export type PressableProps = Pick<
  PlatformPressableProps,
  'backgroundColor' | 'children' | 'isDisabled' | 'onClick' | 'padding' | 'paddingBlock' | 'paddingBlockEnd' | 'paddingBlockStart' | 'paddingInline' | 'paddingInlineEnd' | 'paddingInlineStart' | 'testId'
>;

/**
 * A pressable is a primitive for building custom buttons.
 * 
 * @codegenId #pressable
 */
export type TPressable<T> = (props: PressableProps) => T;