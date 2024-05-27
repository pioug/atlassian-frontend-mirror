import { Box } from '@atlaskit/primitives';
import { components, type OptionProps as AkOptionProps } from '@atlaskit/select';
import Tooltip from '@atlaskit/tooltip';
import React, { type FC } from 'react';
import { type Option as OptionType } from '../types';
import { UserOption } from './UserOption';
import AsyncExternalOption from './ExternalUserOption';
import AsyncTeamOption from './TeamOption';
import AsyncGroupOption from './GroupOption';
import AsyncEmailOption from './EmailOption';
import AsyncCustomOption from './CustomOption';
import {
  isCustom,
  isEmail,
  isTeam,
  isUser,
  isGroup,
  isExternalUser,
} from './utils';
import { isValidEmail } from './emailValidation';

export type OptionProps = AkOptionProps & {
  data: OptionType;
  isSelected: boolean;
  isDisabled: boolean;
  isFocused: boolean;
  status?: string;
  selectProps: {
    emailLabel?: string;
  };
};

const defaultOption = ({ data: { data }, isSelected, status }: OptionProps) => (
  // @ts-expect-error - <UserOption> expects `data` to be of User interface, but data is OptionData interface by default. Check if the `user` props in UserOption should also accept OptionData or refactor this file to accept generics
  <UserOption user={data} status={status} isSelected={isSelected} />
);

const dataOption = ({
  data: { data },
  isSelected,
  status,
  selectProps,
}: OptionProps) => {
  if (isExternalUser(data)) {
    return (
      <AsyncExternalOption
        user={data}
        status={status}
        isSelected={isSelected}
      />
    );
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
    return <AsyncTeamOption team={data} isSelected={isSelected} />;
  }

  if (isGroup(data)) {
    return <AsyncGroupOption group={data} isSelected={isSelected} />;
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

export const Option: FC<OptionProps> = (props) => (
  <components.Option {...(props as AkOptionProps)}>
    <React.Suspense fallback={defaultOption(props)}>
      {dataOptionWithTooltip(props)}
    </React.Suspense>
  </components.Option>
);
