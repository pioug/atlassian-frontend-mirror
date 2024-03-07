/* eslint-disable @atlaskit/design-system/ensure-design-token-usage/preview */
/** @jsx jsx */
import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { css, jsx } from '@emotion/react';
import classnames from 'classnames';
import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/custom-theme-button';
import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import { GRID_GUTTER } from '@atlaskit/editor-common/styles';
import type { OptionalPlugin } from '@atlaskit/editor-common/types';
import { WidthConsumer } from '@atlaskit/editor-common/ui';
import { ToolbarArrowKeyNavigationProvider } from '@atlaskit/editor-common/ui-menu';
import type {
  MaxContentSizePlugin,
  MaxContentSizePluginState,
} from '@atlaskit/editor-plugins/max-content-size';
import type { MediaPlugin } from '@atlaskit/editor-plugins/media';
import type { MediaPluginState } from '@atlaskit/editor-plugins/media/types';
import { tableCommentEditorStyles } from '@atlaskit/editor-plugins/table/ui/common-styles';
import { akEditorMobileBreakoutPoint } from '@atlaskit/editor-shared-styles';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';
import { N40 } from '@atlaskit/theme/colors';
import { borderRadius } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

import messages from '../../../messages';
import { usePresetContext } from '../../../presets/context';
import type {
  EditorAppearance,
  EditorAppearanceComponentProps,
} from '../../../types';
import { ClickAreaBlock } from '../../Addon';
import { createEditorContentStyle } from '../../ContentStyles';
import PluginSlot from '../../PluginSlot';
import Toolbar from '../../Toolbar';
import WithFlash from '../../WithFlash';

import { MainToolbar, mainToolbarCustomComponentsSlotStyle } from './Toolbar';

const CommentEditorMargin = 14;

const commentEditorStyle = css({
  display: 'flex',
  flexDirection: 'column',
  '.less-margin .ProseMirror': {
    margin: `${token('space.150', '12px')} ${token('space.100', '8px')} ${token(
      'space.100',
      '8px',
    )}`,
  },
  minWidth: '272px',
  height: 'auto',
  backgroundColor: token('color.background.input', 'white'),
  border: `1px solid ${token('color.border', N40)}`,
  boxSizing: 'border-box',
  borderRadius: `${borderRadius()}px`,
  maxWidth: 'inherit',
  wordWrap: 'break-word',
});

const ContentArea = createEditorContentStyle(
  css(
    {
      flexGrow: 1,
      overflowX: getBooleanFF('platform.editor.table-sticky-scrollbar')
        ? 'clip'
        : 'hidden',
      lineHeight: '24px',
      '.ProseMirror': {
        margin: token('space.150', '12px'),
      },
      '.gridParent': {
        marginLeft: `${CommentEditorMargin - GRID_GUTTER}px`,
        marginRight: `${CommentEditorMargin - GRID_GUTTER}px`,
        width: `calc(100% + ${CommentEditorMargin - GRID_GUTTER}px)`,
      },
      padding: token('space.250', '20px'),
    },
    tableCommentEditorStyles,
  ),
);
ContentArea.displayName = 'ContentArea';

const secondaryToolbarStyle = css({
  boxSizing: 'border-box',
  justifyContent: 'flex-end',
  alignItems: 'center',
  display: 'flex',
  padding: `${token('space.150', '12px')} ${token('space.025', '2px')}`,
});
interface EditorAppearanceComponentState {}

const appearance: EditorAppearance = 'comment';

class Editor extends React.Component<
  EditorAppearanceComponentProps & WrappedComponentProps,
  EditorAppearanceComponentState
