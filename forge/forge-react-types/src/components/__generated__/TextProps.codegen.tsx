/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - TextProps
 *
 * @codegen <<SignedSource::2cf1d1a11c89b10fdc65f27c51e6c7b4>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/text/__generated__/index.partial.tsx <<SignedSource::45fcbf413ecc09a9102dc482b4fc9d70>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import React from 'react';
import { Text as PlatformText } from '@atlaskit/primitives/compiled';

type OriginalPlatformProps = Pick<
	PlatformTextProps,
	'align' | 'as' | 'color' | 'maxLines' | 'size' | 'weight' | 'children' | 'testId'
>;
type PlatformTextProps = React.ComponentProps<typeof PlatformText>;

export type TextProps = Omit<OriginalPlatformProps, 'as'> & { as?: OriginalPlatformProps['as'] | 'strike' };

export type TText<T> = (props: TextProps) => T;