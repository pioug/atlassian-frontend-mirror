/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - BadgeProps
 *
 * @codegen <<SignedSource::2fbe160d8dbaa5994c6bd060dfb6e158>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit2-codegen/badge/__generated__/index.partial.tsx <<SignedSource::99a8452447cc815e7da3a666695e119a>>
 */
import React from 'react';
import PlatformBadge from '@atlaskit/badge';

type PlatformBadgeProps = React.ComponentProps<typeof PlatformBadge>;

export type BadgeProps = Pick<
  PlatformBadgeProps,
  'appearance' | 'children' | 'max' | 'testId'
>;