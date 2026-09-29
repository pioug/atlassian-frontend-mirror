/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - TopNavEndProps
 *
 * @codegen <<SignedSource::8564ff19ef4fc9de44d3d766e45d78ca>>
 * @codegenCommand afm workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../../../services/forge-common-app-gateway/src/components/navigation/TopNavEnd.tsx <<SignedSource::f3eb55027d40bf54252699b1c448d45e>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import React from 'react';
import { TopNavEnd as PlatformTopNavEnd } from '@atlaskit/navigation-system/layout/top-nav';

type PlatformTopNavEndProps = React.ComponentProps<typeof PlatformTopNavEnd>;

export type TopNavEndProps = Pick<
	// Setting up TopNavEndProps as a Pick of PlatformTopNavEndProps
	PlatformTopNavEndProps,
	'children' | 'label' | 'showMoreButtonLabel'
>;

export type TTopNavEnd<T> = (props: TopNavEndProps) => T;