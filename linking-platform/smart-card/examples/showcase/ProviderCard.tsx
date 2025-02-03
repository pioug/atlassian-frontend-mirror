/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useCallback } from 'react';

import { css, jsx } from '@compiled/react';

import Avatar from '@atlaskit/avatar';
import { IconButton } from '@atlaskit/button/new';
import ExpandIconLegacy from '@atlaskit/icon/glyph/hipchat/chevron-down';
import CollapseIconLegacy from '@atlaskit/icon/glyph/hipchat/chevron-up';
import ExpandIcon from '@atlaskit/icon/utility/chevron-down';
import CollapseIcon from '@atlaskit/icon/utility/chevron-up';
import Lozenge, { type ThemeAppearance } from '@atlaskit/lozenge';
import { N40A, N50A } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { ProviderCardExampleList } from './ProviderCardExampleList';
import { type ExampleRolloutStatus, type ExampleUIConfig, type ExampleUrl } from './types';

const base = css({
	paddingTop: token('space.300', '24px'),
	paddingRight: token('space.300', '24px'),
	paddingBottom: token('space.300', '24px'),
	paddingLeft: token('space.300', '24px'),
	marginBottom: token('space.300', '24px'),
	boxShadow: token('elevation.shadow.raised', `0 1px 1px ${N50A}, 0 0 1px 1px ${N40A}`),
	width: 'calc(85% - 48px)',
	borderRadius: token('border.radius', '3px'),
	backgroundColor: token('elevation.surface.raised', 'white'),
	cursor: 'pointer',
	transition: '0.3s ease-in-out all',
	'&:hover': {
		backgroundColor: token('color.background.neutral.subtle.hovered', 'rgba(0, 0, 0, 0.03)'),
	},
});

const disabledCss = css({
	cursor: 'none',
	opacity: 0.5,
	pointerEvents: 'none',
});

const headerStyles = css({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'space-between',
});

const lozengeWrapperStyles = css({
	margin: 0,
	marginLeft: token('space.100', '8px'),
	display: 'flex',
	alignItems: 'center',
});

const tierToAppearanceMapping: Record<number, ThemeAppearance> = {
	1: 'success',
	2: 'inprogress',
	3: 'moved',
	4: 'removed',
};
const rolloutStatusToAppearanceMapping: Record<ExampleRolloutStatus, ThemeAppearance> = {
	'not-started': 'inprogress',
	'rolling-out': 'inprogress',
	'rolled-out': 'success',
};
const rolloutStatusToTextMapping = ({ status, percentage }: ExampleUrl['rollout']): string => {
	switch (status) {
		case 'not-started':
			return 'soaking';
		case 'rolling-out':
			return 'rolling-out ' + percentage + '%';
		case 'rolled-out':
			return 'rolled-out';
	}
};

const spanStyle = css({
	display: 'flex',
	alignItems: 'center',
});

const headerStyle = css({
	margin: 0,
	marginLeft: token('space.100', '8px'),
	display: 'flex',
	alignItems: 'center',
});

interface ProviderCardProps extends ExampleUrl {
	onExpand: (resolver: string) => void;
	onCollapse: (resolver: string) => void;
	expanded: boolean;
	config: ExampleUIConfig;
}

export const ProviderCard = ({
	resolver,
	examples,
	avatarUrl,
	reliability,
	rollout,
	expanded,
	onCollapse,
	onExpand,
	config,
}: ProviderCardProps) => {
	const handleClick = useCallback(() => {
		if (expanded) {
			onCollapse(resolver);
		} else {
			onExpand(resolver);
		}
	}, [expanded, resolver, onCollapse, onExpand]);
	const disabled = !(
		config.selectedEntities.length === 0 ||
		examples.some((example) => config.selectedEntities.includes(example.displayName))
	);

	return (
		<div css={[base, disabled && disabledCss]}>
			<div css={headerStyles}>
				<span css={spanStyle}>
					<Avatar src={avatarUrl} size="small" />
					<h6 css={headerStyle}>{resolver}</h6>
					{reliability?.tier ? (
						<span css={lozengeWrapperStyles}>
							<Lozenge appearance={tierToAppearanceMapping[reliability.tier]}>
								tier {reliability.tier}
							</Lozenge>
						</span>
					) : null}
					{rollout?.status ? (
						<span css={lozengeWrapperStyles}>
							<Lozenge appearance={rolloutStatusToAppearanceMapping[rollout.status]}>
								{rolloutStatusToTextMapping(rollout)}
							</Lozenge>
						</span>
					) : null}
				</span>
				<IconButton
					spacing="compact"
					onClick={handleClick}
					icon={(props) =>
						expanded ? (
							<CollapseIcon
								{...props}
								LEGACY_size="small"
								label="collapse"
								LEGACY_fallbackIcon={CollapseIconLegacy}
							/>
						) : (
							<ExpandIcon
								{...props}
								LEGACY_size="small"
								label="expand"
								LEGACY_fallbackIcon={ExpandIconLegacy}
							/>
						)
					}
					label={''}
				/>
			</div>
			{expanded ? <ProviderCardExampleList examples={examples} config={config} /> : null}
		</div>
	);
};
