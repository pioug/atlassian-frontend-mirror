/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - TopNavProps
 *
 * @codegen <<SignedSource::fe99ce17aff09576c78fa26de85d9300>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../../../services/forge-common-app-gateway/src/components/navigation/TopNav.tsx <<SignedSource::0582686cebdccbf01ed0eb34a12d467d>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import React from 'react';
import { TopNav as PlatformTopNav } from '@atlaskit/navigation-system/layout/top-nav';

type PlatformTopNavProps = React.ComponentProps<typeof PlatformTopNav>;

export type TopNavProps = Pick<PlatformTopNavProps, 'children' | 'testId'>;

export type TTopNav<T> = (props: TopNavProps) => T;