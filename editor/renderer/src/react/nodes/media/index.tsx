/** @jsx jsx */
import type { PropsWithChildren, SyntheticEvent } from 'react';
import React, {
  PureComponent,
  Fragment,
  useEffect,
  useState,
  useMemo,
  useContext,
} from 'react';
import { jsx, css } from '@emotion/react';
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
  VIEW_METHOD,
} from '@atlaskit/editor-common/analytics';

import type { AnalyticsEventPayload } from '../../../analytics/events';
import { MODE, PLATFORM } from '../../../analytics/events';
import AnnotationComponent from '../../marks/annotation';
import {
  AnnotationsDraftContext,
  ProvidersContext,
} from '../../../ui/annotations/context';
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
  isDrafting: boolean;
};

type Providers = {
  mediaProvider?: Promise<MediaProvider>;
  contextIdentifierProvider?: Promise<ContextIdentifierProvider>;
};

export const linkStyle = css`
  position: absolute;
  background: transparent;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  cursor: pointer;
  width: 100% !important;
  height: 100% !important;
`;

export const borderStyle = (color: string, width: number) => css`
  position: absolute;
  width: 100% !important;
  height: 100% !important;
  border-radius: ${width}px;
  box-shadow: 0 0 0 ${width}px ${color};
`;

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
        'data-block-mark': true,
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
  mediaElement,
  isDrafting = false,
  ...rest
}: Omit<CommentBadgeProps, 'onClick' | 'intl'> & {
  marks?: AnnotationMarkDefinition[];
}) => {
  const [status, setStatus] = useState<'default' | 'active'>('default');
  const [entered, setEntered] = useState(false);
  const updateSubscriber = useInlineCommentSubscriberContext();
  const activeParentIds = useInlineCommentsFilter({
    annotationIds: marks?.map((mark) => mark.attrs.id) ?? [''],
    filter: {
      state: AnnotationMarkStates.ACTIVE,
    },
  });

  useEffect(() => {
    const observer = new MutationObserver((mutationList) => {
      mutationList.forEach((mutation) => {
        if (mutation.attributeName === 'data-has-focus') {
          const elementHasFocus = !!mutation.target.parentNode?.querySelector(
            '[data-has-focus="true"]',
          );
          elementHasFocus ? setStatus('active') : setStatus('default');
        }
      });
    });

    if (mediaElement) {
      observer.observe(mediaElement, {
        attributes: true,
        subtree: true,
        attributeFilter: ['data-has-focus'],
      });
    }

    return () => {
      observer.disconnect();
    };
  }, [mediaElement, setStatus]);

  if (!isDrafting && !activeParentIds.length) {
    return null;
  }

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (updateSubscriber) {
      updateSubscriber.emit(AnnotationUpdateEvent.ON_ANNOTATION_CLICK, {
        annotationIds: activeParentIds,
        eventTarget: e.target as HTMLElement,
        // use mediaSingle here to align with annotation viewed event dispatched in editor
        eventTargetType: 'mediaSingle',
        viewMethod: VIEW_METHOD.BADGE,
      });
    }
  };

  return (
    <CommentBadge
      onMouseEnter={() => setEntered(true)}
      onMouseLeave={() => setEntered(false)}
      status={entered ? 'entered' : status}
      onClick={onClick}
      {...rest}
    />
  );
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
      isDrafting = false,
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
    const isInPageInclude = mediaSingleElement?.closest('[data-node-type="include"]') 


    const showCommentBadge =
      !!annotationMarks &&
      featureFlags?.commentsOnMedia &&
      (!featureFlags?.commentsOnMediaIncludePage || !isInPageInclude);

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
              {
                showCommentBadge && (
                  <CommentBadgeWrapper
                    marks={annotationMarks}
                    mediaElement={mediaSingleElement}
                    width={width}
                    height={height}
                    isDrafting={isDrafting}
                  />
                )
              }
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
  const providers = useContext(ProvidersContext);
  const isCommentsOnMediaBugFixEnabled =
    !!providers?.inlineComment.isCommentsOnMediaBugFixEnabled;

  const { dataAttributes } = props;
  const pos = dataAttributes && dataAttributes['data-renderer-start-pos'];


  const [position, setPosition] = useState<number | undefined>();
  const [shouldApplyDraftAnnotation, setShouldApplyDraftAnnotation] =
    useState<boolean>(false);

  useEffect(() => {
    if (pos === undefined) {
      return;
    }
    const posToCheck = isCommentsOnMediaBugFixEnabled
      ? (draftPosition?.from ?? 0) + 1
      : draftPosition?.from;
    if (draftPosition !== null && posToCheck === pos) {
      setShouldApplyDraftAnnotation(true);
      setPosition(posToCheck);
    } else if (draftPosition === null && shouldApplyDraftAnnotation) {
      setShouldApplyDraftAnnotation(false);
      setPosition(undefined);
    }
  }, [
    draftPosition,
    pos,
    shouldApplyDraftAnnotation,
    isCommentsOnMediaBugFixEnabled,
  ]);

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
    <Media
      {...props}
      dataAttributes={dataAttributesWithDraftAnnotation}
      isDrafting={shouldApplyDraftAnnotation}  />
  );
};

export default MediaWithDraftAnnotation;
