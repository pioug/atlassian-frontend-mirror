import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { token } from '@atlaskit/tokens';
import { DN30 } from '@atlaskit/theme/colors';

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

      <div
        style={{
          backgroundColor: token('elevation.surface', DN30),
        }}
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
    </div>
  );
}
