/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - TopNavStartProps
 *
 * @codegen <<SignedSource::96e1b2b7bfe8608bca55e415473620b6>>
 * @codegenCommand afm workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../../../services/forge-common-app-gateway/src/components/navigation/TopNavStart.tsx <<SignedSource::1040907d3c1adaecf75e7044b83851e4>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import React from 'react';
import { TopNavStart as PlatformTopNavStart } from '@atlaskit/navigation-system/layout/top-nav';

type PlatformTopNavStartProps = React.ComponentProps<typeof PlatformTopNavStart>;

export type TopNavStartProps = Pick<
	// Setting up TopNavProps as a Pick of PlatformTopNavProps
	PlatformTopNavStartProps,
	'children' | 'testId'
>;

export type TTopNavStart<T> = (props: TopNavStartProps) => T;