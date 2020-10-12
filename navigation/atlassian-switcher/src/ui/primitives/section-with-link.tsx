import React from 'react';
import { gridSize, typography } from '@atlaskit/theme';
import ShortcutIcon from '@atlaskit/icon/glyph/shortcut';
import styled from 'styled-components';
import {
  analyticsAttributes,
  withAnalyticsContextData,
  NavigationAnalyticsContext,
  getItemAnalyticsContext,
} from '../../common/utils/analytics';
import { FadeIn } from './fade-in';
import { Appearance } from '../theme/types';
import { fontSize } from '@atlaskit/theme/constants';
import { headingSizes } from '@atlaskit/theme/typography';
import { SwitcherItemType } from '../../common/utils/links';
import ItemLink from './item-link';

const SectionContainer = styled.section`
  padding: ${gridSize()}px 0;
`;
SectionContainer.displayName = 'SectionContainer';

const TitleSectionFadeIn = styled(FadeIn)<{ appearance?: Appearance }>`
  display: flex;
  flex-wrap: nowrap;
  align-items: baseline;
  justify-content: flex-end;
  margin-left: ${gridSize()}px;
  position: relative;
  ${({ appearance }) =>
    appearance === 'standalone'
      ? `margin-bottom: 4px;`
      : `margin-bottom: ${gridSize() * 2}px;`};
`;

TitleSectionFadeIn.displayName = 'TitleSectionFadeIn';

const SectionTitle = styled.h1`
  ${typography.h500};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 0;
  flex: 1 1 0%;
`;
SectionTitle.displayName = 'SectionTitle';

const styles = {
  linkButton: {
    '&.section-link': {
      height: `${headingSizes.h500.lineHeight / fontSize()}em`,
      lineHeight: `${headingSizes.h500.lineHeight / fontSize()}em`,
      fontWeight: 400,
    },
  },
};

type SectionProps = {
  sectionId: string;
  title: React.ReactNode;
  titleLink?: SwitcherItemType;
  children?: React.ReactNode;
  appearance?: Appearance;
  actionSubject?: string;
};

type SectionAnalyticsContext = {
  attributes: {
    group: string;
    groupItemsCount: number;
  };
};

const SectionWithLinkItem = (props: SectionProps) => {
  const { title, titleLink, children, appearance, actionSubject } = props;

  return React.Children.toArray(children).some(Boolean) ? (
    <SectionContainer>
      <TitleSectionFadeIn appearance={appearance}>
        {title && <SectionTitle>{title}</SectionTitle>}
        {titleLink && (
          <NavigationAnalyticsContext
            key={titleLink.key}
            data={getItemAnalyticsContext(
              0,
              titleLink.key,
              'product',
              titleLink.href,
              titleLink.productType,
            )}
          >
            <ItemLink
              href={titleLink.href}
              css={styles.linkButton}
              iconAfter={<ShortcutIcon size="small" label="" />}
              label={titleLink.label}
              testId="section-title__link"
              actionSubject={actionSubject}
            />
          </NavigationAnalyticsContext>
        )}
      </TitleSectionFadeIn>
      {children}
    </SectionContainer>
  ) : null;
};

export default withAnalyticsContextData<SectionProps, SectionAnalyticsContext>(
  props =>
    analyticsAttributes({
      group: props.sectionId,
      groupItemsCount: React.Children.count(props.children),
    }),
)(SectionWithLinkItem);