> {
  static displayName = 'CommentEditorAppearance';

  private appearance: EditorAppearance = 'comment';
  private containerElement: HTMLElement | null = null;

  // Wrapper container for toolbar and content area
  private wrapperElementRef = React.createRef<HTMLDivElement>();

  constructor(props: any) {
    super(props);
    if (props.innerRef) {
      this.wrapperElementRef = props.innerRef;
    }
  }

  private handleSave = () => {
    if (this.props.editorView && this.props.onSave) {
      this.props.onSave(this.props.editorView);
    }
  };

  private handleCancel = () => {
    if (this.props.editorView && this.props.onCancel) {
      this.props.onCancel(this.props.editorView);
    }
  };

  private renderChrome = ({ maxContentSize, mediaState }: PluginStates) => {
    const {
      editorDOMElement,
      editorView,
      editorActions,
      eventDispatcher,
      providerFactory,
      contentComponents,
      customContentComponents,
      customPrimaryToolbarComponents,
      primaryToolbarComponents,
      customSecondaryToolbarComponents,
      popupsMountPoint,
      popupsBoundariesElement,
      popupsScrollableElement,
      maxHeight,
      minHeight = 150,
      onSave,
      onCancel,
      disabled,
      dispatchAnalyticsEvent,
      intl,
      useStickyToolbar,
      pluginHooks,
      featureFlags,
    } = this.props;
    const maxContentSizeReached = Boolean(
      maxContentSize?.maxContentSizeReached,
    );
    const showSecondaryToolbar =
      !!onSave || !!onCancel || !!customSecondaryToolbarComponents;

    const isShortcutToFocusToolbar = (event: KeyboardEvent) => {
      //Alt + F9 to reach first element in this main toolbar
      return event.altKey && (event.key === 'F9' || event.keyCode === 120);
    };

    const isTwoLineToolbarEnabled =
      !!customPrimaryToolbarComponents && !!featureFlags?.twoLineEditorToolbar;

    const handleEscape = (event: KeyboardEvent) => {
      if (!editorView?.hasFocus()) {
        editorView?.focus();
      }
      event.preventDefault();
      event.stopPropagation();
    };

    return (
      <WithFlash animate={maxContentSizeReached}>
        <div
          css={[
            commentEditorStyle,
            css({
              minHeight: `${minHeight}px`,
            }),
          ]}
          className="akEditor"
          ref={this.wrapperElementRef}
        >
          <MainToolbar
            useStickyToolbar={useStickyToolbar}
            twoLineEditorToolbar={isTwoLineToolbarEnabled}
          >
            <ToolbarArrowKeyNavigationProvider
              editorView={editorView}
              childComponentSelector={"[data-testid='ak-editor-main-toolbar']"}
              isShortcutToFocusToolbar={isShortcutToFocusToolbar}
              handleEscape={handleEscape}
              editorAppearance={this.appearance}
              useStickyToolbar={useStickyToolbar}
              intl={intl}
            >
              <Toolbar
                editorView={editorView!}
                editorActions={editorActions}
                eventDispatcher={eventDispatcher!}
                providerFactory={providerFactory!}
                appearance={this.appearance}
                items={primaryToolbarComponents}
                popupsMountPoint={popupsMountPoint}
                popupsBoundariesElement={popupsBoundariesElement}
                popupsScrollableElement={popupsScrollableElement}
                disabled={!!disabled}
                dispatchAnalyticsEvent={dispatchAnalyticsEvent}
                containerElement={this.containerElement}
                twoLineEditorToolbar={isTwoLineToolbarEnabled}
              />
              <div
                css={mainToolbarCustomComponentsSlotStyle(
                  isTwoLineToolbarEnabled,
                )}
              >
                {customPrimaryToolbarComponents}
              </div>
            </ToolbarArrowKeyNavigationProvider>
          </MainToolbar>
          <ClickAreaBlock editorView={editorView} editorDisabled={disabled}>
            <WidthConsumer>
              {({ width }) => {
                return (
                  <ContentArea
                    ref={(ref) => (this.containerElement = ref)}
                    css={
                      maxHeight
                        ? css({
                            maxHeight: `${maxHeight}px`,
                          })
                        : null
                    }
                    className={classnames('ak-editor-content-area', {
                      'less-margin': width < akEditorMobileBreakoutPoint,
                    })}
                    featureFlags={featureFlags}
                  >
                    {customContentComponents &&
                    'before' in customContentComponents
                      ? customContentComponents.before
                      : customContentComponents}
                    <PluginSlot
                      editorView={editorView}
                      editorActions={editorActions}
                      eventDispatcher={eventDispatcher}
                      dispatchAnalyticsEvent={dispatchAnalyticsEvent}
                      providerFactory={providerFactory}
                      appearance={this.appearance}
                      items={contentComponents}
                      popupsMountPoint={popupsMountPoint}
                      popupsBoundariesElement={popupsBoundariesElement}
                      popupsScrollableElement={popupsScrollableElement}
                      containerElement={this.containerElement}
                      disabled={!!disabled}
                      wrapperElement={this.wrapperElementRef.current}
                      pluginHooks={pluginHooks}
                    />
                    {editorDOMElement}
                    {customContentComponents &&
                    'after' in customContentComponents
                      ? customContentComponents.after
                      : null}
                  </ContentArea>
                );
              }}
            </WidthConsumer>
          </ClickAreaBlock>
        </div>
        {showSecondaryToolbar && (
          <div
            css={secondaryToolbarStyle}
            data-testid="ak-editor-secondary-toolbar"
          >
            <ButtonGroup>
              {!!onSave && (
                <Button
                  appearance="primary"
                  onClick={this.handleSave}
                  testId="comment-save-button"
                  isDisabled={
                    disabled || (mediaState && !mediaState.allUploadsFinished)
                  }
                >
                  {intl.formatMessage(messages.saveButton)}
                </Button>
              )}
              {!!onCancel && (
                <Button
                  appearance="subtle"
                  onClick={this.handleCancel}
                  isDisabled={disabled}
                >
                  {intl.formatMessage(messages.cancelButton)}
                </Button>
              )}
            </ButtonGroup>
            <span style={{ flexGrow: 1 }} />
            {customSecondaryToolbarComponents}
          </div>
        )}
      </WithFlash>
    );
  };

  render() {
    return <RenderWithPluginState renderChrome={this.renderChrome} />;
  }
}

