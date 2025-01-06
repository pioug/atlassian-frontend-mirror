// eslint-disable-next-line @repo/internal/fs/filename-pattern-match
import React from 'react';

import Avatar, { type AppearanceType } from '@atlaskit/avatar';
import { token } from '@atlaskit/tokens';

import { Block, Code, Note } from './helpers';

const FullAvatarExample = ({ appearance, src }: { appearance: AppearanceType; src: string }) => (
	<div>
		{/* eslint-disable-next-line @atlaskit/design-system/use-heading */}
		<h2>Default appearance</h2>
		<Note>
			<Code>medium</Code> size - no <Code>presence</Code>, or
			<Code>status</Code>
		</Note>
		{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
		<div style={{ marginTop: token('space.100', '8px') }}>
			<Avatar appearance={appearance} />
		</div>

		{/* eslint-disable-next-line @atlaskit/design-system/use-heading */}
		<h2>Presence</h2>
		{/* eslint-disable-next-line @atlaskit/design-system/use-heading */}
		<h4>Presence Types</h4>
		<Note>
			Supports <Code>busy</Code>, <Code>focus</Code>, <Code>offline</Code>, and
			<Code>online</Code>
		</Note>
		<Block>
			<Avatar appearance={appearance} src={src} size="large" presence="busy" />
			<Avatar appearance={appearance} src={src} size="large" presence="focus" />
			<Avatar appearance={appearance} src={src} size="large" presence="offline" />
			<Avatar appearance={appearance} src={src} size="large" presence="online" />
		</Block>

		{/* eslint-disable-next-line @atlaskit/design-system/use-heading */}
		<h4>All Sizes with Presence</h4>
		<Note>
			Sizes <Code>xsmall</Code> and <Code>xxlarge</Code> do NOT support Presence
		</Note>
		<Block>
			<Avatar appearance={appearance} src={src} size="xxlarge" />
			<Avatar appearance={appearance} src={src} size="xlarge" presence="busy" />
			<Avatar appearance={appearance} src={src} size="large" presence="focus" />
			<Avatar appearance={appearance} src={src} presence="offline" />
			<Avatar appearance={appearance} src={src} size="small" presence="online" />
			<Avatar appearance={appearance} src={src} size="xsmall" />
		</Block>

		{/* eslint-disable-next-line @atlaskit/design-system/use-heading */}
		<h2>Status</h2>
		{/* eslint-disable-next-line @atlaskit/design-system/use-heading */}
		<h4>Status Types</h4>
		<Note>
			Supports <Code>approved</Code>, <Code>declined</Code>, and
			<Code>locked</Code>
		</Note>
		<Block>
			<Avatar appearance={appearance} src={src} size="large" status="approved" />
			<Avatar appearance={appearance} src={src} size="large" status="declined" />
			<Avatar appearance={appearance} src={src} size="large" status="locked" />
		</Block>

		{/* eslint-disable-next-line @atlaskit/design-system/use-heading */}
		<h4>All Sizes with Status</h4>
		<Note>
			Sizes <Code>xsmall</Code> and <Code>xxlarge</Code> do NOT support Status
		</Note>
		<Block>
			<Avatar appearance={appearance} src={src} size="xxlarge" />
			<Avatar appearance={appearance} src={src} size="xlarge" status="approved" />
			<Avatar appearance={appearance} src={src} size="large" status="declined" />
			<Avatar appearance={appearance} src={src} status="locked" />
			<Avatar appearance={appearance} src={src} size="small" status="declined" />
			<Avatar appearance={appearance} src={src} size="xsmall" />
		</Block>
	</div>
);

export default FullAvatarExample;
