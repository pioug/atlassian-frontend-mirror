import styled from 'styled-components';
// @ts-ignore: unused variable
// prettier-ignore
import { HTMLAttributes, ClassAttributes, ComponentClass } from 'react';
import { N900, N100, N30, N500 } from '@atlaskit/theme/colors';

export interface MentionItemStyleProps {
  selected?: boolean;
}

export interface AvatarSectionStyleProps {
  restricted?: boolean;
}

export interface NameSectionStyleProps {
  restricted?: boolean;
}

export interface InfoSectionStyleProps {
  restricted?: boolean;
}

export const RowStyle: ComponentClass<HTMLAttributes<{}>> = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  overflow: hidden;
  padding: 6px 14px;
  text-overflow: ellipsis;
  vertical-align: middle;
`;

export const AvatarStyle: ComponentClass<
  HTMLAttributes<{}> & AvatarSectionStyleProps
> = styled.span`
  position: relative;
  flex: initial;
  opacity: ${(props: AvatarSectionStyleProps) =>
    props.restricted ? '0.5' : 'inherit'};
`;

export const NameSectionStyle: ComponentClass<
  HTMLAttributes<{}> & NameSectionStyleProps
> = styled.div`
  flex: 1;
  min-width: 0;
  margin-left: 14px;
  opacity: ${(props: NameSectionStyleProps) =>
    props.restricted ? '0.5' : 'inherit'};
`;

export const FullNameStyle: ComponentClass<HTMLAttributes<{}>> = styled.span`
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: ${N900};
`;

export const InfoSectionStyle: ComponentClass<
  HTMLAttributes<{}> & InfoSectionStyleProps
> = styled.div`
  display: flex;
  flex-direction: column;
  text-align: right;
  opacity: ${(props: InfoSectionStyleProps) =>
    props.restricted ? '0.5' : 'inherit'};

  & {
    /* Lozenge */
    & > span {
      margin-bottom: 2px;
    }
  }
`;

export const TimeStyle: ComponentClass<HTMLAttributes<{}>> = styled.div`
  margin-left: 20px;
  flex: none;
  color: ${N100};
  font-size: 12px;
`;

export const MENTION_ITEM_HEIGHT = 48;
export const MentionItemStyle: ComponentClass<
  HTMLAttributes<{}> & MentionItemStyleProps
> = styled.div`
  background-color: ${(props: MentionItemStyleProps) =>
    props.selected ? N30 : 'transparent'};
  display: block;
  overflow: hidden;
  list-style-type: none;
  height: ${MENTION_ITEM_HEIGHT}px;
  line-height: 1.2;
  cursor: pointer;
`;

export const AccessSectionStyle: ComponentClass<HTMLAttributes<{}>> = styled.div`
  padding-left: 5px;
  color: ${N500};
`;
