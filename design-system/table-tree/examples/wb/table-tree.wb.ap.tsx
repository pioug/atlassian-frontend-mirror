import { wb, type WorkbenchExample } from '@atlassian/workbench';

import ControlledExpandedStateVrExample from '../controlled-expanded-state.vr.ap';
import DefaultExpandedRowsExample from '../default-expanded-rows';
import EventsExample from '../events';
import LoadingExample from '../loading';
import LoadingNestedExample from '../loading-nested';
import PerformanceExample from '../performance';
import RenderPropAsyncWithAppendItemsExample from '../render-prop-async-with-append-items';
import RenderPropAsyncWithUpdateItemsExample from '../render-prop-async-with-update-items';
import RenderPropNoHeadersExample from '../render-prop-no-headers';
import ShouldExpandOnClickExample from '../should-expand-on-click';
import SimpleForceupdateExample from '../simple-forceupdate';
import SingleComponentExample from '../single-component';
import SingleComponentFlatExample from '../single-component-flat';
import SingleComponentNoHeadersExample from '../single-component-no-headers';
import SinglelineAndOverflowExample from '../singleline-and-overflow';
import SlowLoadExample from '../slow-load';
import StaticDataExample from '../static-data';
import SyncDataExample from '../sync-data';
import UpdateDataExample from '../update-data';
import VrLoadingNestedVrExample from '../vr-loading-nested.vr.ap';
import VrLoadingVrExample from '../vr-loading.vr.ap';
import VrOverflowBehaviorVrExample from '../vr-overflow-behavior.vr.ap';
import WithDifferentChildComponentExample from '../with-different-child-component';
import WithExtendedLabelOnExpandExample from '../with-extended-label-on-expand';

export const ControlledExpandedStateVr: WorkbenchExample<typeof ControlledExpandedStateVrExample> =
	wb(ControlledExpandedStateVrExample);

export const DefaultExpandedRows: WorkbenchExample<typeof DefaultExpandedRowsExample> = wb(
	DefaultExpandedRowsExample,
);
export const Events: WorkbenchExample<typeof EventsExample> = wb(EventsExample);
export const Loading: WorkbenchExample<typeof LoadingExample> = wb(LoadingExample);
export const LoadingNested: WorkbenchExample<typeof LoadingNestedExample> =
	wb(LoadingNestedExample);
export const Performance: WorkbenchExample<typeof PerformanceExample> = wb(PerformanceExample);
export const RenderPropAsyncWithAppendItems: WorkbenchExample<
	typeof RenderPropAsyncWithAppendItemsExample
> = wb(RenderPropAsyncWithAppendItemsExample);
export const RenderPropAsyncWithUpdateItems: WorkbenchExample<
	typeof RenderPropAsyncWithUpdateItemsExample
> = wb(RenderPropAsyncWithUpdateItemsExample);
export const RenderPropNoHeaders: WorkbenchExample<typeof RenderPropNoHeadersExample> = wb(
	RenderPropNoHeadersExample,
);
export const ShouldExpandOnClick: WorkbenchExample<typeof ShouldExpandOnClickExample> = wb(
	ShouldExpandOnClickExample,
);
export const SimpleForceupdate: WorkbenchExample<typeof SimpleForceupdateExample> =
	wb(SimpleForceupdateExample);
export const SingleComponent: WorkbenchExample<typeof SingleComponentExample> =
	wb(SingleComponentExample);
export const SingleComponentFlat: WorkbenchExample<typeof SingleComponentFlatExample> = wb(
	SingleComponentFlatExample,
);
export const SingleComponentNoHeaders: WorkbenchExample<typeof SingleComponentNoHeadersExample> =
	wb(SingleComponentNoHeadersExample);
export const SinglelineAndOverflow: WorkbenchExample<typeof SinglelineAndOverflowExample> = wb(
	SinglelineAndOverflowExample,
);
export const SlowLoad: WorkbenchExample<typeof SlowLoadExample> = wb(SlowLoadExample);
export const StaticData: WorkbenchExample<typeof StaticDataExample> = wb(StaticDataExample);
export const SyncData: WorkbenchExample<typeof SyncDataExample> = wb(SyncDataExample);
export const UpdateData: WorkbenchExample<typeof UpdateDataExample> = wb(UpdateDataExample);
export const VrLoadingNestedVr: WorkbenchExample<typeof VrLoadingNestedVrExample> =
	wb(VrLoadingNestedVrExample);
export const VrLoadingVr: WorkbenchExample<typeof VrLoadingVrExample> = wb(VrLoadingVrExample);
export const VrOverflowBehaviorVr: WorkbenchExample<typeof VrOverflowBehaviorVrExample> = wb(
	VrOverflowBehaviorVrExample,
);
export const WithDifferentChildComponent: WorkbenchExample<
	typeof WithDifferentChildComponentExample
> = wb(WithDifferentChildComponentExample);
export const WithExtendedLabelOnExpand: WorkbenchExample<typeof WithExtendedLabelOnExpandExample> =
	wb(WithExtendedLabelOnExpandExample);
