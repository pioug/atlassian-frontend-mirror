import React from 'react';
import Theme from '@atlaskit/theme/components';
import { background } from '@atlaskit/theme/colors';

import metadata from '../src/metadata';

const icons16 = Object.keys(metadata)
  .map((name) => {
    if (name.includes('16')) {
      return require(`../glyph/${name}.js`).default;
    }

    return null;
  })
  .filter(Boolean);

const icons24 = Object.keys(metadata)
  .map((name) => {
    if (name.includes('24')) {
      return require(`../glyph/${name}.js`).default;
    }

    return null;
  })
  .filter(Boolean);

const icons48 = Object.keys(metadata)
  .map((name) => {
    if (name.includes('48')) {
      return require(`../glyph/${name}.js`).default;
    }

    return null;
  })
  .filter(Boolean);

export default function IconExamples() {
  return (
    <div data-testid="root">
      <div data-testid="light-root">
        <div>
          {icons16.map((Icon, index) => (
            <Icon key={index} />
          ))}
        </div>
        <div>
          {icons24.map((Icon, index) => (
            <Icon key={index} />
          ))}
        </div>
        <div>
          {icons48.map((Icon, index) => (
            <Icon key={index} />
          ))}
        </div>
      </div>

      <Theme.Provider value={() => ({ mode: 'dark' })}>
        <div
          style={{ backgroundColor: background({ theme: { mode: 'dark' } }) }}
          data-testid="dark-root"
        >
          <div>
            {icons16.map((Icon, index) => (
              <Icon key={index} />
            ))}
          </div>
          <div>
            {icons24.map((Icon, index) => (
              <Icon key={index} />
            ))}
          </div>
          <div>
            {icons48.map((Icon, index) => (
              <Icon key={index} />
            ))}
          </div>
        </div>
      </Theme.Provider>
    </div>
  );
}
