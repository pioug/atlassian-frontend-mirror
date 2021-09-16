/* eslint-disable react/no-array-index-key */
// eslint-disable-next-line @repo/internal/fs/filename-pattern-match
import React, { CSSProperties } from 'react';

import { B500, N0, N20, N800 } from '@atlaskit/theme/colors';

import { avatarUrl } from '../examples-util/data';
import { Code, Note } from '../examples-util/helpers';
import nucleusImage from '../examples-util/nucleus.png';
import Avatar, { AppearanceType, PresenceType, StatusType } from '../src';

// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
const exampleColors = [N800, B500, N20, N0];

const presences: PresenceType[] = ['focus', 'online', 'offline', 'busy'];
const statuses: StatusType[] = ['approved', 'locked', 'declined'];

const styles: Record<string, CSSProperties> = {
  column: {
    alignItems: 'center',
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    padding: '0.5em 1em',
  },
  row: {
    alignItems: 'stretch',
    display: 'flex',
    height: 192,
    justifyContent: 'stretch',
    marginTop: '1em',
  },
};

interface ColorColumn {
  borderColor: string;
  src: string;
  presence?: PresenceType;
  appearance?: AppearanceType;
  status?: StatusType;
}

const ColorColumn = (props: ColorColumn) => (
  <div style={{ ...styles.column, backgroundColor: props.borderColor }}>
    <Avatar onClick={console.log} {...props} size="xlarge" />
    <Avatar onClick={console.log} {...props} />
  </div>
);

export default () => (
  <div>
    <h2>Coloured Backgrounds</h2>
    <Note>
      <p>
        The <Code>borderColor</Code> is consumed by <Code>{'<Avatar/>'}</Code>{' '}
        and passed on to <Code>{'<Presence/>'}</Code>
        and <Code>{'<Status/>'}</Code>
      </p>
      <p>
        Try clicking/tabbing on the avatars to see how the focus ring interacts
        with the background color.
      </p>
    </Note>
    <div style={styles.row}>
      {exampleColors.map((color: string, index: number) => (
        <ColorColumn
          key={index}
          borderColor={color}
          src={avatarUrl}
          presence={presences[index]}
        />
      ))}
    </div>
    <div style={styles.row}>
      {exampleColors.map((color: string, index: number) => (
        <ColorColumn
          key={index}
          borderColor={color}
          src={nucleusImage}
          appearance="square"
          status={statuses[index]}
        />
      ))}
    </div>
  </div>
);
