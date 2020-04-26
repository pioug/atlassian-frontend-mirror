import styled from 'styled-components';
import { B400, N500 } from '@atlaskit/theme/colors';

export interface WrapperProps {
  isActive: boolean;
}

export const Wrapper = styled.li`
  color: ${({ isActive }: WrapperProps) => (isActive ? B400 : N500)};
  padding: 6px 25px;
  list-style-type: none;
  opacity: 1;
  display: flex;
  align-items: center;

  ${({ isActive }: WrapperProps) => (isActive ? '' : 'cursor: pointer')};
  &:hover {
    ${({ isActive }: WrapperProps) =>
      isActive ? '' : 'background-color: #E5E8EC'};
  }
`;

export const ServiceIcon = styled.div`
  display: flex;
  align-items: center;
`;

export const ServiceName = styled.div`
  font-size: 14px;
  position: relative;
  margin-left: 10px;
  top: -1px;
  display: inline-block;
  text-transform: capitalize;
  width: 160px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
