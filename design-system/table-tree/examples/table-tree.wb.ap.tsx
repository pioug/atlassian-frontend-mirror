import { wb, type WorkbenchExample } from '@atlassian/workbench';

import ControlledExpandedStateVrExample from './controlled-expanded-state.vr.ap';
import DefaultExpandedRowsExample from './default-expanded-rows';
import EventsExample from './events';
import LoadingExample from './loading';
import LoadingNestedExample from './loading-nested';
import PerformanceExample from './performance';
import RenderPropAsyncWithAppendItemsExample from './render-prop-async-with-append-items';
import RenderPropAsyncWithUpdateItemsExample from './render-prop-async-with-update-items';
import RenderPropNoHeadersExample from './render-prop-no-headers';
import ShouldExpandOnClickExample from './should-expand-on-click';
import SimpleForceupdateExample from './simple-forceupdate';
import SingleComponentExample from './single-component';
import SingleComponentFlatExample from './single-component-flat';
import SingleComponentNoHeadersExample from './single-component-no-headers';
import SinglelineAndOverflowExample from './singleline-and-overflow';
import SlowLoadExample from './slow-load';
import StaticDataExample from './static-data';
import SyncDataExample from './sync-data';
import UpdateDataExample from './update-data';
import VrLoadingNestedVrExample from './vr-loading-nested.vr.ap';
import VrLoadingVrExample from './vr-loading.vr.ap';
import VrOverflowBehaviorVrExample from './vr-overflow-behavior.vr.ap';
import WithDifferentChildComponentExample from './with-different-child-component';
import WithExtendedLabelOnExpandExample from './with-extended-label-on-expand';

const ControlledExpandedStateVr: WorkbenchExample = wb(ControlledExpandedStateVrExample);

export default ControlledExpandedStateVr;
export const DefaultExpandedRows: WorkbenchExample = wb(DefaultExpandedRowsExample);
export const Events: WorkbenchExample = wb(EventsExample);
export const Loading: WorkbenchExample = wb(LoadingExample);
export const LoadingNested: WorkbenchExample = wb(LoadingNestedExample);
export const Performance: WorkbenchExample = wb(PerformanceExample);
export const RenderPropAsyncWithAppendItems: WorkbenchExample = wb(
	RenderPropAsyncWithAppendItemsExample,
);
export const RenderPropAsyncWithUpdateItems: WorkbenchExample = wb(
	RenderPropAsyncWithUpdateItemsExample,
);
export const RenderPropNoHeaders: WorkbenchExample = wb(RenderPropNoHeadersExample);
export const ShouldExpandOnClick: WorkbenchExample = wb(ShouldExpandOnClickExample);
export const SimpleForceupdate: WorkbenchExample = wb(SimpleForceupdateExample);
export const SingleComponent: WorkbenchExample = wb(SingleComponentExample);
export const SingleComponentFlat: WorkbenchExample = wb(SingleComponentFlatExample);
export const SingleComponentNoHeaders: WorkbenchExample = wb(SingleComponentNoHeadersExample);
export const SinglelineAndOverflow: WorkbenchExample = wb(SinglelineAndOverflowExample);
export const SlowLoad: WorkbenchExample = wb(SlowLoadExample);
export const StaticData: WorkbenchExample = wb(StaticDataExample);
export const SyncData: WorkbenchExample = wb(SyncDataExample);
export const UpdateData: WorkbenchExample = wb(UpdateDataExample);
export const VrLoadingNestedVr: WorkbenchExample = wb(VrLoadingNestedVrExample);
export const VrLoadingVr: WorkbenchExample = wb(VrLoadingVrExample);
export const VrOverflowBehaviorVr: WorkbenchExample = wb(VrOverflowBehaviorVrExample);
export const WithDifferentChildComponent: WorkbenchExample = wb(WithDifferentChildComponentExample);
export const WithExtendedLabelOnExpand: WorkbenchExample = wb(WithExtendedLabelOnExpandExample);
