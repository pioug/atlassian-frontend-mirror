import { snapshot } from '@af/visual-regression';
import InlineCardDefaultIcon from '../../../examples/vr-inline-card-default-icon';
import InlineCardLozenge from '../../../examples/vr-inline-card-lozenge';
import InlineCardTextWrap from '../../../examples/vr-inline-card-text-wrap';
import InlineCardUnresolvedViews from '../../../examples/vr-inline-card-unresolved-views';

snapshot(InlineCardDefaultIcon, {
  ignoredLogs: [
    {
      pattern: /Failed to load resource/,
      ignoredBecause:
        'This error is expected when rendering an error boundary in a dev build',
      jiraIssueId: 'TODO-1',
    },
  ],
});
snapshot(InlineCardLozenge);
snapshot(InlineCardTextWrap, {
  ignoredLogs: [
    {
      pattern: /Failed to load resource/,
      ignoredBecause:
        'This error is expected when rendering an error boundary in a dev build',
      jiraIssueId: 'TODO-1',
    },
  ],
});
snapshot(InlineCardUnresolvedViews);

snapshot(InlineCardUnresolvedViews, {
  description:
    'inline card renders correctly when hovering over url in errored view',
  states: [
    { state: 'hovered', selector: { byTestId: 'inline-card-errored-view' } },
  ],
});
snapshot(InlineCardUnresolvedViews, {
  description:
    'inline card renders correctly when hovering over url in forbidden view',
  states: [
    { state: 'hovered', selector: { byTestId: 'inline-card-forbidden-view' } },
  ],
});
snapshot(InlineCardUnresolvedViews, {
  description:
    'inline card renders correctly when hovering over url in not-found view',
  states: [
    { state: 'hovered', selector: { byTestId: 'inline-card-not-found-view' } },
  ],
});
snapshot(InlineCardUnresolvedViews, {
  description:
    'inline card renders correctly when hovering over url in unauthorized view',
  states: [
    {
      state: 'hovered',
      selector: { byTestId: 'inline-card-unauthorized-view' },
    },
  ],
});
snapshot(InlineCardUnresolvedViews, {
  description:
    'inline card renders correctly when hovering over connect another account',
  states: [
    {
      state: 'hovered',
      selector: { byTestId: 'button-connect-other-account' },
    },
  ],
});
snapshot(InlineCardUnresolvedViews, {
  description:
    'inline card renders correctly when hovering over connect account',
  states: [
    { state: 'hovered', selector: { byTestId: 'button-connect-account' } },
  ],
});
