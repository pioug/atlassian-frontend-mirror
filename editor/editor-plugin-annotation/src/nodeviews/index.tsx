import {
	AnnotationSharedClassNames,
	BlockAnnotationSharedClassNames,
} from '@atlaskit/editor-common/styles';

export const getAnnotationViewClassname = (
	isUnresolved: boolean,
	hasFocus: boolean,
	isHovered: boolean,
): string | undefined => {
	if (!isUnresolved) {
		return;
	}
	if (hasFocus) {
		return AnnotationSharedClassNames.focus;
	}
	if (isHovered) {
		return AnnotationSharedClassNames.hover;
	}
	return AnnotationSharedClassNames.blur;
};

export const getBlockAnnotationViewClassname = (
	isUnresolved: boolean,
	hasFocus: boolean,
): string | undefined => {
	if (!isUnresolved) {
		return;
	}

	return hasFocus ? BlockAnnotationSharedClassNames.focus : BlockAnnotationSharedClassNames.blur;
};
