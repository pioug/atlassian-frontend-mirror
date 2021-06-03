import {
  withAnalyticsContext,
  withAnalyticsEvents,
} from '@atlaskit/analytics-next';

export const navigationChannel = 'navigation';

const getDisplayName = (component) =>
  component ? component.displayName || component.name : undefined;

const kebabToCamelCase = (str) =>
  `${str}`.replace(/-([a-z])/gi, (g) => g[1].toUpperCase());

export const navigationItemClicked = (
  Component,
  componentName,
  useActionSubjectId = false,
) => {
  return withAnalyticsContext({
    componentName,
  })(
    withAnalyticsEvents({
      onClick: (createAnalyticsEvent, props) => {
        const id = kebabToCamelCase(props.id);
        const basePayload = {
          action: 'clicked',
          actionSubject: 'navigationItem',
          attributes: {
            componentName,
            iconSource:
              getDisplayName(props.icon) || getDisplayName(props.before),
            navigationItemIndex: props.index,
          },
        };

        let payload;
        if (useActionSubjectId) {
          payload = {
            ...basePayload,
            actionSubjectId: id,
          };
        } else {
          const { attributes, ...basePayloadSansAttributes } = basePayload;
          payload = {
            ...basePayloadSansAttributes,
            attributes: { ...attributes, itemId: id },
          };
        }
        const event = createAnalyticsEvent(payload);

        event.fire(navigationChannel);

        return null;
      },
    })(Component),
  );
};

export const navigationUILoaded = (createAnalyticsEvent, { layer }) =>
  createAnalyticsEvent({
    action: 'initialised',
    actionSubject: 'navigationUI',
    actionSubjectId: layer,
    eventType: 'operational',
  }).fire(navigationChannel);

export const navigationExpandedCollapsed = (
  createAnalyticsEvent,
  { isCollapsed, trigger },
) =>
  createAnalyticsEvent({
    action: isCollapsed ? 'collapsed' : 'expanded',
    actionSubject: 'productNavigation',
    attributes: {
      trigger,
    },
  }).fire(navigationChannel);
