import React, { type MouseEvent } from 'react';

import Button from '@atlaskit/button';
import { LinkIconButton } from '@atlaskit/button/new';
import QuestionCircleIcon from '@atlaskit/icon/core/question-circle';
import QuestionIcon from '@atlaskit/icon/glyph/question';
import { fg } from '@atlaskit/platform-feature-flags';
import { N0 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { SyntaxHelpContainer } from './styled';

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
					<QuestionIcon
						label={''}
						primaryColor={
							isDisabled ? token('color.icon.disabled', N0) : token('color.icon.inverse', N0)
						}
						size={'small'}
					/>
				}
				onClick={onClick}
			/>
		</SyntaxHelpContainer>
	);
};
