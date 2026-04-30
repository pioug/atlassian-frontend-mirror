/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - BlanketProps
 *
 * @codegen <<SignedSource::1dfc97c6f994cdbcce02ddc7f7c1f09a>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/blanket/index.tsx <<SignedSource::64e7af2f1aa579714559e1d783b83ec7>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import React from 'react';
import PlatformBlanket from '@atlaskit/blanket';

type PlatformBlanketProps = React.ComponentProps<typeof PlatformBlanket>;

export type BlanketProps = Pick<
	PlatformBlanketProps,
	'shouldAllowClickThrough' | 'isTinted' | 'onBlanketClicked' | 'children' | 'testId'
>;

/**
 * A blanket provides an overlay layer for components such as a modal dialog.
 *
 * @see [Blanket](https://developer.atlassian.com/platform/forge/ui-kit/components/blanket/) in UI Kit documentation for more information
 */
export type TBlanket<T> = (props: BlanketProps) => T;