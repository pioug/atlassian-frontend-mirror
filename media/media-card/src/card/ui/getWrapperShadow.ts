import { akEditorSelectedBoxShadow } from '@atlaskit/editor-shared-styles/consts';
import { token } from '@atlaskit/tokens';

// This is a trick to simulate the blue border without affecting the dimensions.
// CSS outline has no 'radius', therefore we can't achieve the same effect with it
export const getWrapperShadow = (disableOverlay: boolean, selected: boolean): string => {
	const withOverlayShadow = !disableOverlay ? `${token('elevation.shadow.raised')}` : '';

	const selectedShadow = selected ? akEditorSelectedBoxShadow : '';
	const shadow = [selectedShadow, withOverlayShadow].filter(Boolean).join(', ');
	return shadow ? `box-shadow: ${shadow};` : '';
};
