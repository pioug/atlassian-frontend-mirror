import { fg } from '@atlaskit/platform-feature-flags';

interface GeminiWindow {
	['__gemini_set_feature_flag__']: string;
}

const IS_GEMINI_TEST_ENV =
	Boolean(process.env.NODE_ENV === 'development') &&
	Boolean((window as unknown as GeminiWindow).__gemini_set_feature_flag__);

export const isBlocksDragTargetDebug = () => {
	return IS_GEMINI_TEST_ENV && fg('platform_editor_element_drag_and_drop_debug');
};
