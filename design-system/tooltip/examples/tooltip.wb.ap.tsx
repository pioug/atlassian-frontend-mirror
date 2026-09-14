import type { ComponentProps } from 'react';

import { wb, type WorkbenchExample } from '@atlassian/workbench';

import AvoidTitleInTooltipExample from './avoid-title-in-tooltip';
import ComponentPropVrExample from './component-prop.vr.ap';
import CssPositionExample from './css-position';
import DefaultTooltipVrExample from './default-tooltip.vr.ap';
import DelayExample from './delay';
import HideOnClickExample from './hide-on-click';
import HideOnMousedownExample from './hide-on-mousedown';
import HoverIntentExample from './hover-intent';
import InsidePopupExample from './inside-popup';
import KeyboardShortcutGlobalStylesVrExample from './keyboard-shortcut-global-styles.vr.ap';
import KeyboardShortcutVrExample from './keyboard-shortcut.vr.ap';
import NestingExample from './nesting';
import PositionMouseVrExample from './position-mouse.vr.ap';
import PositionVrExample from './position.vr.ap';
import RenderPropsExample from './render-props';
import ScrollExample from './scroll';
import TestingTopLayerFocusExample from './testing-top-layer-focus';
import TestingTopLayerPointerDismissExample from './testing-top-layer-pointer-dismiss';
import TooltipUpdateExample from './tooltip-update';
import TruncateVrExample from './truncate.vr.ap';
import ViewportEdgeDetectionExample from './viewport-edge-detection';
import VrPositionAllVrExample from './vr-position-all.vr.ap';
import VrPositionMouseAllVrExample from './vr-position-mouse-all.vr.ap';
import VrPositionRtlVrExample from './vr-position-rtl.vr.ap';
import WysiwygExample from './wysiwyg';

const AvoidTitleInTooltip: WorkbenchExample = wb(AvoidTitleInTooltipExample);

export default AvoidTitleInTooltip;
export const ComponentPropVr: WorkbenchExample = wb(ComponentPropVrExample);
export const CssPosition: WorkbenchExample = wb(CssPositionExample);
export const DefaultTooltipVr: WorkbenchExample = wb(DefaultTooltipVrExample);
export const Delay: WorkbenchExample = wb(DelayExample);
export const HideOnClick: WorkbenchExample = wb(HideOnClickExample);
export const HideOnMousedown: WorkbenchExample = wb(HideOnMousedownExample);
export const HoverIntent: WorkbenchExample = wb(HoverIntentExample);
export const InsidePopup: WorkbenchExample = wb(InsidePopupExample);
export const KeyboardShortcutGlobalStylesVr: WorkbenchExample = wb(
	KeyboardShortcutGlobalStylesVrExample,
);
export const KeyboardShortcutVr: WorkbenchExample = wb(KeyboardShortcutVrExample);
export const Nesting: WorkbenchExample = wb(NestingExample);
export const PositionMouseVr: WorkbenchExample = wb(PositionMouseVrExample);
export const PositionVr: WorkbenchExample<ComponentProps<typeof PositionVrExample>> =
	wb(PositionVrExample);
export const RenderProps: WorkbenchExample = wb(RenderPropsExample);
export const Scroll: WorkbenchExample = wb(ScrollExample);
export const TestingTopLayerFocus: WorkbenchExample = wb(TestingTopLayerFocusExample);
export const TestingTopLayerPointerDismiss: WorkbenchExample = wb(
	TestingTopLayerPointerDismissExample,
);
export const TooltipUpdate: WorkbenchExample = wb(TooltipUpdateExample);
export const TruncateVr: WorkbenchExample = wb(TruncateVrExample);
export const ViewportEdgeDetection: WorkbenchExample = wb(ViewportEdgeDetectionExample);
export const VrPositionAllVr: WorkbenchExample = wb(VrPositionAllVrExample);
export const VrPositionMouseAllVr: WorkbenchExample = wb(VrPositionMouseAllVrExample);
export const VrPositionRtlVr: WorkbenchExample = wb(VrPositionRtlVrExample);
export const Wysiwyg: WorkbenchExample = wb(WysiwygExample);
