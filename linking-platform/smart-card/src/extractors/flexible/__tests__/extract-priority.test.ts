import { type JsonLd } from 'json-ld-types';

import { IconType } from '../../../constants';
import extractPriority from '../extract-priority';
import { TEST_BASE_DATA } from '../../common/__mocks__/jsonld';

describe('extractPriority', () => {
  it.each([
    ['blocker', IconType.PriorityBlocker],
    ['critical', IconType.PriorityCritical],
    ['high', IconType.PriorityHigh],
    ['highest', IconType.PriorityHighest],
    ['low', IconType.PriorityLow],
    ['lowest', IconType.PriorityLowest],
    ['major', IconType.PriorityMajor],
    ['medium', IconType.PriorityMedium],
    ['minor', IconType.PriorityMinor],
    ['trivial', IconType.PriorityTrivial],
    ['undefined', IconType.PriorityUndefined],
  ])(
    'returns priority icon and label for %s',
    (priority: string, icon: IconType) => {
      const data = extractPriority({
        ...TEST_BASE_DATA,
        'atlassian:priority': priority,
      } as JsonLd.Data.Task);

      expect(data).toEqual({ icon, label: priority });
    },
  );

  it('returns priority icon url and label', () => {
    const label = 'Minor';
    const url = 'https://icon-url';
    const data = extractPriority({
      ...TEST_BASE_DATA,
      'atlassian:priority': {
        '@type': 'Object',
        name: label,
        icon: {
          '@type': 'Image',
          url,
        },
      },
    } as JsonLd.Data.Task);

    expect(data).toEqual({ label, url });
  });

  it('returns priority label', () => {
    const label = 'Minor';
    const data = extractPriority({
      ...TEST_BASE_DATA,
      'atlassian:priority': {
        '@type': 'Object',
        name: label,
      },
    } as JsonLd.Data.Task);

    expect(data).toEqual({ label });
  });

  it('returns undefined when priority is not provided', () => {
    expect(extractPriority(TEST_BASE_DATA as JsonLd.Data.Task)).toBeUndefined();
  });
});
