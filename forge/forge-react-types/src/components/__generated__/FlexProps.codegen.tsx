/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - FlexProps
 *
 * @codegen <<SignedSource::6cc8834108a5a35b246bb5b6d336a307>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/flex/__generated__/index.partial.tsx <<SignedSource::524c2a52b6d867c671d4937480ca329c>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import React from 'react';
import { Flex as PlatformFlex } from '@atlaskit/primitives';

type PlatformFlexProps = React.ComponentProps<typeof PlatformFlex>;

export type FlexProps = Pick<
  PlatformFlexProps,
  'children' | 'justifyContent' | 'alignItems' | 'columnGap' | 'gap' | 'rowGap' | 'direction' | 'wrap' | 'testId' | 'role'
>;