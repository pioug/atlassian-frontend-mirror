/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - BadgeProps
 *
 * @codegen <<SignedSource::88e5e3b2692aa5f5b4473dcf6066304e>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit2-codegen/badge/__generated__/index.partial.tsx <<SignedSource::98926ad4bb93c66ad5993ecf470ee3e8>>
 */
import React from 'react';
import PlatformBadge from '@atlaskit/badge';

type PlatformBadgeProps = React.ComponentProps<typeof PlatformBadge>;

export type BadgeProps = Pick<
  PlatformBadgeProps,
  'appearance' | 'children' | 'max' | 'testId'
>;