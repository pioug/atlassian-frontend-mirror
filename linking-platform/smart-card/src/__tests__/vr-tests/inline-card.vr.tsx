import { snapshot } from '@af/visual-regression';
import InlineCardDefault from '../../../examples/vr-inline-card-default-icon';
import InlineCardTextWrap from '../../../examples/vr-inline-card-text-wrap';
import InlineCardError from '../../../examples/vr-inline-card/vr-inline-card-error';
import InlineCardForbidden from '../../../examples/vr-inline-card/vr-inline-card-forbidden';
import InlineCardNotFound from '../../../examples/vr-inline-card/vr-inline-card-not-found';
import InlineCardUnauthorised from '../../../examples/vr-inline-card/vr-inline-card-unauthorised';
import InlineCardUnauthorisedNoAuth from '../../../examples/vr-inline-card/vr-inline-card-unauthorised-no-auth';

snapshot(InlineCardDefault, {
  description: 'inline card with default icon',
  ignoredErrors: [
    {
      pattern: /Failed to load resource/,
      ignoredBecause:
        'This error is expected when rendering an error boundary in a dev build',
      jiraIssueId: 'TODO-1',
    },
  ],
});
snapshot(InlineCardDefault, {
  description: 'inline card renders correctly when hovering over url',
  ignoredErrors: [
    {
      pattern: /Failed to load resource/,
      ignoredBecause:
        'This error is expected when rendering an error boundary in a dev build',
      jiraIssueId: 'TODO-1',
    },
  ],
  states: [
    { state: 'hovered', selector: { byTestId: 'inline-card-resolved-view' } },
  ],
});
snapshot(InlineCardTextWrap, {
  description: 'inline card with wrapped text renders correctly',
  ignoredErrors: [
    {
      pattern: /Failed to load resource/,
      ignoredBecause:
        'This error is expected when rendering an error boundary in a dev build',
      jiraIssueId: 'TODO-1',
    },
  ],
});
snapshot(InlineCardError, {
  description: 'inline card error view',
});
snapshot(InlineCardError, {
  description:
    'inline card error view renders correctly when hovering over url in errored view',
  states: [
    { state: 'hovered', selector: { byTestId: 'inline-card-errored-view' } },
  ],
});
snapshot(InlineCardForbidden, {
  description: 'inline card forbidden view',
});
snapshot(InlineCardForbidden, {
  description:
    'inline card forbidden view renders correctly when hovering over url in forbidden view',
  states: [
    { state: 'hovered', selector: { byTestId: 'inline-card-forbidden-view' } },
  ],
});
snapshot(InlineCardNotFound, {
  description: `inline card can't find link view`,
});
snapshot(InlineCardNotFound, {
  description:
    'inline card not found view renders correctly when hovering over url in not-found view',
  states: [
    { state: 'hovered', selector: { byTestId: 'inline-card-not-found-view' } },
  ],
});
snapshot(InlineCardUnauthorised, {
  description: `inline card unauthorised view`,
});
snapshot(InlineCardUnauthorised, {
  description:
    'inline card unauthorised view renders correctly when hovering over url in unauthorized view',
  states: [
    {
      state: 'hovered',
      selector: { byTestId: 'inline-card-unauthorized-view' },
    },
  ],
});
snapshot(InlineCardUnauthorised, {
  description:
    'inline card unauthorised view renders correctly when hovering over connect account',
  states: [
    { state: 'hovered', selector: { byTestId: 'button-connect-account' } },
  ],
});
snapshot(InlineCardUnauthorisedNoAuth, {
  description: `inline card unauthorised view with no auth`,
});

// //Same list of tests for refreshed inline card design under the FF
// //TODO: Delete during the 'platform.linking-platform.smart-card.show-smart-links-refreshed-design' FF clean up

