// eslint-disable-file
export const fiveHundredLineExample = `export const NORMAL_SEVERITY_THRESHOLD = 2000;
export const DEGRADED_SEVERITY_THRESHOLD = 3000;
export interface Extension<T> {
  extensionKey: string;
  parameters?: T;
  content?: any; // This would be the original Atlassian Document Format
}
const packageName = process.env._PACKAGE_NAME_ as string;
const packageVersion = process.env._PACKAGE_VERSION_ as string;

export type { RendererProps as Props };

export class Renderer extends PureComponent<RendererProps> {
  private providerFactory: ProviderFactory;
  private serializer: ReactSerializer;
  private rafID?: number;
  private editorRef: React.RefObject<HTMLDivElement>;
  private mouseDownSelection?: string;
  private id?: string;
  /**
   * This is used in measuring the Renderer Mount time and is then
   * deleted once that measurement occurs.
   */
  private renderedMeasurementDistortedDurationMonitor?: {
    distortedDuration: boolean;
    cleanup: () => void;
  } = getDistortedDurationMonitor();

  constructor(props: RendererProps) {
    super(props);
    this.providerFactory = props.dataProviders || new ProviderFactory();
    this.serializer = new ReactSerializer(this.deriveSerializerProps(props));
    this.editorRef = props.innerRef || React.createRef();
    this.id = uuid();
    startMeasure("Renderer Render Time: this.id");

    const featureFlags = this.featureFlags(this.props.featureFlags)
      .featureFlags;

    if (featureFlags?.rendererTtiTracking) {
      measureTTI((tti, ttiFromInvocation, canceled) => {
        this.fireAnalyticsEvent({
          action: ACTION.RENDERER_TTI,
          actionSubject: ACTION_SUBJECT.RENDERER,
          attributes: { tti, ttiFromInvocation, canceled },
          eventType: EVENT_TYPE.OPERATIONAL,
        });
      });
    }
  }

  private anchorLinkAnalytics() {
    const hash =
      window.location.hash && decodeURIComponent(window.location.hash.slice(1));
    const { disableHeadingIDs } = this.props;

    if (
      !disableHeadingIDs &&
      hash &&
      this.editorRef &&
      this.editorRef.current instanceof HTMLElement
    ) {
      const anchorLinkElement = document.getElementById(hash);
      // We are not use this.editorRef.querySelector here, instead we have this.editorRef.contains
      // because querySelector might fail if there are special characters in hash, and CSS.escape is still experimental.
      if (
        anchorLinkElement &&
        this.editorRef.current.contains(anchorLinkElement)
      ) {
        this.fireAnalyticsEvent({
          action: ACTION.VIEWED,
          actionSubject: ACTION_SUBJECT.ANCHOR_LINK,
          attributes: { platform: PLATFORM.WEB, mode: MODE.RENDERER },
          eventType: EVENT_TYPE.UI,
        });
      }
    }
  }

  componentDidMount() {
    this.fireAnalyticsEvent({
      action: ACTION.STARTED,
      actionSubject: ACTION_SUBJECT.RENDERER,
      attributes: { platform: PLATFORM.WEB },
      eventType: EVENT_TYPE.UI,
    });

    this.rafID = requestAnimationFrame(() => {
      stopMeasure("Renderer Render Time: this.id", (duration) => {
        const { analyticsEventSeverityTracking } = this.props;
        const forceSeverityTracking =
          typeof analyticsEventSeverityTracking === 'undefined' &&
          shouldForceTracking();

        const severity =
          !!forceSeverityTracking || analyticsEventSeverityTracking?.enabled
            ? getAnalyticsEventSeverity(
                duration,
                analyticsEventSeverityTracking?.severityNormalThreshold ??
                  NORMAL_SEVERITY_THRESHOLD,
                analyticsEventSeverityTracking?.severityDegradedThreshold ??
                  DEGRADED_SEVERITY_THRESHOLD,
              )
            : undefined;

        this.fireAnalyticsEvent({
          action: ACTION.RENDERED,
          actionSubject: ACTION_SUBJECT.RENDERER,
          attributes: {
            platform: PLATFORM.WEB,
            duration,
            distortedDuration: this.renderedMeasurementDistortedDurationMonitor!
              .distortedDuration,
            ttfb: getResponseEndTime(),
            nodes: reduce<Record<string, number>>(
              this.props.document,
              (acc, node) => {
                acc[node.type] = (acc[node.type] || 0) + 1;
                return acc;
              },
              {},
            ),
            severity,
          },
          eventType: EVENT_TYPE.OPERATIONAL,
        });
        this.renderedMeasurementDistortedDurationMonitor!.cleanup();
        delete this.renderedMeasurementDistortedDurationMonitor;
      });
      this.anchorLinkAnalytics();
    });
  }

  private deriveSerializerProps(props: RendererProps): ReactSerializerInit {
    // if just passed a boolean, change shape into object to simplify type
    const stickyHeaders = props.stickyHeaders
      ? props.stickyHeaders === true
        ? {}
        : props.stickyHeaders
      : undefined;

    const { annotationProvider } = props;
    const allowAnnotationsDraftMode = Boolean(
      annotationProvider &&
        annotationProvider.inlineComment &&
        annotationProvider.inlineComment.allowDraftMode,
    );

    const { featureFlags } = this.featureFlags(props.featureFlags);

    return {
      providers: this.providerFactory,
      eventHandlers: props.eventHandlers,
      extensionHandlers: props.extensionHandlers,
      portal: props.portal,
      objectContext: {
        adDoc: props.document,
        schema: props.schema,
        ...props.rendererContext,
      } as RendererContext,
      appearance: props.appearance,
      disableHeadingIDs: props.disableHeadingIDs,
      disableActions: props.disableActions,
      allowHeadingAnchorLinks: props.allowHeadingAnchorLinks,
      allowColumnSorting: props.allowColumnSorting,
      fireAnalyticsEvent: this.fireAnalyticsEvent,
      shouldOpenMediaViewer: props.shouldOpenMediaViewer,
      allowAltTextOnImages: props.allowAltTextOnImages,
      stickyHeaders,
      allowMediaLinking: props.media && props.media.allowLinking,
      surroundTextNodesWithTextWrapper: allowAnnotationsDraftMode,
      media: props.media,
      smartLinks: props.smartLinks,
      allowCopyToClipboard: props.allowCopyToClipboard,
      allowCustomPanels: props.allowCustomPanels,
      allowAnnotations: props.allowAnnotations,
      allowSelectAllTrap: props.allowSelectAllTrap,
      allowPlaceholderText: props.allowPlaceholderText,
      nodeComponents: props.nodeComponents,
      // does not currently support SSR, should not be enabled in environments where Renderer is SSR-ed
      allowWindowedCodeBlock: featureFlags?.allowWindowedCodeBlock,
    };
  }

  private featureFlags = memoizeOne(
    (featureFlags: RendererProps['featureFlags']) => {
      const normalizedFeatureFlags = normalizeFeatureFlags<
        NormalizedObjectFeatureFlags
      >(featureFlags, {
        objectFlagKeys: ['rendererRenderTracking'],
      });
      return {
        featureFlags: normalizedFeatureFlags,
      };
    },
  );

  private fireAnalyticsEvent: FireAnalyticsCallback = (event) => {
    const { createAnalyticsEvent } = this.props;

    if (createAnalyticsEvent) {
      const channel = FabricChannel.editor;
      createAnalyticsEvent(event).fire(channel);
    }
  };

  private getSchema = memoizeOne(
    (schema?: Schema, adfStage?: 'final' | 'stage0') => {
      if (schema) {
        return schema;
      }

      return getSchemaBasedOnStage(adfStage);
    },
  );

  private handleMouseTripleClickInTables = (event: MouseEvent) => {
    if (browser.ios || browser.android) {
      return;
    }
    const badBrowser = browser.chrome || browser.safari;
    const tripleClick = event.detail >= 3;
    if (!(badBrowser && tripleClick)) {
      return;
    }
    const selection = window.getSelection();
    if (!selection) {
      return;
    }
    const { type, anchorNode, focusNode } = selection;
    const rangeSelection = Boolean(type === 'Range' && anchorNode && focusNode);
    if (!rangeSelection) {
      return;
    }
    const target = event.target as HTMLElement;
    const tableCell = target.closest('td,th');
    const clickedInCell = Boolean(tableCell);
    if (!clickedInCell) {
      return;
    }
    const anchorInCell = tableCell!.contains(anchorNode);
    const focusInCell = tableCell!.contains(focusNode);
    const selectionStartsOrEndsOutsideClickedCell = !(
      anchorInCell && focusInCell
    );
    if (!selectionStartsOrEndsOutsideClickedCell) {
      return;
    }
    const elementToSelect: Element | null | undefined = anchorInCell
      ? anchorNode!.parentElement?.closest('div,p')
      : focusInCell
      ? focusNode!.parentElement?.closest('div,p')
      : tableCell;
    if (elementToSelect) {
      selection.selectAllChildren(elementToSelect);
    }
  };

  render() {
    const {
      document: adfDocument,
      onComplete,
      onError,
      appearance,
      adfStage,
      truncated,
      maxHeight,
      fadeOutHeight,
      enableSsrInlineScripts,
      allowHeadingAnchorLinks,
      allowPlaceholderText,
      allowColumnSorting,
      allowCopyToClipboard,
      allowCustomPanels,
    } = this.props;

    const allowNestedHeaderLinks = isNestedHeaderLinksEnabled(
      allowHeadingAnchorLinks,
    );
    /**
     * Handle clicks inside renderer. If the click isn't on media, in the media picker, or on a
     * link, call the onUnhandledClick eventHandler (which in Jira for example, may switch the
     * renderer out for the editor).
     * @param event Click event anywhere inside renderer
     */
    const handleWrapperOnClick = (event: React.MouseEvent) => {
      const targetElement = event.target as HTMLElement;

      // ED-14862: When a user triple clicks to select a line of content inside a
      // a table cell, but the browser incorrectly moves the selection start or end into
      // a different table cell, we manually set the selection back to within the original
      // table cell the user intended to target
      this.handleMouseTripleClickInTables((event as unknown) as MouseEvent);

      if (!this.props.eventHandlers?.onUnhandledClick) {
        return;
      }
      if (!(targetElement instanceof window.Element)) {
        return;
      }

      const rendererWrapper = event.currentTarget as HTMLElement;

      // Check if the click was on an interactive element
      const isInteractiveElementInTree = findInTree(
        targetElement,
        rendererWrapper,
        isInteractiveElement,
      );
      if (isInteractiveElementInTree) {
        return;
      }

      const windowSelection = window.getSelection();
      const selection: string | undefined =
        windowSelection !== null ? windowSelection.toString() : undefined;
      const hasSelection = selection && selection.length !== 0;

      const hasSelectionMouseDown =
        this.mouseDownSelection && this.mouseDownSelection.length !== 0;
      const allowEditBasedOnSelection = !hasSelection && !hasSelectionMouseDown;

      if (allowEditBasedOnSelection) {
        this.props.eventHandlers.onUnhandledClick(event);
      }
    };

    try {
      const schema = this.getSchema(this.props.schema, this.props.adfStage);

      const { result, stat, pmDoc } = renderDocument(
        adfDocument,
        this.serializer,
        schema,
        adfStage,
        this.props.useSpecBasedValidator,
        this.id,
        this.fireAnalyticsEvent,
        this.props.unsupportedContentLevelsTracking,
        this.props.appearance,
      );

      if (onComplete) {
        onComplete(stat);
      }

      const rendererOutput = (
        <RendererContextProvider
          value={this.featureFlags(this.props.featureFlags)}
        >
          <ActiveHeaderIdProvider
            value={getActiveHeadingId(allowHeadingAnchorLinks)}
          >
            <AnalyticsContext.Provider
              value={{
                fireAnalyticsEvent: (event: AnalyticsEventPayload) =>
                  this.fireAnalyticsEvent(event),
              }}
            >
              <SmartCardStorageProvider>
                <RendererWrapper
                  appearance={appearance}
                  allowNestedHeaderLinks={allowNestedHeaderLinks}
                  allowColumnSorting={allowColumnSorting}
                  allowCopyToClipboard={allowCopyToClipboard}
                  allowCustomPanels={allowCustomPanels}
                  allowPlaceholderText={allowPlaceholderText}
                  innerRef={this.editorRef}
                  onClick={handleWrapperOnClick}
                  onMouseDown={this.onMouseDownEditView}
                >
                  {enableSsrInlineScripts ? <BreakoutSSRInlineScript /> : null}
                  <RendererActionsInternalUpdater
                    doc={pmDoc}
                    schema={schema}
                    onAnalyticsEvent={this.fireAnalyticsEvent}
                  >
                    {result}
                  </RendererActionsInternalUpdater>
                </RendererWrapper>
              </SmartCardStorageProvider>
            </AnalyticsContext.Provider>
          </ActiveHeaderIdProvider>
        </RendererContextProvider>
      );

      let rendererResult = truncated ? (
        <TruncatedWrapper height={maxHeight} fadeHeight={fadeOutHeight}>
          {rendererOutput}
        </TruncatedWrapper>
      ) : (
        rendererOutput
      );

      const rendererRenderTracking = this.featureFlags(this.props.featureFlags)
        ?.featureFlags?.rendererRenderTracking?.[ACTION_SUBJECT.RENDERER];

      const reRenderTracking = rendererRenderTracking?.enabled && (
        <RenderTracking
          componentProps={this.props}
          action={ACTION.RE_RENDERED}
          actionSubject={ACTION_SUBJECT.RENDERER}
          handleAnalyticsEvent={this.fireAnalyticsEvent}
          useShallow={rendererRenderTracking.useShallow}
        />
      );

      return (
        <Fragment>
          {reRenderTracking}
          {rendererResult}
        </Fragment>
      );
    } catch (e) {
      if (onError) {
        onError(e);
      }
      return (
        <RendererWrapper
          appearance={appearance}
          allowCopyToClipboard={allowCopyToClipboard}
          allowPlaceholderText={allowPlaceholderText}
          allowColumnSorting={allowColumnSorting}
          allowNestedHeaderLinks={allowNestedHeaderLinks}
          onClick={handleWrapperOnClick}
        >
          <UnsupportedBlock />
        </RendererWrapper>
      );
    }
  }

  componentWillUnmount() {
    const { dataProviders } = this.props;

    if (this.rafID) {
      window.cancelAnimationFrame(this.rafID);
    }

    // if this is the ProviderFactory which was created in constructor
    // it's safe to destroy it on Renderer unmount
    if (!dataProviders) {
      this.providerFactory.destroy();
    }
  }
}

const RendererWithAnalytics = React.memo((props: RendererProps) => (
  <FabricEditorAnalyticsContext
    data={{
      appearance: getAnalyticsAppearance(props.appearance),
      packageName,
      packageVersion,
      componentName: 'renderer',
      editorSessionId: uuid(),
    }}
  >
    <WithCreateAnalyticsEvent
      render={(createAnalyticsEvent) => {
        // 'IntlErrorBoundary' only captures Internationalisation errors, leaving others for 'ErrorBoundary'.
        return (
          <ErrorBoundary component={ACTION_SUBJECT.RENDERER} rethrowError fallbackComponent={null} createAnalyticsEvent={createAnalyticsEvent} >
            <IntlErrorBoundary>
              <Renderer
                {...props}
                createAnalyticsEvent={createAnalyticsEvent}
              />
            </IntlErrorBoundary>
          </ErrorBoundary>
        );
      }}
    />
  </FabricEditorAnalyticsContext>
));

type RendererWrapperProps = {
  appearance: RendererAppearance;
  innerRef?: React.RefObject<HTMLDivElement>;
  allowColumnSorting?: boolean;
  allowCopyToClipboard?: boolean;
  allowPlaceholderText?: boolean;
  allowCustomPanels?: boolean;
  allowNestedHeaderLinks: boolean;
  onClick?: (event: React.MouseEvent) => void;
  onMouseDown?: (event: React.MouseEvent) => void;
} & { children?: React.ReactNode };

const RendererWrapper = React.memo((props: RendererWrapperProps) => {
  const { allowColumnSorting, allowNestedHeaderLinks, innerRef, appearance, children, onClick, onMouseDown, } = props;

  return (
    <WidthProvider className="ak-renderer-wrapper">
      <BaseTheme baseFontSize={ appearance && appearance !== 'comment' ? akEditorFullPageDefaultFontSize : undefined } >
        <div ref={innerRef} onClick={onClick} onMouseDown={onMouseDown} css={rendererStyles({ appearance, allowNestedHeaderLinks, allowColumnSorting: !!allowColumnSorting, })} >
          {children}
        </div>
      </BaseTheme>
    </WidthProvider>
  );
});`;
