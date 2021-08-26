import styled from 'styled-components';
// prettier-ignore
import { HTMLAttributes, ComponentClass } from 'react';
import { N30, N300 } from '@atlaskit/theme/colors';

export interface MentionItemStyleProps {
  selected?: boolean;
}

export interface NameSectionStyleProps {
  restricted?: boolean;
}

export const ROW_SIDE_PADDING = 14;
export const RowStyle: ComponentClass<HTMLAttributes<{}>> = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  overflow: hidden;
  padding: 6px ${ROW_SIDE_PADDING}px;
  text-overflow: ellipsis;
  vertical-align: middle;
`;

export const AVATAR_HEIGHT = 36;
export const AvatarStyle: ComponentClass<HTMLAttributes<{}>> = styled.span`
  position: relative;
  flex: initial;
  opacity: inherit;
  width: 36px;
  height: ${AVATAR_HEIGHT}px;

  > span {
    width: 24px;
    height: 24px;
    padding: 6px;
  }
`;

export const NameSectionStyle: ComponentClass<
  HTMLAttributes<{}> & NameSectionStyleProps
> = styled.div`
  flex: 1;
  min-width: 0;
  margin-left: 14px;
  color: ${N300};
  opacity: ${(props: NameSectionStyleProps) =>
    props.restricted ? '0.5' : 'inherit'};
`;

export const MentionItemStyle: ComponentClass<
  HTMLAttributes<{}> & MentionItemStyleProps
> = styled.div`
  background-color: ${(props: MentionItemStyleProps) =>
    props.selected ? N30 : 'transparent'};
  display: block;
  overflow: hidden;
  list-style-type: none;
  cursor: pointer;
`;

export const CapitalizedStyle: ComponentClass<HTMLAttributes<{}>> = styled.span`
  text-transform: capitalize;
`;
