import { wb, type WorkbenchExample } from '@atlassian/workbench';

import ExampleCommentVrExample from './01-example-comment.vr.ap';
import CommentComponentsExample from './02-comment-components';
import NestedCommentsVrExample from './03-nested-comments.vr.ap';
import WithEditedFlagExample from './04-with-edited-flag';
import WithNoTopAndBottomBarsExample from './05-with-no-top-and-bottom-bars';
import WithDifferentAvatarSizesExample from './06-with-different-avatar-sizes';
import WithOptimisticSavingExample from './07-with-optimistic-saving';
import WithRestrictedSizeAndNonSpaceSeparatedContentVrExample from './08-with-restricted-size-and-non-space-separated-content.vr.ap';
import WithInlineChildrenVrExample from './09-with-inline-children.vr.ap';
import ExampleCommentHighlightedExample from './10-example-comment-highlighted';
import WithCustomHeadingLevelExample from './11-with-custom-heading-level';
import LongAuthorNameWithWrappingHeaderVrExample from './12-long-author-name-with-wrapping-header.vr.ap';
import LongAuthorNameWithoutWrappingHeaderVrExample from './13-long-author-name-without-wrapping-header.vr.ap';
import LongAuthorNameWithoutWrappingHeaderPropSetVrExample from './14-long-author-name-without-wrapping-header-prop-set.vr.ap';

const ExampleCommentVr: WorkbenchExample = wb(ExampleCommentVrExample);

export default ExampleCommentVr;
export const CommentComponents: WorkbenchExample = wb(CommentComponentsExample);
export const NestedCommentsVr: WorkbenchExample = wb(NestedCommentsVrExample);
export const WithEditedFlag: WorkbenchExample = wb(WithEditedFlagExample);
export const WithNoTopAndBottomBars: WorkbenchExample = wb(WithNoTopAndBottomBarsExample);
export const WithDifferentAvatarSizes: WorkbenchExample = wb(WithDifferentAvatarSizesExample);
export const WithOptimisticSaving: WorkbenchExample = wb(WithOptimisticSavingExample);
export const WithRestrictedSizeAndNonSpaceSeparatedContentVr: WorkbenchExample = wb(
	WithRestrictedSizeAndNonSpaceSeparatedContentVrExample,
);
export const WithInlineChildrenVr: WorkbenchExample = wb(WithInlineChildrenVrExample);
export const ExampleCommentHighlighted: WorkbenchExample = wb(ExampleCommentHighlightedExample);
export const WithCustomHeadingLevel: WorkbenchExample = wb(WithCustomHeadingLevelExample);
export const LongAuthorNameWithWrappingHeaderVr: WorkbenchExample = wb(
	LongAuthorNameWithWrappingHeaderVrExample,
);
export const LongAuthorNameWithoutWrappingHeaderVr: WorkbenchExample = wb(
	LongAuthorNameWithoutWrappingHeaderVrExample,
);
export const LongAuthorNameWithoutWrappingHeaderPropSetVr: WorkbenchExample = wb(
	LongAuthorNameWithoutWrappingHeaderPropSetVrExample,
);
