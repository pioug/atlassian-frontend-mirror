/** @jsx jsx */
import type { PropsWithChildren, SyntheticEvent } from 'react';
import React, {
  PureComponent,
  Fragment,
  useEffect,
  useState,
  useMemo,
} from 'react';
import { jsx } from '@emotion/react';
import { AnalyticsContext } from '@atlaskit/analytics-next';
import { MEDIA_CONTEXT } from '@atlaskit/analytics-namespaced-context';
import { WithProviders } from '@atlaskit/editor-common/provider-factory';
import type {
  ContextIdentifierProvider,
  ProviderFactory,
} from '@atlaskit/editor-common/provider-factory';
import type { EventHandlers } from '@atlaskit/editor-common/ui';
import { MediaBorderGapFiller } from '@atlaskit/editor-common/ui';
import type { MediaCardProps, MediaProvider } from '../../../ui/MediaCard';
import { MediaCard } from '../../../ui/MediaCard';
import type {
  LinkDefinition,
  BorderMarkDefinition,
  AnnotationMarkDefinition,
} from '@atlaskit/adf-schema';
import { AnnotationMarkStates } from '@atlaskit/adf-schema';
import type { MediaFeatureFlags } from '@atlaskit/media-common';
import { hexToEditorBorderPaletteColor } from '@atlaskit/editor-palette';

import { getEventHandler } from '../../../utils';
import {
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  EVENT_TYPE,
} from '@atlaskit/editor-common/analytics';

import type { AnalyticsEventPayload } from '../../../analytics/events';
import { MODE, PLATFORM } from '../../../analytics/events';
import AnnotationComponent from '../../marks/annotation';
import { AnnotationsDraftContext } from '../../../ui/annotations/context';
import { linkStyle, borderStyle } from './styles';
import type { CommentBadgeProps } from '@atlaskit/editor-common/media-single';
import { CommentBadge as CommentBadgeComponent } from '@atlaskit/editor-common/media-single';
import { injectIntl } from 'react-intl-next';
import {
  useInlineCommentSubscriberContext,
  useInlineCommentsFilter,
} from '../../../ui/annotations/hooks';
import { AnnotationUpdateEvent } from '@atlaskit/editor-common/types';

export type MediaProps = MediaCardProps & {
  providers?: ProviderFactory;
  allowAltTextOnImages?: boolean;
  children?: React.ReactNode;
  isInsideOfBlockNode?: boolean;
  marks: Array<
    LinkDefinition | BorderMarkDefinition | AnnotationMarkDefinition
  >;
  isBorderMark: () => boolean;
  isLinkMark: () => boolean;
  isAnnotationMark?: () => boolean;
  fireAnalyticsEvent?: (event: AnalyticsEventPayload) => void;
  featureFlags?: MediaFeatureFlags;
  eventHandlers?: EventHandlers;
  enableDownloadButton?: boolean;
  allowAnnotationsDraftMode?: boolean;
  // only used for comment badge, is injected via nodes/mediaSingle
  mediaSingleElement?: HTMLElement | null;
  // attributes for media node
  width?: number;
  height?: number;
};

type Providers = {
  mediaProvider?: Promise<MediaProvider>;
  contextIdentifierProvider?: Promise<ContextIdentifierProvider>;
};

const MediaBorder = ({
  mark,
  children,
}: React.PropsWithChildren<{
  mark?: BorderMarkDefinition;
}>): JSX.Element => {
  if (!mark) {
    return <Fragment>{children}</Fragment>;
  }

  const borderColor = mark?.attrs.color ?? '';
  const borderWidth = mark?.attrs.size ?? 0;

  const paletteColorValue =
    hexToEditorBorderPaletteColor(borderColor) || borderColor;

  return (
    <div
      data-mark-type="border"
      data-color={borderColor}
      data-size={borderWidth}
      css={borderStyle(paletteColorValue, borderWidth)}
    >
      <MediaBorderGapFiller borderColor={borderColor} />
      {children}
    </div>
  );
};

