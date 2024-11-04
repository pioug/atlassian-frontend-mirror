import React from 'react';

import { type IconProps } from '@atlaskit/icon';
import EyeOpenIcon from '@atlaskit/icon/core/eye-open';

export const ShowIcon = (props: Omit<IconProps, 'glyph'>) => <EyeOpenIcon {...props} />;
