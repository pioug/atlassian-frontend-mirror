import React, { type FC, useState } from 'react';

import { AVATAR_SIZES } from '@atlaskit/avatar';
import AvatarGroup, { type AvatarGroupProps } from '@atlaskit/avatar-group';
import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/new';
import { Label } from '@atlaskit/form';
import ArrowDown from '@atlaskit/icon/glyph/arrow-down';
import ArrowUp from '@atlaskit/icon/glyph/arrow-up';
import Toggle from '@atlaskit/toggle';

import { Code, Note } from '../examples-util/helpers';

type State = {
	avatarCount: number;
	avatarCountMax: number;
	gridWidth: number;
	mode: 'stack' | 'grid';
	sizeIndex: number;
	isTooltipsDisabled: boolean;
};

const AvatarGroupExample: FC = () => {
	const [state, setState] = useState<State>({
		avatarCount: 20,
		avatarCountMax: 11,
		gridWidth: 220,
		mode: 'stack',
		sizeIndex: 2,
		isTooltipsDisabled: false,
	});

	const decrement = (key: keyof Omit<State, 'mode' | 'isTooltipsDisabled'>) => {
		setState({
			...state,
			[key]: state[key] - 1,
		});
	};

	const increment = (key: keyof Omit<State, 'mode' | 'isTooltipsDisabled'>) => {
		setState({
			...state,
			[key]: state[key] + 1,
		});
	};

	const toggleTooltips = () => {
		setState({
			...state,
			isTooltipsDisabled: !state.isTooltipsDisabled,
		});
	};

	const { avatarCount, avatarCountMax, gridWidth, mode, sizeIndex } = state;
	const sizes = Object.keys(AVATAR_SIZES).filter(
		(size) => size !== 'xsmall',
	) as AvatarGroupProps['size'][];
	const avatarSize = sizes[sizeIndex];
	const stackSourceURLs = [];
	// eslint-disable-next-line no-plusplus
	for (let i = 0; i < avatarCount; i++) {
		stackSourceURLs.push(i);
	}

	return (
		<div>
			<Note size="large">
				Click the excess indicator to see the remaining avatars in a dropdown menu.
			</Note>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
			<div style={{ display: 'flex', marginTop: '1em' }}>
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
				<div style={{ flex: 1 }}>
					{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
					<h2 id="avatar-size" style={{ marginBottom: '0.5em' }}>
						Avatar Size: {avatarSize}
					</h2>
					<ButtonGroup titleId="avatar-size">
						<Button
							isDisabled={avatarSize === 'small'}
							onClick={() => decrement('sizeIndex')}
							iconBefore={(iconProps) => <ArrowDown {...iconProps} size="small" />}
						>
							Smaller
						</Button>
						<Button
							isDisabled={avatarSize === 'xlarge'}
							onClick={() => increment('sizeIndex')}
							iconBefore={(iconProps) => <ArrowUp {...iconProps} size="small" />}
						>
							Larger
						</Button>
					</ButtonGroup>
				</div>
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
				<div style={{ flex: 1 }}>
					{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
					<h2 id="avatar-count" style={{ marginBottom: '0.5em' }}>
						Avatar Count: {avatarCount}
					</h2>
					<ButtonGroup titleId="avatar-count">
						<Button
							isDisabled={avatarCount <= 1}
							onClick={() => decrement('avatarCount')}
							iconBefore={(iconProps) => <ArrowDown {...iconProps} size="small" />}
						>
							Less
						</Button>
						<Button
							isDisabled={avatarCount >= 30}
							onClick={() => increment('avatarCount')}
							iconBefore={(iconProps) => <ArrowUp {...iconProps} size="small" />}
						>
							More
						</Button>
					</ButtonGroup>
				</div>
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
				<div style={{ flex: 1 }}>
					{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
					<h2 id="grid-max" style={{ marginBottom: '0.5em' }}>
						Grid Max: {avatarCountMax}
					</h2>
					<ButtonGroup titleId="grid-max">
						<Button
							isDisabled={avatarCountMax <= 1}
							onClick={() => decrement('avatarCountMax')}
							iconBefore={(iconProps) => <ArrowDown {...iconProps} size="small" />}
						>
							Less
						</Button>
						<Button
							isDisabled={avatarCountMax >= 30}
							onClick={() => increment('avatarCountMax')}
							iconBefore={(iconProps) => <ArrowUp {...iconProps} size="small" />}
						>
							More
						</Button>
					</ButtonGroup>
				</div>
			</div>
			<h2>Grid</h2>
			<Note>
				Total {stackSourceURLs.length} / Max {avatarCountMax}
			</Note>
			<label htmlFor="grid-width">Grid Width</label>
			<input
				id="grid-width"
				min="200"
				max="500"
				onChange={(e) => setState({ ...state, gridWidth: parseInt(e.target.value, 10) })}
				step="10"
				type="range"
				value={gridWidth}
			/>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
			<div style={{ maxWidth: gridWidth, position: 'relative' }}>
				<AvatarGroup
					appearance="grid"
					onAvatarClick={console.log}
					data={stackSourceURLs.map((i) => ({
						key: i,
						appearance: 'circle',
						href: '#',
						name: `Grid Avatar ${i + 1}`,
						size: avatarSize,
						onClick: (e) => console.log(e),
					}))}
					maxCount={avatarCountMax}
					size={avatarSize}
					testId="grid"
				/>
				<span
					style={{
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						borderLeft: '1px solid #ccc',
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						paddingLeft: '1em',
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						fontSize: 11,
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						position: 'absolute',
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						right: 0,
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						top: 0,

						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						color: '#999',
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						transform: 'translateX(100%)',
					}}
				>
					{gridWidth}px
				</span>
			</div>
			<h2>Stack</h2>
			<Note>Total {stackSourceURLs.length} / Max 5</Note>
			<AvatarGroup
				onAvatarClick={console.log}
				data={stackSourceURLs.map((i) => ({
					key: i,
					href: '#',
					name: `Stack Avatar ${i + 1}`,
					size: avatarSize,
					appearance: 'circle',
				}))}
				size={avatarSize}
			/>

			<h2>On {'"More"'} Click</h2>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
			<div style={{ maxWidth: 380 }}>
				<Note>
					Circumvent the default dropdown menu behaviour by passing <Code>onMoreClick</Code> to{' '}
					<Code>{'<AvatarGroup />'}</Code> and handle the event however you want.
				</Note>
				<AvatarGroup
					onMoreClick={() => setState({ ...state, mode: 'grid' })}
					appearance={mode}
					maxCount={mode === 'grid' ? avatarCount : undefined}
					data={stackSourceURLs.map((i) => ({
						key: i,
						href: '#',
						name: `Stack Avatar ${i + 1}`,
						size: avatarSize,
						appearance: 'circle',
					}))}
					size={avatarSize}
				/>
				{mode === 'grid' ? (
					<button type="button" onClick={() => setState({ ...state, mode: 'stack' })}>
						reset
					</button>
				) : null}
			</div>

			<h2>Removed from tab order</h2>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
			<div style={{ maxWidth: 380 }}>
				<Note>
					Prevent tabbing to elements in the avatar group by passing <Code>tabIndex</Code> via the{' '}
					<Code>showMoreButtonProps</Code> and <Code>data</Code> props.
				</Note>
				<AvatarGroup
					appearance="stack"
					maxCount={5}
					data={stackSourceURLs.map((i) => ({
						appearance: 'circle',
						href: '#',
						key: i,
						name: `Stack Avatar ${i + 1}`,
						size: avatarSize,
						tabIndex: -1,
					}))}
					size={avatarSize}
					showMoreButtonProps={{ tabIndex: -1 }}
				/>
			</div>

			<h2>Constrained by the scroll parent</h2>
			<div>
				<p>Expand and scroll up to reposition the avatar group menu</p>
				<div
					style={{
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						border: '1px solid black',
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						height: '200px',
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						width: '300px',
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						overflow: 'scroll',
					}}
				>
					{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
					<div style={{ width: '300px', height: '600px', paddingTop: '200px' }}>
						<AvatarGroup
							boundariesElement="scrollParent"
							onAvatarClick={console.log}
							data={stackSourceURLs.slice(0, 6).map((i) => ({
								href: '#',
								key: i,
								name: `Stack Avatar ${i + 1}`,
								size: avatarSize,
								appearance: 'circle',
							}))}
						/>
					</div>
				</div>
			</div>

			<h2>Non-interactive</h2>
			<div>
				<Label htmlFor="tooltips">Enable tooltips</Label>
				<Toggle id="tooltips" isChecked={!state.isTooltipsDisabled} onChange={toggleTooltips} />
				<AvatarGroup
					data={stackSourceURLs.map((i) => ({
						key: i,
						name: `Stack Avatar ${i + 1}`,
						size: avatarSize,
						appearance: 'circle',
					}))}
					isTooltipDisabled={state.isTooltipsDisabled}
					size={avatarSize}
				/>
			</div>
		</div>
	);
};

export default AvatarGroupExample;
