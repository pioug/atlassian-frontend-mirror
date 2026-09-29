/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - TextProps
 *
 * @codegen <<SignedSource::c17877195dc71ee7eaee2f168797090b>>
 * @codegenCommand afm workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/text/__generated__/index.partial.tsx <<SignedSource::4e4e5702ceb7b8ad9de36d2e36160669>>
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