const MediaLink = ({
  mark,
  children,
  onClick,
}: React.PropsWithChildren<{
  mark?: LinkDefinition;
  onClick?: React.MouseEventHandler<HTMLAnchorElement> | undefined;
}>): JSX.Element => {
  if (!mark) {
    return <Fragment>{children}</Fragment>;
  }

  const linkHref = mark?.attrs.href;

  return (
    <a
      href={linkHref}
      rel="noreferrer noopener"
      onClick={onClick}
      data-block-link={linkHref}
      css={linkStyle}
    >
      {children}
    </a>
  );
};

const MediaAnnotation = ({
  mark,
  children,
}: React.PropsWithChildren<{
  mark?: AnnotationMarkDefinition;
}>): JSX.Element => {
  if (!mark) {
    return <Fragment>{children}</Fragment>;
  }

  return (
    <AnnotationComponent
      id={mark.attrs.id}
      annotationType={mark.attrs.annotationType}
      dataAttributes={{
        'data-renderer-mark': true,
      }}
      // This should be fine being empty [] since the serializer serializeFragmentChild getMarkProps call always passes
      annotationParentIds={[]}
      allowAnnotations
      useBlockLevel
    >
      {children}
    </AnnotationComponent>
  );
};

const MediaAnnotations = ({
  marks = [],
  children,
}: React.PropsWithChildren<{
  marks?: AnnotationMarkDefinition[];
}>): JSX.Element => {
  // Early Exit
  if (marks.length === 0) {
    return <Fragment>{children}</Fragment>;
  }

  // Recursive marks
  const currentMark = marks[0];
  const otherMarks = marks.slice(1);

  return (
    <Fragment>
      <MediaAnnotation key={currentMark.attrs.id} mark={currentMark}>
        {otherMarks.length ? (
          <MediaAnnotations marks={otherMarks}>{children}</MediaAnnotations>
        ) : (
          <Fragment>{children}</Fragment>
        )}
      </MediaAnnotation>
    </Fragment>
  );
};

const CommentBadge = injectIntl(CommentBadgeComponent);

const CommentBadgeWrapper = ({
  marks,
  ...rest
}: Omit<CommentBadgeProps, 'onClick' | 'intl'> & {
  marks?: AnnotationMarkDefinition[];
}) => {
  const updateSubscriber = useInlineCommentSubscriberContext();
  const activeParentIds = useInlineCommentsFilter({
    annotationIds: marks?.map((mark) => mark.attrs.id) ?? [''],
    filter: {
      state: AnnotationMarkStates.ACTIVE,
    },
  });

  if (!activeParentIds.length) {
    return null;
  }

  const onClick = (e: React.MouseEvent) => {
    if (updateSubscriber) {
      updateSubscriber.emit(AnnotationUpdateEvent.ON_ANNOTATION_CLICK, {
        annotationIds: activeParentIds,
        eventTarget: e.target as HTMLElement,
      });
    }
  };

  return <CommentBadge onClick={onClick} {...rest} />;
};

class Media extends PureComponent<MediaProps, {}> {
  constructor(props: MediaProps) {
    super(props);
    this.handleMediaLinkClickFn = this.handleMediaLinkClick.bind(this);
  }

  private handleMediaLinkClickFn;

