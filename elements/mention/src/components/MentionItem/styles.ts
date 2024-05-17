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

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const RowStyle = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  overflow: hidden;
  padding: ${token('space.075', '6px')} ${token('space.150', '12px')};
  text-overflow: ellipsis;
  vertical-align: middle;
`;

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const AvatarStyle = styled.span<AvatarSectionStyleProps>`
  position: relative;
  flex: initial;
  opacity: ${(props) => (props.restricted ? '0.5' : 'inherit')};
`;

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const NameSectionStyle = styled.div<NameSectionStyleProps>`
  flex: 1;
  min-width: 0;
  margin-left: ${token('space.150', '12px')};
  opacity: ${(props) => (props.restricted ? '0.5' : 'inherit')};
`;

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const FullNameStyle = styled.span`
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: ${token('color.text', N900)};
`;

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const InfoSectionStyle = styled.div<InfoSectionStyleProps>`
  display: flex;
  flex-direction: column;
  text-align: right;
  opacity: ${(props) => (props.restricted ? '0.5' : 'inherit')};

  & {
    /* Lozenge */
    & > span {
      margin-bottom: ${token('space.025', '2px')};
    }
  }
`;

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const TimeStyle = styled.div`
  margin-left: ${token('space.250', '20px')};
  flex: none;
  color: ${token('color.text.subtlest', N100)};
  font-size: 12px;
`;

export const MENTION_ITEM_HEIGHT = 48;
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const MentionItemStyle = styled.div<MentionItemStyleProps>`
  background-color: ${(props) =>
    props.selected ? token('color.background.selected', N30) : 'transparent'};
  display: block;
  overflow: hidden;
  list-style-type: none;
  height: ${MENTION_ITEM_HEIGHT}px;
  line-height: 1.2;
  cursor: pointer;
`;

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const AccessSectionStyle = styled.div`
  padding-left: ${token('space.050', '4px')};
  color: ${token('color.text.subtle', N500)};
`;
