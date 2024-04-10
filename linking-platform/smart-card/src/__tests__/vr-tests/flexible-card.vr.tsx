import { snapshot } from '@af/visual-regression';

import FlexibleUiOptions from '../../../examples/vr-flexible-card/vr-flexible-ui-options';
import FlexibleUiComposition from '../../../examples/vr-flexible-card/vr-flexible-ui-composition';

import FlexibleUiBlock from '../../../examples/vr-flexible-card/vr-flexible-ui-block';
import FlexibleUiBlockActionList from '../../../examples/vr-flexible-card/vr-flexible-ui-block-action';
import FlexibleUiBlockAISummary from '../../../examples/vr-flexible-card/vr-flexible-ui-block-ai-summary';
import FlexibleUiBlockTitle from '../../../examples/vr-flexible-card/vr-flexible-ui-block-title';
import FlexibleUiBlockMetadata from '../../../examples/vr-flexible-card/vr-flexible-ui-block-metadata';
import FlexibleUiBlockSnippet from '../../../examples/vr-flexible-card/vr-flexible-ui-block-snippet';
import FlexibleUiBlockFooter from '../../../examples/vr-flexible-card/vr-flexible-ui-block-footer';
import FlexibleUiBlockPreview from '../../../examples/vr-flexible-card/vr-flexible-ui-block-preview';
import FlexibleUiBlockActionGroup from '../../../examples/vr-flexible-card/vr-flexible-ui-block-action-group';
import FlexibleUiBlockAction from '../../../examples/vr-flexible-card/vr-flexible-ui-action';

import FlexibleUiElementLink from '../../../examples/vr-flexible-card/vr-flexible-ui-element-link';
import FlexibleUiElementLozenge from '../../../examples/vr-flexible-card/vr-flexible-ui-element-lozenge';
import FlexibleUiElementBadge from '../../../examples/vr-flexible-card/vr-flexible-ui-element-badge';
import FlexibleUiElementAvatarGroup from '../../../examples/vr-flexible-card/vr-flexible-ui-element-avatar-group';
import FlexibleUiElementMedia from '../../../examples/vr-flexible-card/vr-flexible-ui-element-media';

import FlexibleUiHoverCard from '../../../examples/vr-flexible-card/vr-flexible-ui-hover-card';
import FlexibleUiHoverCardNoPreviewButton from '../../../examples/vr-flexible-card/vr-flexible-ui-hover-card-no-preview-button';

import FlexibleUiAccessibility from '../../../examples/vr-flexible-card/vr-flexible-ui-accessibility';
import FlexibleUiAccessibilityForbidden from '../../../examples/vr-flexible-card/vr-flexible-ui-accessibility-forbidden';

import FlexibleUiBlockCardErroredStates from '../../../examples/vr-flexible-card/vr-flexible-ui-block-card-errored-states';

// Variants
snapshot(FlexibleUiOptions);
snapshot(FlexibleUiComposition, {
  states: [
    {
      selector: {
        byTestId: 'smart-action-delete-action-0',
      },
      state: 'hovered',
    },
  ],
});

// Blocks
snapshot(FlexibleUiBlock);
snapshot(FlexibleUiBlockTitle);
snapshot(FlexibleUiBlockTitle, {
  description: 'flexible-ui-block-title--title hovered',
  states: [
    {
      selector: {
        byTestId: 'actions-on-hover-title-block-resolved-view',
      },
      state: 'hovered',
    },
  ],
});
snapshot(FlexibleUiBlockTitle, {
  description: 'flexible-ui-block-title--more actions hovered',
  states: [
    {
      selector: {
        byTestId: 'action-group-more-button',
      },
      state: 'hovered',
    },
  ],
});
snapshot(FlexibleUiBlockMetadata);
snapshot(FlexibleUiBlockSnippet);
snapshot(FlexibleUiBlockFooter);
snapshot(FlexibleUiBlockAISummary);
snapshot(FlexibleUiBlockPreview);
snapshot(FlexibleUiBlockActionList);
snapshot(FlexibleUiBlockAction);
snapshot(FlexibleUiBlockActionGroup, { drawsOutsideBounds: true });
snapshot(FlexibleUiBlockActionGroup, {
  description: 'flexible-ui-block-action-group--item hovered',
  drawsOutsideBounds: true,
  states: [
    { selector: { byTestId: 'smart-action-delete-action' }, state: 'hovered' },
  ],
});
snapshot(FlexibleUiBlockActionGroup, {
  description: 'flexible-ui-block-action-group--item focused',
  drawsOutsideBounds: true,
  states: [
    { selector: { byTestId: 'smart-action-delete-action' }, state: 'focused' },
  ],
});

// Elements
snapshot(FlexibleUiElementLink);
snapshot(FlexibleUiElementLozenge);
snapshot(FlexibleUiElementBadge);
snapshot(FlexibleUiElementAvatarGroup);
snapshot(FlexibleUiElementMedia);

// Hovercard
snapshot(FlexibleUiHoverCard, {
  drawsOutsideBounds: true,
  states: [
    {
      selector: {
        byTestId: 'smart-element-link',
      },
      state: 'hovered',
    },
  ],
});
snapshot(FlexibleUiHoverCardNoPreviewButton, {
  drawsOutsideBounds: true,
  states: [
    {
      selector: {
        byTestId: 'smart-element-link',
      },
      state: 'hovered',
    },
  ],
});

// Accessibility
snapshot(FlexibleUiAccessibility, {
  description: 'flexible=ui-accessibility--title focused',
  states: [
    {
      selector: {
        byTestId: 'smart-element-link',
      },
      state: 'focused',
    },
  ],
});
snapshot(FlexibleUiAccessibility, {
  description: 'flexible=ui-accessibility--hidden action button focused',
  states: [
    {
      selector: {
        byTestId: 'action-group-more-button',
      },
      state: 'focused',
    },
  ],
  drawsOutsideBounds: true,
});
snapshot(FlexibleUiAccessibilityForbidden, {
  description: 'flexible=ui-accessibility--forbidden title focused',
  states: [
    {
      selector: {
        byTestId: 'smart-element-link',
      },
      state: 'focused',
    },
  ],
});
snapshot(FlexibleUiAccessibilityForbidden, {
  description: 'flexible=ui-accessibility--error message focused',
  states: [
    {
      selector: {
        byTestId: 'keyboard-2-errored-view-message',
      },
      state: 'focused',
    },
  ],
});
snapshot(FlexibleUiAccessibilityForbidden, {
  description: 'flexible=ui-accessibility--custom action item focused',
  states: [
    {
      selector: {
        byTestId: 'action-item-custom',
      },
      state: 'focused',
    },
  ],
});

// Error states
snapshot(FlexibleUiBlockCardErroredStates);
// Flex block card forbidden snapshot already taken in
// platform/packages/linking-platform/smart-card/src/__tests__/vr-tests/block-card.vr.tsx (BlockCardForbiddenViews)
