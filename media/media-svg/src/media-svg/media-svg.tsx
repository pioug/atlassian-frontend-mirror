/** @jsx jsx */
import { jsx } from '@compiled/react';

import { Box } from '@atlaskit/primitives';

import type { MediaSvgProps } from './types';

export default function MediaSvg({ testId }: MediaSvgProps) {
  return <Box testId={testId}>Silence is golden</Box>;
}
