import { wb, type WorkbenchExample } from '@atlassian/workbench';

import VcObserverNextExample from './01-vc-observer-next';
import LatencyMouseEventsExample from './02-latency-mouse-events';
import VcObserverAttributeMutationExample from './02-vc-observer-attribute-mutation';
import VcObserverMovingNodeExample from './02-vc-observer-moving-node';
import VcObserverPlaceholderExample from './03-vc-observer-placeholder';
import VcObserverReactRemountExample from './03-vc-observer-react-remount';
import LatencyKeyboardEventsExample from './04-latency-keyboard-events';
import EditorFullPageExample from './05-editor-full-page';
import BasicReactExample from './06-basic-react';
import TtaiWithTimersExample from './07-ttai-with-timers';
import UserLatencyMetricsExample from './09-user-latency-metrics';
import PageComplexityScoreExample from './10-page-complexity-score';

export const VcObserverNext: WorkbenchExample = wb(VcObserverNextExample);
export const LatencyMouseEvents: WorkbenchExample = wb(LatencyMouseEventsExample);
export const VcObserverAttributeMutation: WorkbenchExample = wb(VcObserverAttributeMutationExample);
export const VcObserverMovingNode: WorkbenchExample = wb(VcObserverMovingNodeExample);
export const VcObserverPlaceholder: WorkbenchExample = wb(VcObserverPlaceholderExample);
export const VcObserverReactRemount: WorkbenchExample = wb(VcObserverReactRemountExample);
export const LatencyKeyboardEvents: WorkbenchExample = wb(LatencyKeyboardEventsExample);
export const EditorFullPage: WorkbenchExample = wb(EditorFullPageExample);
export const BasicReact: WorkbenchExample = wb(BasicReactExample);
export const TtaiWithTimers: WorkbenchExample = wb(TtaiWithTimersExample);
export const UserLatencyMetrics: WorkbenchExample = wb(UserLatencyMetricsExample);
export const PageComplexityScore: WorkbenchExample = wb(PageComplexityScoreExample);
