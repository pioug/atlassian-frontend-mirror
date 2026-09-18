import { wb, type WorkbenchExample } from '@atlassian/workbench';

import JsonLdEditorExample from './00-json-ld-editor';
import ShowcaseExample from './01-showcase';
import FlexibleSmartLinksBuilderExample from './03-flexible-smart-links-builder';
import InlineCardViewsExample from './11-inline-card-views';
import BlockCardViewsExample from './12-block-card-views';
import EmbedCardViewsExample from './13-embed-card-views';
import HoverCardViewsExample from './14-hover-card-views';
import LinkUrlExample from './15-link-url';
import FlexibleCardElementsAndActionsExample from './16-flexible-card-elements-and-actions';
import FlexibleCardWithPlaceholderDataExample from './17-flexible-card-with-placeholder-data';
import CustomResolverExample from './21-custom-resolver';
import RelatedLinksModalExample from './25-related-links-modal';
import AiSummaryMarkdownExample from './26-ai-summary-markdown';
import InlineCardLazyIconsExample from './27-inline-card-lazy-icons';
import BlockCardLazyIconsExample from './28-block-card-lazy-icons';
import EmbedModalViewsExample from './29-embed-modal-views';
import AutomationActionExample from './30-automation-action';
import IconElementVariationsExample from './31-icon-element-variations';
import VrBlockCardSocialProofExample from './vr-block-card-social-proof.vr.ap';
import VrEdgeCaseReduxStoreResetExample from './vr-edge-case-redux-store-reset';
import VrHoverCardRovoChatActionExample from './vr-hover-card-rovo-chat-action';
import VrInlineCardResolvedRovoActionsExample from './vr-inline-card-resolved-rovo-actions.vr.ap';
import VrInlineCardWithStatusExample from './vr-inline-card-with-status.vr.ap';

export const JsonLdEditor: WorkbenchExample = wb(JsonLdEditorExample);
export const Showcase: WorkbenchExample = wb(ShowcaseExample);
export const FlexibleSmartLinksBuilder: WorkbenchExample = wb(FlexibleSmartLinksBuilderExample);
export const InlineCardViews: WorkbenchExample = wb(InlineCardViewsExample);
export const BlockCardViews: WorkbenchExample = wb(BlockCardViewsExample);
export const EmbedCardViews: WorkbenchExample = wb(EmbedCardViewsExample);
export const HoverCardViews: WorkbenchExample = wb(HoverCardViewsExample);
export const LinkUrl: WorkbenchExample = wb(LinkUrlExample);
export const FlexibleCardElementsAndActions: WorkbenchExample = wb(
	FlexibleCardElementsAndActionsExample,
);
export const FlexibleCardWithPlaceholderData: WorkbenchExample = wb(
	FlexibleCardWithPlaceholderDataExample,
);
export const CustomResolver: WorkbenchExample = wb(CustomResolverExample);
export const RelatedLinksModal: WorkbenchExample = wb(RelatedLinksModalExample);
export const AiSummaryMarkdown: WorkbenchExample = wb(AiSummaryMarkdownExample);
export const InlineCardLazyIcons: WorkbenchExample = wb(InlineCardLazyIconsExample);
export const BlockCardLazyIcons: WorkbenchExample = wb(BlockCardLazyIconsExample);
export const EmbedModalViews: WorkbenchExample = wb(EmbedModalViewsExample);
export const AutomationAction: WorkbenchExample = wb(AutomationActionExample);
export const IconElementVariations: WorkbenchExample = wb(IconElementVariationsExample);
export const VrBlockCardSocialProof: WorkbenchExample = wb(VrBlockCardSocialProofExample);
export const VrEdgeCaseReduxStoreReset: WorkbenchExample = wb(VrEdgeCaseReduxStoreResetExample);
export const VrHoverCardRovoChatAction: WorkbenchExample = wb(VrHoverCardRovoChatActionExample);
export const VrInlineCardResolvedRovoActions: WorkbenchExample = wb(
	VrInlineCardResolvedRovoActionsExample,
);
export const VrInlineCardWithStatus: WorkbenchExample = wb(VrInlineCardWithStatusExample);
