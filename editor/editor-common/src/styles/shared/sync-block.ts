const prefix = 'ak-editor-sync-block';
export const SyncBlockSharedCssClassName = {
	prefix,
	renderer: `${prefix}__renderer`,
	error: `${prefix}__error_state`,
};

const bodiedPrefix = 'ak-editor-bodied-sync-block';
export const BodiedSyncBlockSharedCssClassName = {
	prefix: bodiedPrefix,
	content: `${bodiedPrefix}__content`,
	selectionInside: `${bodiedPrefix}__selection_inside`,
};

const labelClassName = 'ak-editor-sync-block__label';
export const SyncBlockLabelSharedCssClassName = {
	labelClassName,
};

export const disabledClassName = 'disabled';
export const viewModeClassName = 'view-mode';
export const SyncBlockStateCssClassName = {
	disabledClassName,
	viewModeClassName,
};
