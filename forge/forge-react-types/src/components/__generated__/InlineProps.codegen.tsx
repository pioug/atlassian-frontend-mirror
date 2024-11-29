/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - InlineProps
 *
 * @codegen <<SignedSource::aeccd45a50458d68bbfeed7e0aadcac1>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/inline/__generated__/index.partial.tsx <<SignedSource::0ac949055f76549e70b29c626401570c>>
 */
import React from 'react';
import { Inline as PlatformInline } from '@atlaskit/primitives';

type PlatformInlineProps = React.ComponentProps<typeof PlatformInline>;

export type InlineProps = Pick<
  PlatformInlineProps,
  'children' | 'alignBlock' | 'alignInline' | 'spread' | 'grow' | 'space' | 'shouldWrap' | 'separator' | 'rowSpace' | 'testId'
>;