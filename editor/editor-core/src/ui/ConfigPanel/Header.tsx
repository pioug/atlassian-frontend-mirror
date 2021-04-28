import React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import styled from 'styled-components';
import Loadable from 'react-loadable';

import Button from '@atlaskit/button/custom-theme-button';
import CrossIcon from '@atlaskit/icon/glyph/cross';
import { borderRadius } from '@atlaskit/theme/constants';
import { N200 } from '@atlaskit/theme/colors';
import { Icon } from '@atlaskit/editor-common/extensions';
import { relativeFontSizeToBase16 } from '@atlaskit/editor-shared-styles';

import { messages } from './messages';

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

const CenteredItemTitle = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

CenteredItemTitle.displayName = 'CenteredItemTitle';

const ItemText = styled.div`
  max-width: 100%;
  white-space: initial;
  .item-summary {
    font-size: ${relativeFontSizeToBase16(11.67)};
    color: ${N200};
    margin-top: 4px;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

ItemText.displayName = 'ItemText';

const Description = styled.p`
  margin-bottom: 24px;
`;

Description.displayName = 'Description';

const CloseButtonWrapper = styled.div`
  width: ${buttonWidth}px;
  text-align: right;
`;

type Props = {
  title: string;
  description?: string;
  summary?: string;
  documentationUrl?: string;
  icon: Icon;
  onClose: () => void;
} & InjectedIntlProps;

const Header = ({
  icon,
  title,
  description,
  summary,
  documentationUrl,
  onClose,
  intl,
}: Props) => {
  const ResolvedIcon = Loadable<{ label: string }, any>({
    loader: icon,
    loading: () => null,
  });

  return (
    <>
      <Item>
        <ItemIcon>
          <ResolvedIcon label={title} />
        </ItemIcon>
        <ItemBody>
          {summary ? (
            <ItemText>
              <div className="item-title">{title}</div>
              <div className="item-summary">{summary}</div>
            </ItemText>
          ) : (
            <CenteredItemTitle>{title}</CenteredItemTitle>
          )}
        </ItemBody>
        <CloseButtonWrapper>
          <Button
            appearance="subtle"
            iconBefore={
              <CrossIcon label={intl.formatMessage(messages.close)} />
            }
            onClick={onClose}
          />
        </CloseButtonWrapper>
      </Item>
      {(description || documentationUrl) && (
        <Description>
          {description && <>{description.replace(/([^.])$/, '$1.')} </>}
          {documentationUrl && (
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={documentationUrl}
            >
              {intl.formatMessage(messages.documentation)}
            </a>
          )}
        </Description>
      )}
    </>
  );
};

export default injectIntl(Header);
