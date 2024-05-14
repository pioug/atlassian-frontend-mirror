import { snapshot } from '@af/visual-regression';

import {
  EmojiPickerWithUpload,
  EmojiPickerWithoutUpload,
} from './picker.fixture';

snapshot(EmojiPickerWithUpload, {
  ignoredErrors: [
    {
      pattern:
        /Can't perform a React state update on a component that hasn't mounted yet/,
      ignoredBecause: 'React 18 causes a warning to occur',
      jiraIssueId: 'TODO-123',
    },
  ],
});
snapshot(EmojiPickerWithoutUpload, {
  ignoredErrors: [
    {
      pattern:
        /Can't perform a React state update on a component that hasn't mounted yet/,
      ignoredBecause: 'React 18 causes a warning to occur',
      jiraIssueId: 'TODO-123',
    },
  ],
});
