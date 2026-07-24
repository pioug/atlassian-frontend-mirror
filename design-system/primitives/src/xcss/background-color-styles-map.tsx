// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { type SerializedStyles } from '@emotion/react';

import type { BackgroundColorToken as BackgroundColor } from '../utils/types';

import { backgroundColorMap } from './background-color';
import { getSerializedStylesMap } from './get-serialized-styles-map';

export const backgroundColorStylesMap: Record<BackgroundColor, SerializedStyles> =
	getSerializedStylesMap('backgroundColor', backgroundColorMap);
