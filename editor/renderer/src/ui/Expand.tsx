/** @jsx jsx */
import React, { useRef, useCallback, useMemo } from 'react';
import { css, jsx } from '@emotion/react';
import { gridSize, fontSize } from '@atlaskit/theme/constants';
import { ThemeProps } from '@atlaskit/theme/types';
import ChevronRightIcon from '@atlaskit/icon/glyph/chevron-right';
import Tooltip from '@atlaskit/tooltip';
import {
  expandMessages,
  sharedExpandStyles,
  WidthProvider,
  ExpandIconWrapper,
  clearNextSiblingMarginTopStyle,
  ExpandLayoutWrapperWithRef,
} from '@atlaskit/editor-common/ui';
import {
  akEditorLineHeight,
  relativeFontSizeToBase16,
} from '@atlaskit/editor-shared-styles';
import { AnalyticsEventPayload, PLATFORM, MODE } from '../analytics/events';
import {
  ACTION,
  ACTION_SUBJECT,
  EVENT_TYPE,
} from '@atlaskit/editor-common/analytics';
import { injectIntl, WrappedComponentProps } from 'react-intl-next';
import { ActiveHeaderIdConsumer } from './active-header-id-provider';
import _uniqueId from 'lodash/uniqueId';
import { getPlatform } from '../utils';
import { RendererAppearance } from './Renderer/types';

export type StyleProps = {
  expanded?: boolean;
  focused?: boolean;
  'data-node-type'?: 'expand' | 'nestedExpand';
  'data-title'?: string;
};

const titleStyles = css`
  outline: none;
  border: none;
  font-size: ${relativeFontSizeToBase16(fontSize())};
  line-height: ${akEditorLineHeight};
  font-weight: normal;
  display: flex;
  flex: 1;
  margin: 0;
  padding: 0 0 0 ${gridSize() / 2}px;
  text-align: left;
`;

const Container: React.FC<StyleProps> = (props) => {
  const paddingBottom = `${props.expanded ? gridSize() : 0}px`;
  const sharedContainerStyles = sharedExpandStyles.containerStyles(props);

  const styles = (themeProps: ThemeProps) => css`
    ${sharedContainerStyles({ theme: themeProps })}
    padding: 0;
    padding-bottom: ${paddingBottom};
  `;

  return (
    <div css={styles} {...props}>
      {props.children}
    </div>
  );
};

const TitleContainer: React.FC<
  StyleProps & React.ButtonHTMLAttributes<HTMLButtonElement>
> = (props) => {
  const paddingBottom = `${!props.expanded ? gridSize() : 0}px`;

  const styles = (themeProps: ThemeProps) => css`
    ${sharedExpandStyles.titleContainerStyles({ theme: themeProps })}
    padding: ${gridSize()}px;
    padding-bottom: ${paddingBottom};
  `;

  return (
    <button css={styles} {...props}>
      {props.children}
    </button>
  );
};

TitleContainer.displayName = 'TitleContainerButton';

const ContentContainer: React.FC<StyleProps> = (props) => {
  const sharedContentStyles = sharedExpandStyles.contentStyles(props);
  const visibility = props.expanded ? 'visible' : 'hidden';

  const styles = (themeProps: ThemeProps) => css`
    ${sharedContentStyles({ theme: themeProps })};
    padding-right: ${gridSize() * 2}px;
    padding-left: ${gridSize() * 5 - gridSize() / 2}px;
    visibility: ${visibility};
  `;

  return (
    <div css={styles} {...props}>
      {props.children}
    </div>
  );
};

export interface ExpandProps {
  title: string;
  nodeType: 'expand' | 'nestedExpand';
  children: React.ReactNode;
  fireAnalyticsEvent?: (event: AnalyticsEventPayload) => void;
  nestedHeaderIds?: Array<string>;
  rendererAppearance?: RendererAppearance;
}

function fireExpandToggleAnalytics(
  nodeType: ExpandProps['nodeType'],
  expanded: boolean,
  fireAnalyticsEvent: ExpandProps['fireAnalyticsEvent'],
) {
  if (!fireAnalyticsEvent) {
    return;
  }

  fireAnalyticsEvent({
    action: ACTION.TOGGLE_EXPAND,
    actionSubject:
      nodeType === 'expand'
        ? ACTION_SUBJECT.EXPAND
        : ACTION_SUBJECT.NESTED_EXPAND,
    attributes: {
      platform: PLATFORM.WEB,
      mode: MODE.RENDERER,
      expanded: !expanded,
    },
    eventType: EVENT_TYPE.TRACK,
  });
}

function Expand({
  title,
  children,
  nodeType,
  intl,
  fireAnalyticsEvent,
  nestedHeaderIds,
  rendererAppearance,
}: ExpandProps & WrappedComponentProps) {
  const [expanded, setExpanded] = React.useState(false);
  const [focused, setFocused] = React.useState(false);

  const isMobile = useMemo(
    () => getPlatform(rendererAppearance) === 'mobile',
    [rendererAppearance],
  );
  const label = intl.formatMessage(
    expanded ? expandMessages.collapseNode : expandMessages.expandNode,
  );
  const { current: id } = useRef(_uniqueId('expand-title-'));

  const handleFocus = useCallback(() => setFocused(true), []);
  const handleBlur = useCallback(() => setFocused(false), []);

  return (
    <Container
      data-node-type={nodeType}
      data-title={title}
      data-expanded={expanded}
      expanded={expanded}
      focused={focused}
    >
      {nestedHeaderIds && nestedHeaderIds.length > 0 ? (
        <ActiveHeaderIdConsumer
          nestedHeaderIds={nestedHeaderIds}
          onNestedHeaderIdMatch={() => setExpanded(true)}
        />
      ) : null}
      <TitleContainer
        onClick={(e: React.SyntheticEvent) => {
          e.stopPropagation();
          fireExpandToggleAnalytics(nodeType, expanded, fireAnalyticsEvent);
          setExpanded(!expanded);
          e.persist();
          // @ts-ignore detail doesn't exist on type
          e.detail ? handleBlur() : handleFocus();
        }}
        onFocus={handleFocus}
        onBlur={handleBlur}
        aria-labelledby={id}
        aria-expanded={expanded}
        contentEditable={false}
        expanded={expanded}
      >
        {isMobile ? (
          <ExpandIconWrapper expanded={expanded}>
            <ChevronRightIcon label={label} />
          </ExpandIconWrapper>
        ) : (
          <Tooltip
            content={label}
            position="top"
            tag={ExpandLayoutWrapperWithRef}
            testId={'tooltip'}
          >
            <ExpandIconWrapper expanded={expanded}>
              <ChevronRightIcon label={label} />
            </ExpandIconWrapper>
          </Tooltip>
        )}
        <span css={titleStyles} id={id}>
          {title || intl.formatMessage(expandMessages.expandDefaultTitle)}
        </span>
      </TitleContainer>
      <ContentContainer expanded={expanded}>
        <div className={`${nodeType}-content-wrapper`}>
          <WidthProvider>
            <div css={clearNextSiblingMarginTopStyle} />
            {children}
          </WidthProvider>
        </div>
      </ContentContainer>
    </Container>
  );
}

export default injectIntl(Expand);
