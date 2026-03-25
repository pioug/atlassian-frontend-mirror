import { PopupRoot } from './popup';
import { PopupContent } from './popup-content';
import { PopupSurface } from './popup-surface';
import { PopupTrigger } from './popup-trigger';
import { PopupTriggerFunction } from './popup-trigger-function';

/**
 * Compound component for rendering content in the browser's top layer
 * using the native Popover API (`popover="auto"`).
 * Placement is owned by this compound: root provides it via context, Content applies it
 * (CSS Anchor Positioning or JS fallback).
 *
 * For default overlay styling (background, shadow, border-radius), see `PopupSurface` in the package examples.
 *
 * @example
 * ```tsx
 * <Popup placement={{ edge: 'end' }} onClose={handleClose}>
 *   <Popup.Trigger>
 *     <button>Open</button>
 *   </Popup.Trigger>
 *   <Popup.Content role="dialog" label="My popup">
 *     Content goes here
 *   </Popup.Content>
 * </Popup>
 * ```
 */
const Popup: typeof PopupRoot & {
	Trigger: typeof PopupTrigger;
	TriggerFunction: typeof PopupTriggerFunction;
	Content: typeof PopupContent;
	Surface: typeof PopupSurface;
} = Object.assign(PopupRoot, {
	Trigger: PopupTrigger,
	TriggerFunction: PopupTriggerFunction,
	Content: PopupContent,
	Surface: PopupSurface,
});

export { Popup };

export type {
	TPlacementOptions,
	TPopupProps,
	TPopupContentProps,
	TPopupRole,
	TPopupSurfaceProps,
	TPopupTriggerProps,
} from './types';
export type { TTriggerFunctionRenderProps } from './popup-trigger-function';
