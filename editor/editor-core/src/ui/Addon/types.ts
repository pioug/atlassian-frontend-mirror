import type EditorActions from '../../actions';

export type RenderOnClickHandler = (
	editorActions: EditorActions,
	closePopup: () => void,
) => React.ReactElement;

export interface AddonActions {
	actionOnClick?: (editorActions: EditorActions) => void;
	renderOnClick?: RenderOnClickHandler;
}

export interface AddonCommonProps extends AddonActions {
	icon: React.ReactElement;
}

export interface AddonProps extends AddonCommonProps {
	children?: React.ReactElement[];
	onClick?: (actions: AddonActions) => void;
}

export interface AddonConfiguration extends AddonCommonProps {
	text: string;
}
