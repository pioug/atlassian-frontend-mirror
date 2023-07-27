import { snapshot } from '@af/visual-regression';
import InlineCardDefaultIcon from '../../../examples/vr-inline-card-default-icon';
import InlineCardLozenge from '../../../examples/vr-inline-card-lozenge';
import InlineCardTextWrap from '../../../examples/vr-inline-card-text-wrap';
import InlineCardError from '../../../examples/vr-inline-card/vr-inline-card-error';
import InlineCardForbidden from '../../../examples/vr-inline-card/vr-inline-card-forbidden';
import InlineCardNotFound from '../../../examples/vr-inline-card/vr-inline-card-not-found';
import InlineCardUnauthorised from '../../../examples/vr-inline-card/vr-inline-card-unauthorised';
import InlineCardUnauthorisedNoAuth from '../../../examples/vr-inline-card/vr-inline-card-unauthorised-no-auth';

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
snapshot(InlineCardError);
snapshot(InlineCardError, {
  description:
    'inline card error view renders correctly when hovering over url in errored view',
  states: [
    { state: 'hovered', selector: { byTestId: 'inline-card-errored-view' } },
  ],
});
snapshot(InlineCardForbidden);
snapshot(InlineCardForbidden, {
  description:
    'inline card forbidden view renders correctly when hovering over url in forbidden view',
  states: [
    { state: 'hovered', selector: { byTestId: 'inline-card-forbidden-view' } },
  ],
});
snapshot(InlineCardForbidden, {
  description:
    'inline card forbidden view renders correctly when hovering over connect another account',
  states: [
    {
      state: 'hovered',
      selector: { byTestId: 'button-connect-other-account' },
    },
  ],
});
snapshot(InlineCardNotFound);
snapshot(InlineCardNotFound, {
  description:
    'inline card not found view renders correctly when hovering over url in not-found view',
  states: [
    { state: 'hovered', selector: { byTestId: 'inline-card-not-found-view' } },
  ],
});
snapshot(InlineCardUnauthorised);
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
snapshot(InlineCardUnauthorisedNoAuth);
