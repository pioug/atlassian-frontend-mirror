import styled from 'styled-components';

import { HTMLAttributes, ComponentClass } from 'react';

export const AvatarPickerViewWrapper: ComponentClass<HTMLAttributes<{}>> = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  min-height: 339px;
`;

export const ModalHeader: ComponentClass<HTMLAttributes<{}>> = styled.div`
  margin: 15px;
  font-weight: 500;
  font-size: 20px;
`;

export const CroppingWrapper: ComponentClass<HTMLAttributes<{}>> = styled.div`
  display: inline-block;
  user-select: none;

  * {
    user-select: none;
  }
`;

export const ModalFooterButtons: ComponentClass<HTMLAttributes<{}>> = styled.div`
  text-align: right;
  width: 100%;

  button:first-child {
    margin-right: 3px;
  }
`;
