/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - BlanketProps
 *
 * @codegen <<SignedSource::9678994d38986ddb10e173f44b8462a0>>
 * @codegenCommand afm workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/blanket/index.tsx <<SignedSource::b37110240800f6de2d45886e9b9d7123>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import React from 'react';
import PlatformBlanket from '@atlaskit/blanket/blanket';

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