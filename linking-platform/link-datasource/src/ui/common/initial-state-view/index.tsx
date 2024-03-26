/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { FormattedMessage, MessageDescriptor, useIntl } from 'react-intl-next';

import Lozenge from '@atlaskit/lozenge';
import { N300 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { initialStateViewMessages } from './messages';

const initialStateViewContainerStyles = css({
  display: 'flex',
  justifyContent: 'center',
  height: '100%',
});

const svgAndTextsWrapperStyles = css({
  textAlign: 'center',
  alignSelf: 'center',
  paddingTop: token('space.600', '48px'),
  paddingBottom: token('space.600', '48px'),
});

const betaTagStyles = css({
  display: 'flex',
});

const searchTitleStyles = css({
  color: token('color.text.subtlest', N300),
  font: token(
    'font.heading.medium',
    'normal 500 20px/24px ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, system-ui, "Helvetica Neue", sans-serif',
  ),
  paddingTop: token('space.200', '16px'),
  paddingBottom: token('space.100', '8px'),
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: token('space.100', '8px'),
});

const mainTextStyles = css({
  color: token('color.text.subtlest', N300),
});

const learnMoreLinkStyles = css({
  paddingTop: token('space.200', '16px'),
  display: 'inline-block',
});

interface InitialStateViewProps {
  icon: JSX.Element;
  showBeta?: boolean;
  title: MessageDescriptor;
  description: MessageDescriptor;
  learnMoreLink?: { href: string; text: MessageDescriptor };
}

export const InitialStateView = ({
  icon,
  showBeta = false,
  title,
  description,
  learnMoreLink,
}: InitialStateViewProps) => {
  const { formatMessage } = useIntl();
  return (
    <div
      css={initialStateViewContainerStyles}
      data-testid="datasource-modal--initial-state-view"
    >
      <div css={svgAndTextsWrapperStyles}>
        {icon}
        <div css={searchTitleStyles}>
          {showBeta && (
            <div css={betaTagStyles}>
              <Lozenge appearance="new">
                <FormattedMessage {...initialStateViewMessages.beta} />
              </Lozenge>
            </div>
          )}
          {formatMessage(title)}
        </div>
        <div css={mainTextStyles}>{formatMessage(description)}</div>
        {learnMoreLink && (
          <a
            href={learnMoreLink.href}
            target="_blank"
            css={learnMoreLinkStyles}
          >
            {formatMessage(learnMoreLink.text)}
          </a>
        )}
      </div>
    </div>
  );
};
