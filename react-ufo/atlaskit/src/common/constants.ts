import { fg } from '@atlaskit/platform-feature-flags';

export const REACT_UFO_VERSION = fg('enable-react-ufo-payload-segment-compressed')
	? '2.0.0'
	: '1.0.1';
