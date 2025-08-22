export enum MediaLinkingActionsTypes {
	showToolbar = 'MEDIA_SHOW_TOOLBAR',
	hideToolbar = 'MEDIA_HIDE_TOOLBAR',
	setUrl = 'MEDIA_SET_LINK_TO',
	unlink = 'MEDIA_LINKING_UNLINK',
}

interface VisibleAction {
	type: MediaLinkingActionsTypes.showToolbar;
}

interface HideAction {
	type: MediaLinkingActionsTypes.hideToolbar;
}

interface SetLinkToMedia {
	payload: string;
	type: MediaLinkingActionsTypes.setUrl;
}

interface Unlink {
	type: MediaLinkingActionsTypes.unlink;
}

export type MediaLinkingActions = VisibleAction | SetLinkToMedia | HideAction | Unlink;