interface PluginStates {
  maxContentSize?: MaxContentSizePluginState;
  mediaState?: MediaPluginState;
}

interface RenderChromeProps {
  renderChrome: (props: PluginStates) => React.ReactNode;
}

function RenderWithPluginState({ renderChrome }: RenderChromeProps) {
  const api =
    usePresetContext<
      [OptionalPlugin<MediaPlugin>, OptionalPlugin<MaxContentSizePlugin>]
    >();
  const { mediaState, maxContentSizeState } = useSharedPluginState(api, [
    'media',
    'maxContentSize',
  ]);

  return (
    <Fragment>
      {renderChrome({
        maxContentSize: maxContentSizeState,
        mediaState: mediaState ?? undefined,
      })}
    </Fragment>
  );
}

const EditorNext = (
  props: EditorAppearanceComponentProps & WrappedComponentProps,
) => {
  const api =
    usePresetContext<
      [OptionalPlugin<MediaPlugin>, OptionalPlugin<MaxContentSizePlugin>]
    >();
  const { mediaState, maxContentSizeState } = useSharedPluginState(api, [
    'media',
    'maxContentSize',
  ]);
  const {
    editorDOMElement,
    editorView,
    editorActions,
    eventDispatcher,
    providerFactory,
    contentComponents,
    customContentComponents,
    customPrimaryToolbarComponents,
    primaryToolbarComponents,
    customSecondaryToolbarComponents,
    popupsMountPoint,
    popupsBoundariesElement,
    popupsScrollableElement,
    maxHeight,
    minHeight = 150,
    onSave,
    onCancel,
    disabled,
    dispatchAnalyticsEvent,
    intl,
    useStickyToolbar,
    pluginHooks,
    featureFlags,
    innerRef,
  } = props;
  const maxContentSizeReached = Boolean(
    maxContentSizeState?.maxContentSizeReached,
  );
  const showSecondaryToolbar =
    !!onSave || !!onCancel || !!customSecondaryToolbarComponents;
  let containerElement: HTMLElement | null = null;

  // Wrapper container for toolbar and content area
  const wrapperElementRef = useMemo(
    () => innerRef || React.createRef<HTMLDivElement>(),
    [innerRef],
  );

  const [saveButtonDisabled, setSaveButtonDisabled] = useState(disabled);

  useEffect(() => {
    if (mediaState) {
      mediaState.subscribeToUploadInProgressState(setSaveButtonDisabled);
    }
    return () =>
      mediaState?.unsubscribeFromUploadInProgressState(setSaveButtonDisabled);
  }, [mediaState]);

  const handleSave = useCallback(() => {
    if (editorView && onSave) {
      onSave(editorView);
    }
  }, [editorView, onSave]);

  const handleCancel = useCallback(() => {
    if (editorView && onCancel) {
      onCancel(editorView);
    }
  }, [editorView, onCancel]);

  const isShortcutToFocusToolbar = useCallback((event: KeyboardEvent) => {
    //Alt + F9 to reach first element in this main toolbar
    return event.altKey && (event.key === 'F9' || event.keyCode === 120);
  }, []);

  const isTwoLineToolbarEnabled =
    !!customPrimaryToolbarComponents && !!featureFlags?.twoLineEditorToolbar;

  const handleEscape = useCallback(
    (event: KeyboardEvent) => {
      if (!editorView?.hasFocus()) {
        editorView?.focus();
      }
      event.preventDefault();
      event.stopPropagation();
    },
    [editorView],
  );

  return (
    <WithFlash animate={maxContentSizeReached}>
      <div
        css={[
          commentEditorStyle,
          css({
            minHeight: `${minHeight}px`,
          }),
        ]}
        className="akEditor"
        ref={wrapperElementRef}
      >
        <MainToolbar
          useStickyToolbar={useStickyToolbar}
          twoLineEditorToolbar={isTwoLineToolbarEnabled}
        >
          <ToolbarArrowKeyNavigationProvider
            editorView={editorView}
            childComponentSelector={"[data-testid='ak-editor-main-toolbar']"}
            isShortcutToFocusToolbar={isShortcutToFocusToolbar}
            handleEscape={handleEscape}
            editorAppearance={appearance}
            useStickyToolbar={useStickyToolbar}
            intl={intl}
          >
            <Toolbar
              editorView={editorView!}
              editorActions={editorActions}
              eventDispatcher={eventDispatcher!}
              providerFactory={providerFactory!}
              appearance={appearance}
              items={primaryToolbarComponents}
              popupsMountPoint={popupsMountPoint}
              popupsBoundariesElement={popupsBoundariesElement}
              popupsScrollableElement={popupsScrollableElement}
              disabled={!!disabled}
              dispatchAnalyticsEvent={dispatchAnalyticsEvent}
              containerElement={containerElement}
              twoLineEditorToolbar={isTwoLineToolbarEnabled}
            />
            <div
              css={mainToolbarCustomComponentsSlotStyle(
                isTwoLineToolbarEnabled,
              )}
            >
              {customPrimaryToolbarComponents}
            </div>
          </ToolbarArrowKeyNavigationProvider>
        </MainToolbar>
        <ClickAreaBlock editorView={editorView} editorDisabled={disabled}>
          <WidthConsumer>
            {({ width }) => {
              return (
                <ContentArea
                  ref={(ref) => (containerElement = ref)}
                  css={
                    maxHeight
                      ? css({
                          maxHeight: `${maxHeight}px`,
                        })
                      : null
                  }
                  className={classnames('ak-editor-content-area', {
                    'less-margin': width < akEditorMobileBreakoutPoint,
                  })}
                  featureFlags={featureFlags}
                >
                  {customContentComponents &&
                  'before' in customContentComponents
                    ? customContentComponents.before
                    : customContentComponents}
                  <PluginSlot
                    editorView={editorView}
                    editorActions={editorActions}
                    eventDispatcher={eventDispatcher}
                    dispatchAnalyticsEvent={dispatchAnalyticsEvent}
                    providerFactory={providerFactory}
                    appearance={appearance}
                    items={contentComponents}
                    popupsMountPoint={popupsMountPoint}
                    popupsBoundariesElement={popupsBoundariesElement}
                    popupsScrollableElement={popupsScrollableElement}
                    containerElement={containerElement}
                    disabled={!!disabled}
                    wrapperElement={wrapperElementRef.current}
                    pluginHooks={pluginHooks}
                  />
                  {editorDOMElement}
                  {customContentComponents && 'after' in customContentComponents
                    ? customContentComponents.after
                    : null}
                </ContentArea>
              );
            }}
          </WidthConsumer>
        </ClickAreaBlock>
      </div>
      {showSecondaryToolbar && (
        <div
          css={secondaryToolbarStyle}
          data-testid="ak-editor-secondary-toolbar"
        >
          <ButtonGroup>
            {!!onSave && (
              <Button
                appearance="primary"
                onClick={handleSave}
                testId="comment-save-button"
                isDisabled={disabled || saveButtonDisabled}
              >
                {intl.formatMessage(messages.saveButton)}
              </Button>
            )}
            {!!onCancel && (
              <Button
                appearance="subtle"
                onClick={handleCancel}
                isDisabled={disabled}
              >
                {intl.formatMessage(messages.cancelButton)}
              </Button>
            )}
          </ButtonGroup>
          <span style={{ flexGrow: 1 }} />
          {customSecondaryToolbarComponents}
        </div>
      )}
    </WithFlash>
  );
};

EditorNext.displayName = 'CommentEditorAppearance';

const CommentEditorNextWithIntl = injectIntl(EditorNext);
const CommentEditorOldWithIntl = injectIntl(Editor);

const ExportComp = getBooleanFF(
  'platform.editor.media.alluploadsfinished-dispatch-update_ivtow',
)
  ? CommentEditorNextWithIntl
  : CommentEditorOldWithIntl;

export const CommentEditorWithIntl = ExportComp;
