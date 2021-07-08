import styled from 'styled-components';
import { gridSize } from '@atlaskit/theme/constants';
import { N20 } from '@atlaskit/theme/colors';
import {
  akEditorSmallZIndex,
  relativeFontSizeToBase16,
} from '@atlaskit/editor-shared-styles';

export const InviteTeamWrapper = styled.div`
  background: ${N20};
  border-radius: 50%;
  min-width: ${gridSize() * 4}px;
  margin-left: -${gridSize() / 2}px;
`;

export const AvatarContainer = styled.div`
  margin-right: ${gridSize()}px;
  display: flex;
  align-items: center;

  // ED-13102: This is to override list styles that come from the
  // .wiki-content class in Confluence that should not apply within
  // the toolbar. Has to be extra specific to override.
  && > ul {
    list-style-type: none;
  }

  div:last-child button.invite-to-edit {
    border-radius: 50%;
    height: 32px;
    width: 32px;
    padding: 2px;
  }
`;

export const Badge = styled.div<{ color: string }>`
  display: block;
  position: absolute;
  right: 1px;
  bottom: 1px;
  width: 13px;
  height: 13px;
  z-index: ${akEditorSmallZIndex};
  border-radius: 3px;
  background: ${({ color }) => color};
  color: #fff;
  font-size: ${relativeFontSizeToBase16(9)};
  line-height: 0;
  padding-top: 7px;
  text-align: center;
  box-shadow: 0 0 1px #fff;
  box-sizing: border-box;
`;
