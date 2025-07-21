import React, { type MouseEvent } from 'react';

import Button from '@atlaskit/button';
import { LinkIconButton } from '@atlaskit/button/new';
import QuestionCircleIcon from '@atlaskit/icon/core/question-circle';
import LegacyQuestionIcon from '@atlaskit/icon/glyph/question';
import { fg } from '@atlaskit/platform-feature-flags';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, xcss } from '@atlaskit/primitives';
import { N0 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { SyntaxHelpContainer } from './styled';

// Fixes icon margin issus after new icon migration
const iconStyle = xcss({
	margin: 'space.025',
	display: 'inline-flex',
});

type Props = {
	describedby?: string;
	isDisabled?: boolean;
	label: string;
	onClick: (e: MouseEvent<HTMLElement>) => void;
};

export const BaseSyntaxHelp = ({ describedby, isDisabled, label, onClick }: Props) => {
	return fg('platform-component-visual-refresh') ? (
		<LinkIconButton
			aria-describedby={describedby}
			label={label}
			isDisabled={isDisabled}
			appearance="subtle"
			spacing="compact"
			onClick={onClick}
			target="blank"
			href="https://confluence.atlassian.com/display/SERVICEDESKCLOUD/Advanced+searching"
			icon={(iconProps) => <QuestionCircleIcon {...iconProps} color={token('color.icon.subtle')} />}
		/>
	) : (
		<SyntaxHelpContainer>
			<Button
				aria-describedby={describedby}
				aria-label={label}
				isDisabled={isDisabled}
				appearance={'subtle'}
				spacing={'none'}
				target={'blank'}
				href="https://confluence.atlassian.com/display/SERVICEDESKCLOUD/Advanced+searching"
				iconBefore={
					<Box xcss={iconStyle}>
						<QuestionCircleIcon
							label={''}
							color={
								isDisabled ? token('color.icon.disabled', N0) : token('color.icon.inverse', N0)
							}
							LEGACY_size={'small'}
							LEGACY_fallbackIcon={LegacyQuestionIcon}
							LEGACY_margin="-2px"
						/>
					</Box>
				}
				onClick={onClick}
			/>
		</SyntaxHelpContainer>
	);
};
