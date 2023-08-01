/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/react';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import type { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import type { EditorAppearance, UIComponentFactory } from '../../types';
import type { EventDispatcher } from '../../event-dispatcher';
import type EditorActions from '../../actions';
import type { DispatchAnalyticsEvent } from '@atlaskit/editor-common/analytics';
import { ACTION_SUBJECT } from '@atlaskit/editor-common/analytics';
import { whichTransitionEvent } from '../../utils';
import { ErrorBoundary } from '../ErrorBoundary';
import { MountPluginHooks } from './mount-plugin-hooks';
import type { ReactHookFactory } from '@atlaskit/editor-common/types';

const pluginsComponentsWrapper = css`
  display: flex;
`;

export interface Props {
  items?: UIComponentFactory[];
  pluginHooks?: ReactHookFactory[];
  editorView?: EditorView;
  editorActions?: EditorActions;
  eventDispatcher?: EventDispatcher;
  providerFactory: ProviderFactory;
  appearance?: EditorAppearance;
  popupsMountPoint?: HTMLElement;
  popupsBoundariesElement?: HTMLElement;
  popupsScrollableElement?: HTMLElement;
  containerElement: HTMLElement | null;
  disabled: boolean;
  dispatchAnalyticsEvent?: DispatchAnalyticsEvent;
  contentArea?: HTMLElement;
  wrapperElement: HTMLElement | null;
}

export default class PluginSlot extends React.Component<Props, any> {
  static displayName = 'PluginSlot';

  transitionEvent = whichTransitionEvent<'transitionend'>();

  shouldComponentUpdate(nextProps: Props) {
    const {
      editorView,
      editorActions,
      items,
      providerFactory,
      eventDispatcher,
      popupsMountPoint,
      popupsBoundariesElement,
      popupsScrollableElement,
      containerElement,
      disabled,
      wrapperElement,
    } = this.props;

    return !(
      nextProps.editorView === editorView &&
      nextProps.editorActions === editorActions &&
      nextProps.items === items &&
      nextProps.providerFactory === providerFactory &&
      nextProps.eventDispatcher === eventDispatcher &&
      nextProps.popupsMountPoint === popupsMountPoint &&
      nextProps.popupsBoundariesElement === popupsBoundariesElement &&
      nextProps.popupsScrollableElement === popupsScrollableElement &&
      nextProps.containerElement === containerElement &&
      nextProps.disabled === disabled &&
      nextProps.wrapperElement === wrapperElement
    );
  }

  componentDidMount() {
    this.addModeChangeListener(this.props.contentArea);
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    if (this.props.contentArea !== nextProps.contentArea) {
      this.removeModeChangeListener(this.props.contentArea);
      this.addModeChangeListener(nextProps.contentArea);
    }
  }

  componentWillUnmount() {
    this.removeModeChangeListener(this.props.contentArea);
  }

  forceComponentUpdate = (event: TransitionEvent): void => {
    // Only trigger an update if the transition is on a property containing `width`
    // This will cater for media and the content area itself currently.
    if (event.propertyName.includes('width')) {
      this.forceUpdate();
    }
  };

  removeModeChangeListener = (contentArea?: HTMLElement) => {
    if (contentArea && this.transitionEvent) {
      contentArea.removeEventListener(
        this.transitionEvent,
        this.forceComponentUpdate,
      );
    }
  };

  addModeChangeListener = (contentArea?: HTMLElement) => {
    if (contentArea && this.transitionEvent) {
      /**
       * Update the plugin components once the transition
       * to full width / default mode completes
       */
      contentArea.addEventListener(
        this.transitionEvent,
        this.forceComponentUpdate,
      );
    }
  };

  render() {
    const {
      items,
      editorView,
      editorActions,
      eventDispatcher,
      providerFactory,
      appearance,
      popupsMountPoint,
      popupsBoundariesElement,
      popupsScrollableElement,
      containerElement,
      disabled,
      dispatchAnalyticsEvent,
      wrapperElement,
      pluginHooks,
    } = this.props;

    if ((!items && !pluginHooks) || !editorView) {
      return null;
    }

    return (
      <ErrorBoundary
        component={ACTION_SUBJECT.PLUGIN_SLOT}
        fallbackComponent={null}
      >
        <MountPluginHooks
          editorView={editorView}
          pluginHooks={pluginHooks}
          containerElement={containerElement}
        />
        <div css={pluginsComponentsWrapper}>
          {items?.map((component, key) => {
            const props: any = { key };
            const element = component({
              editorView: editorView as EditorView,
              editorActions: editorActions as EditorActions,
              eventDispatcher: eventDispatcher as EventDispatcher,
              providerFactory,
              dispatchAnalyticsEvent,
              appearance: appearance!,
              popupsMountPoint,
              popupsBoundariesElement,
              popupsScrollableElement,
              containerElement,
              disabled,
              wrapperElement,
            });
            return element && React.cloneElement(element, props);
          })}
        </div>
      </ErrorBoundary>
    );
  }
}
