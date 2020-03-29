import React from 'react';
import { gridSize } from '@atlaskit/theme';
import Avatar from '../src';
import { Block, Code, Note } from './helpers';
import { AppearanceType } from '../src/types';

export default ({
  appearance,
  src,
}: {
  appearance: AppearanceType;
  src: string;
}) => (
  <div>
    <h2>Default appearance</h2>
    <Note>
      <Code>medium</Code> size - no <Code>presence</Code>, or
      <Code>status</Code>
    </Note>
    <div style={{ marginTop: gridSize() }}>
      <Avatar appearance={appearance} />
    </div>

    <h2>Presence</h2>
    <h4>Presence Types</h4>
    <Note>
      Supports <Code>busy</Code>, <Code>focus</Code>, <Code>offline</Code>, and
      <Code>online</Code>
    </Note>
    <Block>
      <Avatar appearance={appearance} src={src} size="large" presence="busy" />
      <Avatar appearance={appearance} src={src} size="large" presence="focus" />
      <Avatar
        appearance={appearance}
        src={src}
        size="large"
        presence="offline"
      />
      <Avatar
        appearance={appearance}
        src={src}
        size="large"
        presence="online"
      />
    </Block>

    <h4>All Sizes with Presence</h4>
    <Note>
      Sizes <Code>xsmall</Code> and <Code>xxlarge</Code> do NOT support Presence
    </Note>
    <Block>
      <Avatar appearance={appearance} src={src} size="xxlarge" />
      <Avatar appearance={appearance} src={src} size="xlarge" presence="busy" />
      <Avatar appearance={appearance} src={src} size="large" presence="focus" />
      <Avatar appearance={appearance} src={src} presence="offline" />
      <Avatar
        appearance={appearance}
        src={src}
        size="small"
        presence="online"
      />
      <Avatar appearance={appearance} src={src} size="xsmall" />
    </Block>

    <h2>Status</h2>
    <h4>Status Types</h4>
    <Note>
      Supports <Code>approved</Code>, <Code>declined</Code>, and
      <Code>locked</Code>
    </Note>
    <Block>
      <Avatar
        appearance={appearance}
        src={src}
        size="large"
        status="approved"
      />
      <Avatar
        appearance={appearance}
        src={src}
        size="large"
        status="declined"
      />
      <Avatar appearance={appearance} src={src} size="large" status="locked" />
    </Block>

    <h4>All Sizes with Status</h4>
    <Note>
      Sizes <Code>xsmall</Code> and <Code>xxlarge</Code> do NOT support Status
    </Note>
    <Block>
      <Avatar appearance={appearance} src={src} size="xxlarge" />
      <Avatar
        appearance={appearance}
        src={src}
        size="xlarge"
        status="approved"
      />
      <Avatar
        appearance={appearance}
        src={src}
        size="large"
        status="declined"
      />
      <Avatar appearance={appearance} src={src} status="locked" />
      <Avatar
        appearance={appearance}
        src={src}
        size="small"
        status="declined"
      />
      <Avatar appearance={appearance} src={src} size="xsmall" />
    </Block>
  </div>
);
