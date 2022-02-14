import styled from '@emotion/styled';
import { N900, N100, N30, N500 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

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

export const RowStyle = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  overflow: hidden;
  padding: 6px 14px;
  text-overflow: ellipsis;
  vertical-align: middle;
`;

export const AvatarStyle = styled.span<AvatarSectionStyleProps>`
  position: relative;
  flex: initial;
  opacity: ${(props) => (props.restricted ? '0.5' : 'inherit')};
`;

export const NameSectionStyle = styled.div<NameSectionStyleProps>`
  flex: 1;
  min-width: 0;
  margin-left: 14px;
  opacity: ${(props) => (props.restricted ? '0.5' : 'inherit')};
`;

export const FullNameStyle = styled.span`
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: ${token('color.text', N900)};
`;

export const InfoSectionStyle = styled.div<InfoSectionStyleProps>`
  display: flex;
  flex-direction: column;
  text-align: right;
  opacity: ${(props) => (props.restricted ? '0.5' : 'inherit')};

  & {
    /* Lozenge */
    & > span {
      margin-bottom: 2px;
    }
  }
`;

export const TimeStyle = styled.div`
  margin-left: 20px;
  flex: none;
  color: ${token('color.text.subtlest', N100)};
  font-size: 12px;
`;

export const MENTION_ITEM_HEIGHT = 48;
export const MentionItemStyle = styled.div<MentionItemStyleProps>`
  background-color: ${(props) =>
    props.selected ? token('color.background.brand', N30) : 'transparent'};
  display: block;
  overflow: hidden;
  list-style-type: none;
  height: ${MENTION_ITEM_HEIGHT}px;
  line-height: 1.2;
  cursor: pointer;
`;

export const AccessSectionStyle = styled.div`
  padding-left: 5px;
  color: ${token('color.text.subtle', N500)};
`;
