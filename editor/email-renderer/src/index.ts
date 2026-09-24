/* eslint-disable @atlaskit/editor/no-re-export */
// Entry file in package.json
import { EmailSerializer } from './main';

export { EmailSerializer } from './main';
export { commonStyle } from './styles/common';
export {
	CS_CONTENT_PREFIX,
	MEDIA_PREVIEW_IMAGE_HEIGHT,
	MEDIA_PREVIEW_IMAGE_WIDTH,
	createClassName,
} from './styles/util';
export default EmailSerializer;
