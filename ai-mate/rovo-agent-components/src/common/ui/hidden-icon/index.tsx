import React from 'react';

import { type IconProps } from '@atlaskit/icon';
import EyeOpenStrikethroughIcon from '@atlaskit/icon/core/eye-open-strikethrough';

export const HiddenIcon = (props: Omit<IconProps, 'glyph'>) => (
	<EyeOpenStrikethroughIcon {...props} />
);
