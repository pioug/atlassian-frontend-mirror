import React, { ReactElement } from 'react';
import styled from 'styled-components';
import Avatar from '@atlaskit/avatar';
import { ContainerOption } from '../types';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
`;

const Label = styled.div`
  padding-left: 8px;
  padding-bottom: 0px;
`;

const DefaultContainerMenuItem: React.FunctionComponent<ContainerOption> = ({
  label,
  value,
}: ContainerOption): ReactElement => {
  return (
    <Wrapper>
      <Avatar
        size={'small'}
        appearance="square"
        src={value.iconUrl}
        borderColor="transparent"
      />
      <Label>{label}</Label>
    </Wrapper>
  );
};

export default DefaultContainerMenuItem;