snapshot(InlineCardDefault, {
  description: 'refreshed inline card with default icon',
  ignoredErrors: [
    {
      pattern: /Failed to load resource/,
      ignoredBecause:
        'This error is expected when rendering an error boundary in a dev build',
      jiraIssueId: 'TODO-1',
    },
  ],
  hooks: {
    featureFlags: {
      'platform.linking-platform.smart-card.show-smart-links-refreshed-design':
        true,
    },
  },
});
snapshot(InlineCardDefault, {
  description: 'refreshed inline card renders correctly when hovering over url',
  ignoredErrors: [
    {
      pattern: /Failed to load resource/,
      ignoredBecause:
        'This error is expected when rendering an error boundary in a dev build',
      jiraIssueId: 'TODO-1',
    },
  ],
  hooks: {
    featureFlags: {
      'platform.linking-platform.smart-card.show-smart-links-refreshed-design':
        true,
    },
  },
  states: [
    { state: 'hovered', selector: { byTestId: 'inline-card-resolved-view' } },
  ],
});
snapshot(InlineCardTextWrap, {
  description: 'refreshed inline card with wrapped text renders correctly',
  ignoredErrors: [
    {
      pattern: /Failed to load resource/,
      ignoredBecause:
        'This error is expected when rendering an error boundary in a dev build',
      jiraIssueId: 'TODO-1',
    },
  ],
  hooks: {
    featureFlags: {
      'platform.linking-platform.smart-card.show-smart-links-refreshed-design':
        true,
    },
  },
});
snapshot(InlineCardError, {
  description: 'refreshed inline card error view',
  hooks: {
    featureFlags: {
      'platform.linking-platform.smart-card.show-smart-links-refreshed-design':
        true,
    },
  },
});
snapshot(InlineCardError, {
  description:
    'refreshed inline card error view renders correctly when hovering over url in errored view',
  hooks: {
    featureFlags: {
      'platform.linking-platform.smart-card.show-smart-links-refreshed-design':
        true,
    },
  },
  states: [
    { state: 'hovered', selector: { byTestId: 'inline-card-errored-view' } },
  ],
});
snapshot(InlineCardForbidden, {
  description: 'refreshed inline card forbidden view',
  hooks: {
    featureFlags: {
      'platform.linking-platform.smart-card.show-smart-links-refreshed-design':
        true,
    },
  },
});
snapshot(InlineCardForbidden, {
  description:
    'refreshed inline card forbidden view renders correctly when hovering over url in forbidden view',
  hooks: {
    featureFlags: {
      'platform.linking-platform.smart-card.show-smart-links-refreshed-design':
        true,
    },
  },
  states: [
    { state: 'hovered', selector: { byTestId: 'inline-card-forbidden-view' } },
  ],
});
snapshot(InlineCardNotFound, {
  description: `refreshed inline card can't find link view`,
  hooks: {
    featureFlags: {
      'platform.linking-platform.smart-card.show-smart-links-refreshed-design':
        true,
    },
  },
});
snapshot(InlineCardNotFound, {
  description:
    'refreshed inline card not found view renders correctly when hovering over url in not-found view',
  hooks: {
    featureFlags: {
      'platform.linking-platform.smart-card.show-smart-links-refreshed-design':
        true,
    },
  },
  states: [
    { state: 'hovered', selector: { byTestId: 'inline-card-not-found-view' } },
  ],
});
snapshot(InlineCardUnauthorised, {
  description: `refreshed inline card unauthorised view`,
  hooks: {
    featureFlags: {
      'platform.linking-platform.smart-card.show-smart-links-refreshed-design':
        true,
    },
  },
});
snapshot(InlineCardUnauthorised, {
  description:
    'refreshed inline card unauthorised view renders correctly when hovering over url in unauthorized view',
  hooks: {
    featureFlags: {
      'platform.linking-platform.smart-card.show-smart-links-refreshed-design':
        true,
    },
  },
  states: [
    {
      state: 'hovered',
      selector: { byTestId: 'inline-card-unauthorized-view' },
    },
  ],
});
snapshot(InlineCardUnauthorised, {
  description:
    'refreshed inline card unauthorised view renders correctly when hovering over connect account',
  hooks: {
    featureFlags: {
      'platform.linking-platform.smart-card.show-smart-links-refreshed-design':
        true,
    },
  },
  states: [
    { state: 'hovered', selector: { byTestId: 'button-connect-account' } },
  ],
});
snapshot(InlineCardUnauthorisedNoAuth, {
  description: `refreshed inline card unauthorised view with no auth`,
  hooks: {
    featureFlags: {
      'platform.linking-platform.smart-card.show-smart-links-refreshed-design':
        true,
    },
  },
});
