import React from 'react';
import { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { EditorView } from 'prosemirror-view';
import { useSmartLinkLifecycleAnalytics } from '@atlaskit/link-analytics';
import { INPUT_METHOD, ACTION } from '@atlaskit/editor-common/analytics';
import { AnalyticsContext, UIAnalyticsEvent } from '@atlaskit/analytics-next';

import { registerSmartCardEventsNext } from '../pm-plugins/actions';
import { SmartLinkEventsNext, Metadata, UpdateMetadata } from '../types';
import { getAnalyticsEditorAppearance } from '@atlaskit/editor-common/utils';
import { getPluginState } from '../pm-plugins/util/state';

type AnalyticsBindingsProps = { editorView: EditorView };

type LinkEventMetadata = {
  action?: string;
  inputMethod?: string;
  sourceEvent?: unknown;
  isRedo?: boolean;
  isUndo?: boolean;
};

/**
 * If the metadata is for a history event,
 * returns undo/redo instead of instead of what fn(metadata) would have otherwise
 * returned
 */
const withHistoryMethod = <T extends LinkEventMetadata>(
  fn: (metadata: T) => string | undefined,
) => {
  return (metadata: T) => {
    const { isUndo, isRedo } = metadata;
    if (isUndo) {
      return 'undo';
    }
    if (isRedo) {
      return 'redo';
    }
    return fn(metadata);
  };
};

const getMethod = withHistoryMethod(({ inputMethod }: LinkEventMetadata) => {
  switch (inputMethod) {
    case INPUT_METHOD.CLIPBOARD:
      return 'editor_paste';
    case INPUT_METHOD.FLOATING_TB:
      return 'editor_floatingToolbar';
    case INPUT_METHOD.AUTO_DETECT:
    case INPUT_METHOD.FORMATTING:
      return 'editor_type';
    default:
      return 'unknown';
  }
});

const getUpdateType = withHistoryMethod(
  ({ action }: Metadata<UpdateMetadata>) => {
    switch (action) {
      case ACTION.CHANGED_TYPE:
        return 'display_update';
      case ACTION.UPDATED:
        return 'link_update';
      default:
        return 'unknown';
    }
  },
);

const getDeleteType = withHistoryMethod(({ action }: LinkEventMetadata) => {
  if (action === ACTION.UNLINK) {
    return 'unlink';
  }
  return 'delete';
});

const getSourceEventFromMetadata = (metadata: LinkEventMetadata) => {
  return metadata.sourceEvent instanceof UIAnalyticsEvent
    ? metadata.sourceEvent
    : null;
};

/**
 * Set display category as `link` if not displaying the link as a smart card
 */
const displayCategoryFromDisplay = (display: string) => {
  if (display === 'url') {
    return 'link';
  }
};

/**
 * Binds the @atlaskit/link-analytics callbacks
 * to the editor card plugin state events callbacks interfaces
 */
export const EventsBinding = ({ editorView }: AnalyticsBindingsProps) => {
  /**
   * These callbacks internally use window.requestIdleCallback/requestAnimationFrame
   * to defer any heavy operations involving network
   *
   * The callbacks themselves should not be deferred, they should be called syncronously the moment
   * the events take place.
   */
  const { linkCreated, linkUpdated, linkDeleted } =
    useSmartLinkLifecycleAnalytics();

  const events: SmartLinkEventsNext = useMemo(() => {
    return {
      created: (metadata) => {
        const { url, display, nodeContext } = metadata;
        const displayCategory = displayCategoryFromDisplay(display);
        const sourceEvent = getSourceEventFromMetadata(metadata);
        const creationMethod = getMethod(metadata);

        linkCreated({ url, displayCategory }, sourceEvent, {
          display,
          nodeContext,
          creationMethod,
        });
      },
      updated: (metadata) => {
        const { url, display, previousDisplay, nodeContext } = metadata;
        const displayCategory = displayCategoryFromDisplay(display);
        const sourceEvent = getSourceEventFromMetadata(metadata);
        const updateMethod = getMethod(metadata);
        const updateType = getUpdateType(metadata);

        linkUpdated({ url, displayCategory }, sourceEvent, {
          display,
          previousDisplay,
          nodeContext,
          updateMethod,
          updateType,
        });
      },
      deleted: (metadata) => {
        const { url, display, nodeContext } = metadata;
        const displayCategory = displayCategoryFromDisplay(display);
        const sourceEvent = getSourceEventFromMetadata(metadata);
        const deleteMethod = getMethod(metadata);
        const deleteType = getDeleteType(metadata);

        linkDeleted({ url, displayCategory }, sourceEvent, {
          display,
          nodeContext,
          deleteMethod,
          deleteType,
        });
      },
    };
  }, [linkCreated, linkUpdated, linkDeleted]);

  useEffect(() => {
    editorView.dispatch(
      registerSmartCardEventsNext(events)(editorView.state.tr),
    );
  }, [events, editorView]);

  return null;
};

export class EditorSmartCardEventsNext extends React.PureComponent<AnalyticsBindingsProps> {
  static contextTypes = {
    contextAdapter: PropTypes.object,
  };

  render() {
    const cardContext = this.context.contextAdapter.card;

    /**
     * The analytics hook needs to be able to communicate with the card context
     * If we can't access it, don't mount the event bindings
     * This effectively entirely disables all tracking behaviour
     */
    if (!cardContext) {
      return null;
    }

    const editorAppearance = getPluginState(
      this.props.editorView.state,
    )?.editorAppearance;
    const analyticsEditorAppearance =
      getAnalyticsEditorAppearance(editorAppearance);

    const analyticsData = {
      attributes: {
        location: analyticsEditorAppearance,
      },
      // Below is added for the future implementation of Linking Platform namespaced analytic context
      location: analyticsEditorAppearance,
    };

    return (
      <cardContext.Provider value={cardContext.value}>
        <AnalyticsContext data={analyticsData}>
          <EventsBinding {...this.props} />
        </AnalyticsContext>
      </cardContext.Provider>
    );
  }
}
