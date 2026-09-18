import { wb, type WorkbenchExample } from '@atlassian/workbench';

import BasicVrExample from './0-basic.vr.ap';
import BasicWithRichDescriptionExample from './01-basic-with-rich-description';
import OnlyMandatoryPropsExample from './1-only-mandatory-props';
import WithImageExample from './2-with-image';
import WithImageAndDescriptionExample from './3-with-image-and-description';
import NarrowSizeExample from './4-narrow-size';
import WithBigSvgImageExample from './5-with-big-svg-image';
import WithPrimaryActionExample from './6-with-primary-action';
import WithPrimaryAndSecondaryActionsExample from './7-with-primary-and-secondary-actions';
import WithPrimaryAndTertiaryActionsExample from './8-with-primary-and-tertiary-actions';
import LoadingStateExample from './9-loading-state';
import WithFixedSizeImageExample from './10-with-fixed-size-image';
import InThinContainerExample from './11-in-thin-container';
import WithHeadingLevelExample from './12-with-heading-level';
import WithButtongGroupLabelExample from './13-with-buttong-group-label';
import WithHeadingSizeVrExample from './14-with-heading-size.vr.ap';

const BasicVr: WorkbenchExample = wb(BasicVrExample);

export default BasicVr;
export const BasicWithRichDescription: WorkbenchExample = wb(BasicWithRichDescriptionExample);
export const OnlyMandatoryProps: WorkbenchExample = wb(OnlyMandatoryPropsExample);
export const WithFixedSizeImage: WorkbenchExample = wb(WithFixedSizeImageExample);
export const InThinContainer: WorkbenchExample = wb(InThinContainerExample);
export const WithHeadingLevel: WorkbenchExample = wb(WithHeadingLevelExample);
export const WithButtongGroupLabel: WorkbenchExample = wb(WithButtongGroupLabelExample);
export const WithHeadingSizeVr: WorkbenchExample = wb(WithHeadingSizeVrExample);
export const WithImage: WorkbenchExample = wb(WithImageExample);
export const WithImageAndDescription: WorkbenchExample = wb(WithImageAndDescriptionExample);
export const NarrowSize: WorkbenchExample = wb(NarrowSizeExample);
export const WithBigSvgImage: WorkbenchExample = wb(WithBigSvgImageExample);
export const WithPrimaryAction: WorkbenchExample = wb(WithPrimaryActionExample);
export const WithPrimaryAndSecondaryActions: WorkbenchExample = wb(
	WithPrimaryAndSecondaryActionsExample,
);
export const WithPrimaryAndTertiaryActions: WorkbenchExample = wb(
	WithPrimaryAndTertiaryActionsExample,
);
export const LoadingState: WorkbenchExample = wb(LoadingStateExample);
