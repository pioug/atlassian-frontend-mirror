import type { TextProps as PlatformTextProps } from '@atlaskit/primitives/compiled';

/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - TextProps
 *
 * @codegen <<SignedSource::3f7781db8852b0cd5c500d260310f09f>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/text/__generated__/index.partial.tsx <<SignedSource::0cf707b56e3bfd72ceec543d90b2f840>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

type OriginalPlatformProps = Pick<
	PlatformTextProps,
	'align' | 'as' | 'color' | 'maxLines' | 'size' | 'weight' | 'children' | 'testId'
>;

export type TextProps = Omit<OriginalPlatformProps, 'as'> & { as?: OriginalPlatformProps['as'] | 'strike' };

export type TText<T> = (props: TextProps) => T;
