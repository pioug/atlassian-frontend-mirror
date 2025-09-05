/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - TopNavMiddleProps
 *
 * @codegen <<SignedSource::d9105e1d85a6d65be052fb925cbca83a>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../../../services/forge-common-app-gateway/src/components/navigation/TopNavMiddle.tsx <<SignedSource::cdfdd5fe0b77615c5519b81e75970600>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import React from 'react';
import { TopNavMiddle as PlatformTopNavMiddle } from '@atlaskit/navigation-system/layout/top-nav';

type PlatformTopNavMiddleProps = React.ComponentProps<typeof PlatformTopNavMiddle>;

export type TopNavMiddleProps = Pick<
	// Setting up TopNavMiddleProps as a Pick of PlatformTopNavMiddleProps
	PlatformTopNavMiddleProps,
	'children'
>;

export type TTopNavMiddle<T> = (props: TopNavMiddleProps) => T;