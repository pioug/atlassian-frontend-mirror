/** @jsx jsx */
import { Fragment } from 'react';
import { css, jsx } from '@emotion/react';
import { WrappedComponentProps, injectIntl } from 'react-intl-next';
import Loadable from 'react-loadable';

import Button from '@atlaskit/button/custom-theme-button';
import CrossIcon from '@atlaskit/icon/glyph/cross';
import { borderRadius } from '@atlaskit/theme/constants';
import { N200 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
import { Icon } from '@atlaskit/editor-common/extensions';
import { relativeFontSizeToBase16 } from '@atlaskit/editor-shared-styles';

import { messages } from './messages';

const iconWidth = 40;
const buttonWidth = 40;
const margin = 16;
const gapSizeForEllipsis = iconWidth + buttonWidth + margin * 2;

const item = css`
  display: flex;
  margin-bottom: 24px;
`;

const itemIcon = css`
  width: ${iconWidth}px;
  height: ${iconWidth}px;
  overflow: hidden;
  border: 1px solid ${token('color.border', 'rgba(223, 225, 229, 0.5)')}; /* N60 at 50% */
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

const itemBody = css`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  line-height: 1.4;
  margin: 0 16px;
  flex-grow: 3;
  max-width: calc(100% - ${gapSizeForEllipsis}px);
`;

const centeredItemTitle = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const itemText = css`
  max-width: 100%;
  white-space: initial;
  .item-summary {
    font-size: ${relativeFontSizeToBase16(11.67)};
    color: ${token('color.text.subtlest', N200)};
    margin-top: 4px;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const descriptionStyle = css`
  margin-bottom: 24px;
`;

const closeButtonWrapper = css`
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
} & WrappedComponentProps;

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
    <Fragment>
      <div css={item}>
        <div css={itemIcon}>
          <ResolvedIcon label={title} />
        </div>
        <div css={itemBody}>
          {summary ? (
            <div css={itemText}>
              <div className="item-title" id="context-panel-title">
                {title}
              </div>
              <div className="item-summary">{summary}</div>
            </div>
          ) : (
            <div css={centeredItemTitle} id="context-panel-title">
              {title}
            </div>
          )}
        </div>
        <div css={closeButtonWrapper}>
          <Button
            appearance="subtle"
            iconBefore={
              <CrossIcon label={intl.formatMessage(messages.close)} />
            }
            onClick={onClose}
          />
        </div>
      </div>
      {(description || documentationUrl) && (
        <p css={descriptionStyle}>
          {description && (
            <Fragment>{description.replace(/([^.])$/, '$1.')} </Fragment>
          )}
          {documentationUrl && (
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={documentationUrl}
            >
              {intl.formatMessage(messages.documentation)}
            </a>
          )}
        </p>
      )}
    </Fragment>
  );
};

export default injectIntl(Header);
