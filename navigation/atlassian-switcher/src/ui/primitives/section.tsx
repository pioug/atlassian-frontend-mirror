import React from 'react';
// AFP-2532 TODO: Fix automatic suppressions below
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { gridSize, typography } from '@atlaskit/theme';
import styled from 'styled-components';
import {
  analyticsAttributes,
  withAnalyticsContextData,
} from '../../common/utils/analytics';
import { FadeIn } from './fade-in';
import { Appearance } from '../theme/types';

const SectionContainer = styled.section`
  padding: ${gridSize()}px 0;
`;
SectionContainer.displayName = 'SectionContainer';

const SectionTitle = styled.h1<{ appearance?: Appearance }>`
  ${typography.h100};
  text-transform: uppercase;
  margin-left: ${gridSize()}px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  ${({ appearance }) =>
    appearance === 'standalone'
      ? `margin-bottom: 4px;`
      : `margin-bottom: ${gridSize()}px;`};
`;
SectionTitle.displayName = 'SectionTitle';

type SectionProps = {
  sectionId: string;
  title: React.ReactNode;
  children?: React.ReactNode;
  appearance?: Appearance;
};

type SectionAnalyticsContext = {
  attributes: {
    group: string;
    groupItemsCount: number;
  };
};

const Section = (props: SectionProps) => {
  const { title, children, appearance, sectionId } = props;

  return React.Children.toArray(children).some(Boolean) ? (
    <SectionContainer data-testid={`${sectionId}__section`}>
      {title && (
        <FadeIn>
          <SectionTitle appearance={appearance}>{title}</SectionTitle>
        </FadeIn>
      )}
      {children}
    </SectionContainer>
  ) : null;
};

export default withAnalyticsContextData<SectionProps, SectionAnalyticsContext>(
  (props) =>
    analyticsAttributes({
      group: props.sectionId,
      groupItemsCount: React.Children.count(props.children),
    }),
)(Section);
