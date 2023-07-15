import React from 'react';

import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from '@af/accessibility-testing';

import InfoIcon from '@atlaskit/icon/glyph/info';
import { B300 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import Flag, { FlagGroup } from '../../index';

expect.extend(toHaveNoViolations);

describe('FlagGroup Accessibility jest-axe', () => {
  const flags = [
    {
      description:
        'Marzipan croissant pie. Jelly beans gingerbread caramels brownie icing.',
      id: '1',
      key: '1',
      title: 'New version published',
      icon: (
        <InfoIcon
          primaryColor={token('color.icon.information', B300)}
          label="Info"
        />
      ),
    },
    {
      description:
        'Scott Farquhar published a new version of this page. Refresh to see the changes.',
      id: '2',
      key: '2',
      title: 'New version published',
      icon: (
        <InfoIcon
          primaryColor={token('color.icon.information', B300)}
          label="Info"
        />
      ),
    },
  ];

  it('FlagGroup should not fail an aXe audit', async () => {
    const { container } = render(
      <FlagGroup>
        {flags.map((flag) => (
          <Flag {...flag} />
        ))}
      </FlagGroup>,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
