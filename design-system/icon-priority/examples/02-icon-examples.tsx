import React from 'react';
import Theme from '@atlaskit/theme/components';
import { background } from '@atlaskit/theme/colors';

import PriorityBlocker from '../glyph/priority-blocker';
import PriorityCritical from '../glyph/priority-critical';
import PriorityHigh from '../glyph/priority-high';
import PriorityHighest from '../glyph/priority-highest';
import PriorityLow from '../glyph/priority-low';
import PriorityLowest from '../glyph/priority-lowest';
import PriorityMajor from '../glyph/priority-major';
import PriorityMidium from '../glyph/priority-medium';
import PriorityMinor from '../glyph/priority-minor';
import PriorityTrivial from '../glyph/priority-trivial';

const demoIcons = [
  PriorityTrivial,
  PriorityMinor,
  PriorityLowest,
  PriorityLow,
  PriorityMidium,
  PriorityHigh,
  PriorityHighest,
  PriorityMajor,
  PriorityBlocker,
  PriorityCritical,
];

export default function IconSizes() {
  return (
    <div data-testid="root">
      <Theme.Provider value={() => ({ mode: 'light' })}>
        <div data-testid="light-root">
          <div data-testid="small-icons">
            {demoIcons.map((Icon, i) => (
              <Icon key={i} label="" size="small" />
            ))}
          </div>
          <div data-testid="medium-icons">
            {demoIcons.map((Icon, i) => (
              <Icon key={i} label="" size="medium" />
            ))}
          </div>
          <div data-testid="large-icons">
            {demoIcons.map((Icon, i) => (
              <Icon key={i} label="" size="large" />
            ))}
          </div>
          <div data-testid="xlarge-icons">
            {demoIcons.map((Icon, i) => (
              <Icon key={i} label="" size="xlarge" />
            ))}
          </div>
        </div>
      </Theme.Provider>
      <Theme.Provider value={() => ({ mode: 'dark' })}>
        <div
          data-testid="dark-root"
          style={{ backgroundColor: background({ theme: { mode: 'dark' } }) }}
        >
          <div data-testid="small-icons">
            {demoIcons.map((Icon, i) => (
              <Icon key={i} label="" size="small" />
            ))}
          </div>
          <div data-testid="medium-icons">
            {demoIcons.map((Icon, i) => (
              <Icon key={i} label="" size="medium" />
            ))}
          </div>
          <div data-testid="large-icons">
            {demoIcons.map((Icon, i) => (
              <Icon key={i} label="" size="large" />
            ))}
          </div>
          <div data-testid="xlarge-icons">
            {demoIcons.map((Icon, i) => (
              <Icon key={i} label="" size="xlarge" />
            ))}
          </div>
        </div>
      </Theme.Provider>
    </div>
  );
}
