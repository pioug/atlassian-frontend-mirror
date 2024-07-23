/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { useCallback } from 'react';

import Avatar from '@atlaskit/avatar';
import Button from '@atlaskit/button/standard-button';
import Lozenge, { type ThemeAppearance } from '@atlaskit/lozenge';
import ExpandIcon from '@atlaskit/icon/glyph/hipchat/chevron-down';
import CollapseIcon from '@atlaskit/icon/glyph/hipchat/chevron-up';
import { N50A, N40A } from '@atlaskit/theme/colors';
import { borderRadius } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

import { type ExampleUrl, type ExampleUIConfig, type ExampleRolloutStatus } from './types';
import { ProviderCardExampleList } from './ProviderCardExampleList';

const getWrapperStyles = ({ disabled }: { disabled: boolean }) => {
	const base = css({
		padding: token('space.300', '24px'),
		marginBottom: token('space.300', '24px'),
		boxShadow: token('elevation.shadow.raised', `0 1px 1px ${N50A}, 0 0 1px 1px ${N40A}`),
		width: 'calc(85% - 48px)',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		borderRadius: `${borderRadius()}px`,
		backgroundColor: token('elevation.surface.raised', 'white'),
		cursor: 'pointer',
		transition: '0.3s ease-in-out all',
		'&:hover': {
			backgroundColor: token('color.background.neutral.subtle.hovered', 'rgba(0, 0, 0, 0.03)'),
		},
	});
	const disabledCss = disabled
		? css({
				cursor: 'none',
				opacity: 0.5,
				pointerEvents: 'none',
			})
		: css({});

	return [base, disabledCss];
};

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
		// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
		<div css={getWrapperStyles({ disabled })}>
			<div css={headerStyles}>
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
				<span style={{ display: 'flex', alignItems: 'center' }}>
					<Avatar src={avatarUrl} size="small" />
					<h6
						style={{
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							margin: 0,
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							marginLeft: token('space.100', '8px'),
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							display: 'flex',
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							alignItems: 'center',
						}}
					>
						{resolver}
					</h6>
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
				<Button
					spacing="compact"
					iconBefore={
						expanded ? (
							<CollapseIcon size="small" label="collapse" />
						) : (
							<ExpandIcon size="small" label="expand" />
						)
					}
					onClick={handleClick}
				/>
			</div>
			{expanded ? <ProviderCardExampleList examples={examples} config={config} /> : null}
		</div>
	);
};
