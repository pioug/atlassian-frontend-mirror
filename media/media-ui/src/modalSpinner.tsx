import React from 'react';
import EmotionModalSpinner from './modalSpinner-emotion';
import CompiledModalSpinner from './modalSpinner-compiled';
import { fg } from '@atlaskit/platform-feature-flags';

const ModalSpinner: typeof EmotionModalSpinner = (props) =>
	fg('platform_media_compiled') ? (
		<CompiledModalSpinner {...props} />
	) : (
		<EmotionModalSpinner {...props} />
	);

export { Blanket, SpinnerWrapper } from './modalSpinner-emotion';

export default ModalSpinner;
