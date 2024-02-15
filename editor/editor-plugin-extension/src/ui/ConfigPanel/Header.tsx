/** @jsx jsx */
import { Fragment } from 'react';

import { css, jsx } from '@emotion/react';
import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';
import Loadable from 'react-loadable';

import Button from '@atlaskit/button/custom-theme-button';
import type { Icon } from '@atlaskit/editor-common/extensions';
import { configPanelMessages as messages } from '@atlaskit/editor-common/extensions';
import { relativeFontSizeToBase16 } from '@atlaskit/editor-shared-styles';
import CrossIcon from '@atlaskit/icon/glyph/cross';
import { N200 } from '@atlaskit/theme/colors';
import { borderRadius } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

const iconWidth = 40;
const buttonWidth = 40;
const margin = 16;
const gapSizeForEllipsis = iconWidth + buttonWidth + margin * 2;

const itemStyles = css({
  display: 'flex',
  marginBottom: token('space.300', '24px'),
});

const itemIconStyles = css({
  width: iconWidth,
  height: iconWidth,
  overflow: 'hidden',
  border: `1px solid ${token('color.border', 'rgba(223, 225, 229, 0.5)')}`,
  borderRadius: `${borderRadius()}px`,
  boxSizing: 'border-box',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  // eslint-disable-next-line @atlaskit/design-system/no-nested-styles
  div: {
    width: iconWidth,
    height: iconWidth,
  },
});

const itemBodyStyles = css({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'nowrap',
  justifyContent: 'space-between',
  lineHeight: 1.4,
  margin: `0 ${token('space.200', '16px')}`,
  flexGrow: 3,
  maxWidth: `calc(100% - ${gapSizeForEllipsis}px)`,
});

const centeredItemTitleStyles = css({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
});

const itemTextStyles = css({
  maxWidth: '100%',
  whiteSpace: 'initial',
  // eslint-disable-next-line @atlaskit/design-system/no-nested-styles
  itemSummary: {
    fontSize: relativeFontSizeToBase16(11.67),
    color: token('color.text.subtlest', N200),
    marginTop: token('space.050', '4px'),
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
});

const descriptionStyles = css({
  marginBottom: token('space.300', '24px'),
});

const helpLinkStyles = css({
  paddingTop: token('space.150', '12px'),
});

const closeButtonWrapperStyles = css({
  width: buttonWidth,
  textAlign: 'right',
});

type Props = {
  title: string;
  description?: string;
  summary?: string;
  documentationUrl?: string;
  enableHelpCTA?: boolean;
  icon: Icon;
  onClose: () => void;
} & WrappedComponentProps;

type HelpLinkProps = {
  documentationUrl: string;
  label: string;
};

const Header = ({
  icon,
  title,
  description,
  summary,
  documentationUrl,
  enableHelpCTA,
  onClose,
  intl,
}: Props) => {
  const ResolvedIcon = Loadable<{ label: string }, never>({
    loader: icon,
    loading: () => null,
  });

  return (
    <Fragment>
      <div css={itemStyles}>
        <div css={itemIconStyles}>
          <ResolvedIcon label={title} />
        </div>
        <div css={itemBodyStyles}>
          {summary ? (
            <div css={itemTextStyles}>
              <div
                className="item-title"
                id="context-panel-title"
                data-testId="context-panel-title"
              >
                {title}
              </div>
              <div className="item-summary">{summary}</div>
            </div>
          ) : (
            <div
              css={centeredItemTitleStyles}
              id="context-panel-title"
              data-testId="context-panel-title"
            >
              {title}
            </div>
          )}
        </div>
        <div css={closeButtonWrapperStyles}>
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
        <p
          css={descriptionStyles}
          data-testid="config-panel-header-description"
        >
          {description && (
            <Fragment>{description.replace(/([^.])$/, '$1.')} </Fragment>
          )}
          {documentationUrl &&
            (enableHelpCTA ? (
              <p css={helpLinkStyles}>
                <HelpLink
                  documentationUrl={documentationUrl}
                  label={intl.formatMessage(messages.help)}
                />
              </p>
            ) : (
              <HelpLink
                documentationUrl={documentationUrl}
                label={intl.formatMessage(messages.documentation)}
              />
            ))}
        </p>
      )}
    </Fragment>
  );
};

const HelpLink = ({ documentationUrl, label }: HelpLinkProps) => {
  return (
    <a
      target="_blank"
      rel="noopener noreferrer"
      href={documentationUrl}
      data-testid="config-panel-header-documentation-link"
    >
      {label}
    </a>
  );
};

export default injectIntl(Header);
