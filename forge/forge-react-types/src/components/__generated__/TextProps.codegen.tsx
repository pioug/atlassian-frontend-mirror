/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - TextProps
 *
 * @codegen <<SignedSource::e6fa9851f9ec89edf81e66321e560afc>>
 * @codegenCommand afm workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/text/__generated__/index.partial.tsx <<SignedSource::84a178bb60b03dfa29e85f98ef634064>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import React from 'react';
import { Text as PlatformText } from '@atlaskit/primitives/compiled';

type OriginalPlatformProps = Pick<
	PlatformTextProps,
	'align' | 'as' | 'color' | 'maxLines' | 'size' | 'weight' | 'children' | 'testId'
>;
type PlatformTextProps = React.ComponentProps<typeof PlatformText>;

export type TextProps = Omit<OriginalPlatformProps, 'as'> & {
	as?: OriginalPlatformProps['as'] | 'strike';
};

export type TText<T> = (props: TextProps) => T;