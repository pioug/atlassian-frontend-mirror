import { wb, type WorkbenchExample } from '@atlassian/workbench';

import BasicVrExample from './0-basic.vr.ap';
import LongVrExample from './1-long.vr.ap';
import PlaygroundExample from './1-playground';
import StatefulExample from './1-stateful';
import StatelessExample from './1-stateless';
import IconsVrExample from './4-icons.vr.ap';
import PrimitivesVrExample from './6-primitives.vr.ap';
import ManyInContainerVrExample from './7-many-in-container.vr.ap';
import CustomAriaLabelOfEllipsisExample from './8-custom-aria-label-of-ellipsis';
import ExpandExample from './8-expand';
import WithItemAndOnClickExample from './9-with-item-and-on-click';
import WithOnClickNoHrefExample from './10-with-on-click-no-href';
import TruncationVrExample from './11-truncation.vr.ap';
import SkeletonVrExample from './12-skeleton.vr.ap';
import WithElementNextToBreadcrumbsVrExample from './14-with-element-next-to-breadcrumbs.vr.ap';
import TestingExample from './99-testing';

const BasicVr: WorkbenchExample = wb(BasicVrExample);

export default BasicVr;
export const LongVr: WorkbenchExample = wb(LongVrExample);
export const Playground: WorkbenchExample = wb(PlaygroundExample);
export const Stateful: WorkbenchExample = wb(StatefulExample);
export const Stateless: WorkbenchExample = wb(StatelessExample);
export const WithOnClickNoHref: WorkbenchExample = wb(WithOnClickNoHrefExample);
export const TruncationVr: WorkbenchExample = wb(TruncationVrExample);
export const SkeletonVr: WorkbenchExample = wb(SkeletonVrExample);
export const WithElementNextToBreadcrumbsVr: WorkbenchExample = wb(
	WithElementNextToBreadcrumbsVrExample,
);
export const IconsVr: WorkbenchExample = wb(IconsVrExample);
export const PrimitivesVr: WorkbenchExample = wb(PrimitivesVrExample);
export const ManyInContainerVr: WorkbenchExample = wb(ManyInContainerVrExample);
export const CustomAriaLabelOfEllipsis: WorkbenchExample = wb(CustomAriaLabelOfEllipsisExample);
export const Expand: WorkbenchExample = wb(ExpandExample);
export const WithItemAndOnClick: WorkbenchExample = wb(WithItemAndOnClickExample);
export const Testing: WorkbenchExample = wb(TestingExample);
