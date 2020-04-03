import styled from 'styled-components';

import { HTMLAttributes, ComponentClass, ImgHTMLAttributes } from 'react';
import { N300 } from '@atlaskit/theme/colors';

export const Container: ComponentClass<HTMLAttributes<{}>> = styled.div`
  height: 100%;
  overflow-y: scroll;

  padding: 0 28px;
`;
export interface GridCellProps {
  width: number;
}
export const GridCell: ComponentClass<HTMLAttributes<{}> &
  GridCellProps> = styled.div`
  ${({ width }: GridCellProps) => `width: ${width}px;`} margin-top: 5px;
`;

export const Title: ComponentClass<HTMLAttributes<{}>> = styled.div`
  color: #091e42;
  font-size: 20px;
  margin-top: 15px;
`;

export const ButtonContainer: ComponentClass<HTMLAttributes<{}>> = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

export const WarningContainer: ComponentClass<HTMLAttributes<{}>> = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;

  /* Required to allow end users to select text in the error message */
  cursor: auto;
  user-select: text;
`;

export const WarningIconWrapper: ComponentClass<HTMLAttributes<{}>> = styled.div`
  width: 92px;
`;

export const WarningImage: ComponentClass<ImgHTMLAttributes<{}>> = styled.img`
  width: 200px;
`;

export const WarningHeading: ComponentClass<HTMLAttributes<{}>> = styled.p`
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 5px;
`;

export const WarningSuggestion: ComponentClass<HTMLAttributes<{}>> = styled.p`
  color: ${N300};
  font-size: 14px;
  margin-top: 5px;
`;