  private renderCard = (providers: Providers = {}) => {
    const { contextIdentifierProvider } = providers;
    const {
      allowAltTextOnImages,
      alt,
      featureFlags,
      shouldOpenMediaViewer: allowMediaViewer,
      enableDownloadButton,
      ssr,
      width,
      height,
      mediaSingleElement,
    } = this.props;

    const annotationMarks = (
      this.props.isAnnotationMark
        ? this.props.marks.filter(this.props.isAnnotationMark)
        : undefined
    ) as AnnotationMarkDefinition[] | undefined;

    const borderMark = this.props.marks.find(this.props.isBorderMark) as
      | BorderMarkDefinition
      | undefined;

    const linkMark = this.props.marks.find(this.props.isLinkMark) as
      | LinkDefinition
      | undefined;

    const linkHref = linkMark?.attrs.href;
    const eventHandlers = linkHref ? undefined : this.props.eventHandlers;
    const shouldOpenMediaViewer = !linkHref && allowMediaViewer;

    return (
      <MediaLink mark={linkMark} onClick={this.handleMediaLinkClickFn}>
        <MediaAnnotations marks={annotationMarks}>
          <MediaBorder mark={borderMark}>
            <AnalyticsContext
              data={{
                [MEDIA_CONTEXT]: {
                  border: !!borderMark,
                },
              }}
            >
              {!!annotationMarks && (
                <CommentBadgeWrapper
                  marks={annotationMarks}
                  mediaElement={mediaSingleElement}
                  width={width}
                  height={height}
                />
              )}
              <MediaCard
                contextIdentifierProvider={contextIdentifierProvider}
                {...this.props}
                shouldOpenMediaViewer={shouldOpenMediaViewer}
                eventHandlers={eventHandlers}
                alt={allowAltTextOnImages ? alt : undefined}
                featureFlags={featureFlags}
                shouldEnableDownloadButton={enableDownloadButton}
                ssr={ssr}
              />
            </AnalyticsContext>
          </MediaBorder>
        </MediaAnnotations>
      </MediaLink>
    );
  };

  private handleMediaLinkClick = (
    event: SyntheticEvent<HTMLAnchorElement, Event>,
  ) => {
    const { fireAnalyticsEvent, isLinkMark, marks } = this.props;
    if (fireAnalyticsEvent) {
      fireAnalyticsEvent({
        action: ACTION.VISITED,
        actionSubject: ACTION_SUBJECT.MEDIA,
        actionSubjectId: ACTION_SUBJECT_ID.LINK,
        eventType: EVENT_TYPE.TRACK,
        attributes: {
          platform: PLATFORM.WEB,
          mode: MODE.RENDERER,
        },
      });
    }
    const linkMark = this.props.marks.find(
      this.props.isLinkMark,
    ) as LinkDefinition;
    const linkHref = linkMark?.attrs.href;

    const handler = getEventHandler(this.props.eventHandlers, 'link');
    if (handler) {
      const linkMark = marks.find(isLinkMark);
      handler(event, linkMark && linkHref);
    }
  };

  render() {
    const { providers } = this.props;

    if (!providers) {
      return this.renderCard();
    }
    return (
      <WithProviders
        providers={['mediaProvider', 'contextIdentifierProvider']}
        providerFactory={providers}
        renderNode={this.renderCard}
      />
    );
  }
}

const MediaWithDraftAnnotation = (props: PropsWithChildren<MediaProps>) => {
  const draftPosition = React.useContext(AnnotationsDraftContext);

  const { dataAttributes } = props;
  const pos = dataAttributes && dataAttributes['data-renderer-start-pos'];

  const [position, setPosition] = useState<number | undefined>();
  const [shouldApplyDraftAnnotation, setShouldApplyDraftAnnotation] =
    useState<boolean>(false);

  useEffect(() => {
    if (pos === undefined) {
      return;
    }

    if (draftPosition !== null && draftPosition.from === pos) {
      setShouldApplyDraftAnnotation(true);
      setPosition(draftPosition?.from);
    } else if (draftPosition === null && shouldApplyDraftAnnotation) {
      setShouldApplyDraftAnnotation(false);
      setPosition(undefined);
    }
  }, [draftPosition, pos, shouldApplyDraftAnnotation]);

  const applyDraftAnnotation =
    props.allowAnnotationsDraftMode &&
    shouldApplyDraftAnnotation &&
    position !== undefined;

  const dataAttributesWithDraftAnnotation = useMemo(
    () =>
      applyDraftAnnotation
        ? {
            ...dataAttributes,
            'data-annotation-draft-mark': true,
            'data-renderer-mark': true,
          }
        : dataAttributes,
    [applyDraftAnnotation, dataAttributes],
  );

  return (
    <Media {...props} dataAttributes={dataAttributesWithDraftAnnotation} />
  );
};

export default MediaWithDraftAnnotation;
