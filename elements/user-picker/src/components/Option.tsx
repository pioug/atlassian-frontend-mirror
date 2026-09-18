import React, { type ReactNode } from 'react';

import { Box } from '@atlaskit/primitives/compiled';
import { components } from '@atlaskit/react-select/components';
import type { OptionProps as AkOptionProps } from '@atlaskit/select/types';
import Tooltip from '@atlaskit/tooltip/Tooltip';

import { type Option as OptionType } from '../types';
import AsyncCustomOption from './CustomOption';
import AsyncEmailOption from './EmailOption';
import { isValidEmail } from './emailValidation';
import AsyncExternalOption from './ExternalUserOption';
import AsyncGroupOption from './GroupOption';
import { isCustom } from './isCustom';
import { isEmail } from './isEmail';
import { isExternalUser } from './isExternalUser';
import { isGroup } from './isGroup';
import { isTeam } from './isTeam';
import { isUser } from './isUser';
import AsyncTeamOption from './TeamOption';
import { UserOption } from './UserOption';

export type OptionProps = AkOptionProps & {
	data: OptionType;
	includeTeamsUpdates?: boolean;
	isDisabled: boolean;
	isFocused: boolean;
	isSelected: boolean;
	renderOptionContent?: (defaultContent: ReactNode) => ReactNode;
	selectProps: {
		emailLabel?: string;
	};
	status?: string;
};

const defaultOption = ({ data: { data }, isSelected, status }: OptionProps) => (
	// @ts-expect-error - <UserOption> expects `data` to be of User interface, but data is OptionData interface by default. Check if the `user` props in UserOption should also accept OptionData or refactor this file to accept generics
	<UserOption user={data} status={status} isSelected={isSelected} />
);

const dataOption = ({ data: { data }, isSelected, status, selectProps }: OptionProps) => {
	if (isExternalUser(data)) {
		return <AsyncExternalOption user={data} status={status} isSelected={isSelected} />;
	}

	if (isUser(data)) {
		return <UserOption user={data} status={status} isSelected={isSelected} />;
	}

	if (isEmail(data)) {
		return (
			<AsyncEmailOption
				email={data}
				emailValidity={isValidEmail(data.id)}
				isSelected={isSelected}
				label={selectProps.emailLabel}
			/>
		);
	}

	if (isTeam(data)) {
		return (
			<AsyncTeamOption
				team={data}
				isSelected={isSelected}
				includeTeamsUpdates={data.includeTeamsUpdates}
			/>
		);
	}

	if (isGroup(data)) {
		return (
			<AsyncGroupOption
				group={data}
				isSelected={isSelected}
				includeTeamsUpdates={data.includeTeamsUpdates}
			/>
		);
	}

	if (isCustom(data)) {
		return <AsyncCustomOption data={data} isSelected={isSelected} />;
	}

	return null;
};

const dataOptionWithTooltip = (props: OptionProps) => {
	if (props.data?.data?.tooltip) {
		return (
			<Tooltip content={props.data?.data?.tooltip}>
				{(tooltipProps) => <Box {...tooltipProps}>{dataOption(props)}</Box>}
			</Tooltip>
		);
	}

	return dataOption(props);
};

export const Option = ({ renderOptionContent, ...props }: OptionProps): React.ReactElement => {
	const defaultContent = (
		<React.Suspense fallback={defaultOption(props)}>{dataOptionWithTooltip(props)}</React.Suspense>
	);

	return (
		<components.Option {...(props as AkOptionProps)}>
			{renderOptionContent ? renderOptionContent(defaultContent) : defaultContent}
		</components.Option>
	);
};
