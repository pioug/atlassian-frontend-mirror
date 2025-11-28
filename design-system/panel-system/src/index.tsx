export type { PanelSystemProps } from './types';

export {
	PanelContainer,
	type PanelContainerProps,
} from './components/panel-container/panel-container';

export { PanelHeader, type PanelHeaderProps } from './components/panel-header/panel-header';

export { PanelTitle, type PanelTitleProps } from './components/panel-title/panel-title';

export {
	PanelSubheader,
	type PanelSubheaderProps,
} from './components/panel-subheader/panel-subheader';

export { PanelBody, type PanelBodyProps } from './components/panel-body/panel-body';

export { PanelFooter, type PanelFooterProps } from './components/panel-footer/panel-footer';

export { PanelAction } from './components/panel-action/panel-action';
export type { PanelActionProps } from './components/panel-action/types';

export {
	PanelActionGroup,
	type PanelActionGroupProps,
} from './components/panel-action-group/panel-action-group';

export {
	PanelActionExpand,
	type PanelActionExpandProps,
} from './components/panel-action-variants/panel-action-expand/panel-action-expand';

export {
	PanelActionNewTab,
	type PanelActionNewTabProps,
} from './components/panel-action-variants/panel-action-new-tab/panel-action-new-tab';

export {
	PanelActionMore,
	type PanelActionMoreProps,
} from './components/panel-action-variants/panel-action-more/panel-action-more';

export {
	PanelActionClose,
	type PanelActionCloseProps,
} from './components/panel-action-variants/panel-action-close/panel-action-close';

export {
	PanelActionBack,
	type PanelActionBackProps,
} from './components/panel-action-variants/panel-action-back/panel-action-back';

export { PanelProvider, type PanelProviderProps } from './panel-manager/panel-provider';

export { usePanelManager, usePanelActions, usePanelState } from './panel-manager/panel-manager';
export type {
	Panel,
	PanelSystemState,
	PanelAction as PanelSystemAction,
} from './panel-manager/types';
