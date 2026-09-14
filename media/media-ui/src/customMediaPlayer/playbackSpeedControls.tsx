import React from 'react';

import { injectIntl } from 'react-intl';

import { PlaybackSpeedControls } from './PlaybackSpeedControls-2';
import type { PlaybackSpeedControlsProps } from './PlaybackSpeedControls-2';

export default injectIntl(PlaybackSpeedControls) as React.FC<PlaybackSpeedControlsProps>;
