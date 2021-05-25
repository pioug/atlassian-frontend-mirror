import React from 'react';
import { injectIntl, InjectedIntlProps } from 'react-intl';

import Header from './Header';

import { HelpLayout } from '../model/HelpLayout';
import { messages } from '../messages';

import {
  Container,
  Section,
  HelpFooter,
  LoadingContainer,
  LoadingRectangle,
} from './styled';

export const HelpContent: React.FC<HelpLayout & InjectedIntlProps> = (
  props,
) => {
  const {
    isLoading = false,
    footer,
    children,
    intl: { formatMessage },
    ...rest
  } = props;
  return (
    <Container>
      <Section>
        <Header {...rest} />
        {isLoading ? (
          <LoadingContainer
            aria-label={formatMessage(messages.help_loading)}
            role="img"
          >
            <LoadingRectangle contentHeight="20px" marginTop="0" />
            <LoadingRectangle contentWidth="90%" />
            <LoadingRectangle contentWidth="80%" />
            <LoadingRectangle contentWidth="80%" />
            <LoadingRectangle contentWidth="80%" />
            <LoadingRectangle contentWidth="80%" />
            <LoadingRectangle contentWidth="80%" />
            <LoadingRectangle contentWidth="80%" />
            <LoadingRectangle contentWidth="80%" />
            <LoadingRectangle contentWidth="70%" />
          </LoadingContainer>
        ) : (
          <>{children}</>
        )}
        {footer ? <HelpFooter>{footer}</HelpFooter> : null}
      </Section>
    </Container>
  );
};

export default injectIntl(HelpContent);
