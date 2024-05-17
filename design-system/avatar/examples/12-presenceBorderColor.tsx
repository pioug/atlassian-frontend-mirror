// eslint-disable-next-line @repo/internal/fs/filename-pattern-match
import React from 'react';

// eslint-disable-next-line no-restricted-imports
import styled from '@emotion/styled';

import { token } from '@atlaskit/tokens';

import { Presence } from '../src';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const Container = styled.div({
  display: 'flex',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const PresenceWrapper = styled.div({
  height: '30px',
  width: '30px',
  marginRight: token('space.100', '8px'),
});

export default () => (
  <div>
    <h3>Custom background color</h3>
    <p>
      By default presences will display a white border. This can be overridden
      with the
      <code>borderColor</code> property.
    </p>
    <p>
      The <code>borderColor</code> property will accept any string that CSS
      border-color can e.g. hex, rgba, transparent, etc.
    </p>
    <Container>
      <PresenceWrapper>
        <Presence presence="online" />
      </PresenceWrapper>

      <PresenceWrapper>
        <Presence
          presence="busy"
          borderColor={token('color.border.discovery')}
        />
      </PresenceWrapper>

      <PresenceWrapper>
        <Presence
          presence="offline"
          borderColor={token('color.border.brand')}
        />
      </PresenceWrapper>

      <PresenceWrapper>
        <Presence presence="focus" borderColor="transparent" />
      </PresenceWrapper>
    </Container>
  </div>
);
