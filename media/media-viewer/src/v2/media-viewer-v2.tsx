import React, { useState, useLayoutEffect, useRef } from 'react';
import { type SyntheticEvent } from 'react';
import { type Identifier } from '@atlaskit/media-client';
import { type MediaFeatureFlags } from '@atlaskit/media-common';
import {
  IntlProvider,
  injectIntl,
  type WrappedComponentProps,
} from 'react-intl-next';
import { Shortcut } from '@atlaskit/media-ui';
import { type UIAnalyticsEvent, useAnalyticsEvents } from '@atlaskit/analytics-next';
import { fireAnalytics } from '../analytics';
import { createModalEvent } from '../analytics/events/screen/modal';
import { createClosedEvent } from '../analytics/events/ui/closed';
import { ListV2 } from './list-v2';
import { Content } from '../content';
import { Blanket, SidebarWrapper } from '../styleWrappers';
import { start } from 'perf-marks';
import { type MediaViewerExtensions } from '../components/types';
import { mediaViewerPopupClass } from '../classnames';
import ScrollLock from 'react-scrolllock';
import FocusLock from 'react-focus-lock';

export type Props = {
  onClose?: () => void;
  selectedItem?: Identifier;
  featureFlags?: MediaFeatureFlags;
  items: Identifier[];
  extensions?: MediaViewerExtensions;
  contextId?: string;
  innerRef?: React.Ref<HTMLDivElement>;
};

const MediaViewerComponent = ({
  featureFlags,
  items,
  extensions,
  contextId,
  innerRef,
  onClose,
  selectedItem,
  intl,
}: Props & WrappedComponentProps) => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [selectedIdentifier, setSelectedIdentifier] = useState<Identifier>();
  const { createAnalyticsEvent } = useAnalyticsEvents();
  const createAnalyticsEventRef = useRef(createAnalyticsEvent);
  createAnalyticsEventRef.current = createAnalyticsEvent;

  useLayoutEffect(() => {
    fireAnalytics(createModalEvent(), createAnalyticsEventRef.current);
    start('MediaViewer.SessionDuration');
  }, []);

  const defaultSelectedItem: Identifier | undefined = selectedItem || items[0];

  const renderSidebar = () => {
    const sidebarSelectedIdentifier = selectedIdentifier || defaultSelectedItem;

    if (
      sidebarSelectedIdentifier &&
      isSidebarVisible &&
      extensions &&
      extensions.sidebar
    ) {
      return (
        <SidebarWrapper data-testid="media-viewer-sidebar-content">
          {extensions.sidebar.renderer(sidebarSelectedIdentifier, {
            close: () => setIsSidebarVisible(!isSidebarVisible),
          })}
        </SidebarWrapper>
      );
    }
  };

  const content = (
    <div ref={innerRef}>
      <Blanket
        data-testid="media-viewer-popup"
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
        className={mediaViewerPopupClass}
      >
        <Shortcut
          code={'Escape'}
          handler={() => {
            fireAnalytics(
              createClosedEvent('escKey'),
              createAnalyticsEventRef.current,
            );
            onClose && onClose();
          }}
        />
        <Content
          isSidebarVisible={isSidebarVisible}
          onClose={(_e?: SyntheticEvent, analyticsEvent?: UIAnalyticsEvent) => {
            if (analyticsEvent?.payload?.actionSubject === 'button') {
              fireAnalytics(
                createClosedEvent('button'),
                createAnalyticsEventRef.current,
              );
            }
            onClose && onClose();
          }}
        >
          <ListV2
            defaultSelectedItem={defaultSelectedItem || items[0]}
            items={items}
            onClose={onClose}
            extensions={extensions}
            onNavigationChange={setSelectedIdentifier}
            onSidebarButtonClick={() => setIsSidebarVisible(!isSidebarVisible)}
            isSidebarVisible={isSidebarVisible}
            contextId={contextId}
            featureFlags={featureFlags}
          />
        </Content>
        {renderSidebar()}
      </Blanket>
    </div>
  );

  return intl ? content : <IntlProvider locale="en">{content}</IntlProvider>;
};

const MediaViewerWithRef = React.forwardRef<
  HTMLDivElement,
  Props & WrappedComponentProps
>((props, ref) => {
  return <MediaViewerComponent {...props} innerRef={ref} />;
});

const MediaViewerWithScrollLock = (props: Props & WrappedComponentProps) => {
  return (
    <FocusLock autoFocus>
      <ScrollLock />
      <MediaViewerWithRef {...props} />
    </FocusLock>
  );
};

export const MediaViewerV2: React.ComponentType<Props> = injectIntl(
  MediaViewerWithScrollLock,
  { enforceContext: false },
);
