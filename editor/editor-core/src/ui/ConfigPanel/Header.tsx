import React from 'react';
import styled from 'styled-components';
import Loadable from 'react-loadable';

import Button from '@atlaskit/button';
import CrossIcon from '@atlaskit/icon/glyph/cross';
import { colors, borderRadius } from '@atlaskit/theme';
import { Icon } from '@atlaskit/editor-common/extensions';

const iconWidth = 40;
const buttonWidth = 40;
const margin = 16;
const gapSizeForEllipsis = iconWidth + buttonWidth + margin * 2;

const Item = styled.div`
  display: flex;
  margin-bottom: 24px;
`;

const ItemIcon = styled.div`
  width: ${iconWidth}px;
  height: ${iconWidth}px;
  overflow: hidden;
  border: 1px solid rgba(223, 225, 229, 0.5); /* N60 at 50% */
  border-radius: ${borderRadius()}px;
  box-sizing: border-box;

  display: flex;
  justify-content: center;
  align-items: center;

  div {
    width: ${iconWidth}px;
    height: ${iconWidth}px;
  }
`;

const ItemBody = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  line-height: 1.4;
  margin: 0 16px;
  flex-grow: 3;
  max-width: calc(100% - ${gapSizeForEllipsis}px);
`;

const ItemText = styled.div`
  max-width: 100%;
  white-space: initial;
  .item-description {
    font-size: 11.67px;
    color: ${colors.N200};
    margin-top: 4px;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const CloseButtonWrapper = styled.div`
  width: ${buttonWidth}px;
  text-align: right;
`;

type Props = {
  title: string;
  description: string;
  icon: Icon;
  onClose: () => void;
};

const Header = ({ icon, title, description, onClose }: Props) => {
  const ResolvedIcon = Loadable<{ label: string }, any>({
    loader: icon,
    loading: () => null,
  });

  return (
    <Item>
      <ItemIcon>
        <ResolvedIcon label={title} />
      </ItemIcon>
      <ItemBody>
        <ItemText>
          <div className="item-title">{title}</div>
          {description && <div className="item-description">{description}</div>}
        </ItemText>
      </ItemBody>
      <CloseButtonWrapper>
        <Button
          appearance="subtle"
          iconBefore={<CrossIcon label="" />}
          onClick={onClose}
        />
      </CloseButtonWrapper>
    </Item>
  );
};

export default Header;
