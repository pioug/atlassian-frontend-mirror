const prefix = 'ak-editor-sync-block';
export const SyncBlockSharedCssClassName: {
	prefix: string;
	renderer: string;
	error: string;
	loading: string;
} = {
	prefix,
	renderer: `${prefix}__renderer`,
	error: `${prefix}__error_state`,
	loading: `${prefix}__loading_state`,
};

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export const SyncBlockRendererDataAttributeName = 'data-sync-block-renderer';

const bodiedPrefix = 'ak-editor-bodied-sync-block';
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export const BodiedSyncBlockSharedCssClassName: {
	prefix: string;
	renderer: string;
	content: string;
	selectionInside: string;
} = {
	prefix: bodiedPrefix,
	renderer: `${bodiedPrefix}__renderer`,
	content: `${bodiedPrefix}__content`,
	selectionInside: `${bodiedPrefix}__selection_inside`,
};

// Constant labelClassName value here has been inlined in css from EditorContentContainer, if you need to make
// update here, please also update packages/editor/editor-core/src/ui/EditorContentContainer/EditorContentContainer-compiled.tsx
const labelClassName = 'ak-editor-sync-block__label';
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export const SyncBlockLabelSharedCssClassName: {
	labelClassName: string;
} = {
	labelClassName,
};

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export const disabledClassName = 'disabled';
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export const viewModeClassName = 'view-mode';
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export const creationLoadingClassName = 'creation-loading';
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export const draggingClassName = 'user-is-dragging';
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export const SyncBlockStateCssClassName: {
	disabledClassName: string;
	viewModeClassName: string;
	creationLoadingClassName: string;
	draggingClassName: string;
} = {
	disabledClassName,
	viewModeClassName,
	creationLoadingClassName,
	draggingClassName,
};
