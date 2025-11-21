import React from 'react';

import { type NewCoreIconProps } from '@atlaskit/icon';
import EyeOpenStrikethroughIcon from '@atlaskit/icon/core/eye-open-strikethrough';

export const HiddenIcon = (props: Omit<NewCoreIconProps, 'glyph'>): React.JSX.Element => (
	<EyeOpenStrikethroughIcon {...props} />
);
