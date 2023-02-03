import React, {
  useCallback,
  useRef,
  useState,
  Fragment,
  forwardRef,
} from 'react';
import { IntlProvider } from 'react-intl-next';
import Button from '@atlaskit/button';
import Popup, { PopupProps } from '@atlaskit/popup';
import { useSmartLinkLifecycleAnalytics } from '@atlaskit/link-analytics';
import { LinkPicker, LinkPickerProps } from '@atlaskit/link-picker';
import { MockLinkPickerPlugin } from '@atlaskit/link-test-helpers/link-picker';
import {
  createAndFireEvent,
  useAnalyticsEvents,
} from '@atlaskit/analytics-next';

import {
  FooterBlock,
  Card,
  SmartLinkSize,
  TitleBlock,
  ActionName,
} from '@atlaskit/smart-card';
import fetchMock from 'fetch-mock/cjs/client';
import { SmartCardProvider } from '@atlaskit/link-provider';

const OBJECT_RESOLVER_SERVICE_ENDPOINT = 'glob:*/gateway/api/object-resolver/*';

export const generateResolvedLink = (resourceUrl: string) => ({
  status: 200,
  body: {
    data: {
      '@context': {
        '@vocab': 'https://www.w3.org/ns/activitystreams#',
        atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
        schema: 'http://schema.org/',
      },
      '@type': ['atlassian:Task', 'Object'],
      'atlassian:priority': {
        '@type': 'Object',
        name: 'Minor',
      },
      generator: {
        '@id': 'https://www.atlassian.com/#Jira',
        '@type': 'Application',
        name: 'Jira',
      },
      url: resourceUrl,
      name: `(Mock) ${resourceUrl}`,
      summary:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus ullamcorper, orci ac posuere efficitur, diam nisl rutrum ex, eget rutrum lectus risus a dui.',
    },
    meta: {
      access: 'granted',
      auth: [],
      definitionId: 'jira-object-provider',
      key: 'jira-object-provider',
      product: 'jira',
      resourceType: 'issue',
    },
  },
});

fetchMock.post(
  OBJECT_RESOLVER_SERVICE_ENDPOINT,
  (_: any, opts: any) => {
    const reqs = JSON.parse(String(opts?.body) ?? '[]');

    if (!Array.isArray(reqs)) {
      throw new Error('Invalid request');
    }

    return Promise.resolve(
      reqs.map(req => generateResolvedLink(req?.resourceUrl ?? 'UNKNOWN')),
    );
  },
  {
    delay: 200,
  },
);

const SOME_CHANNEL = 'atlaskit';

const EditTrigger = forwardRef<HTMLDivElement>((props, ref) => {
  return <div ref={ref} {...props} style={{ float: 'right' }}></div>;
});

const LinkPickerPopup = ({
  isOpen,
  handleToggle,
  trigger,
  placement = 'bottom-start',
  ...props
}: {
  isOpen: boolean;
  handleToggle: () => void;
  trigger: PopupProps['trigger'];
  placement?: PopupProps['placement'];
} & Omit<LinkPickerProps, 'onCancel'>) => {
  return (
    <Popup
      isOpen={isOpen}
      autoFocus={false}
      onClose={handleToggle}
      content={({ update }) => (
        <LinkPicker
          onContentResize={update}
          onCancel={handleToggle}
          {...props}
        />
      )}
      placement={placement}
      trigger={trigger}
    />
  );
};

function LifecycleAnalytics() {
  const [isOpen, setIsOpen] = useState(false);
  const [editingLink, setEditLink] = useState<string | null>(null);

  const [links, setLinks] = useState<{ id: string; url: string }[]>([
    { id: `${Date.now()}`, url: 'https://atlassian.com' },
  ]);

  const { createAnalyticsEvent } = useAnalyticsEvents();
  const linkAnalytics = useSmartLinkLifecycleAnalytics();

  const handleToggle = useCallback(() => setIsOpen(prev => !prev), [setIsOpen]);

  const handleSubmit: LinkPickerProps['onSubmit'] = useCallback(
    (payload, analytic) => {
      setLinks(prev => [...prev, { id: `${Date.now()}`, url: payload.url }]);
      // Provide link picker payload and event directly from link picker `onSubmit` handler
      linkAnalytics.linkCreated(payload, analytic);
      setIsOpen(false);
    },
    [setLinks, linkAnalytics],
  );

  const handleEdit = useCallback(
    (
      payload: Parameters<LinkPickerProps['onSubmit']>[0],
      analytic: Parameters<LinkPickerProps['onSubmit']>[1],
      id: string,
    ) => {
      setLinks(prev => {
        const cloned = [...prev];
        const index = prev.findIndex(link => link.id === id);
        const updated = {
          ...prev[index],
          url: payload.url,
        };
        cloned.splice(index, 1, updated);
        return cloned;
      });
      linkAnalytics.linkUpdated(payload, analytic);
      setEditLink(null);
    },
    [setLinks, linkAnalytics],
  );

  const handleDelete = useCallback(
    (id: string, url: string) => {
      setLinks(prev => prev.filter(({ id: _id }) => id !== _id));
      // Fire product event
      const analytic = createAndFireEvent(SOME_CHANNEL)({
        actionSubject: 'shortcutslink',
        action: 'deleted',
      })(createAnalyticsEvent);
      // Provide event to analytics handler to track link deletion
      linkAnalytics.linkDeleted({ url }, analytic);
    },
    [setLinks, createAnalyticsEvent, linkAnalytics],
  );

  const plugins = useRef([new MockLinkPickerPlugin()]);

  return (
    <div className="example" style={{ padding: 50 }}>
      <IntlProvider locale="en">
        <div style={{ margin: '0 auto', maxWidth: 800 }}>
          <div style={{ marginBottom: 32 }}>
            {links.map(({ id, url }) => (
              <Fragment key={id}>
                <Card
                  appearance="block"
                  url={url}
                  onClick={e => {
                    e.preventDefault();
                  }}
                  ui={{
                    clickableContainer: true,
                    size: SmartLinkSize.Large,
                  }}
                >
                  <TitleBlock />
                  <FooterBlock
                    actions={[
                      {
                        name: ActionName.EditAction,
                        onClick: () => setEditLink(id),
                        size: SmartLinkSize.XLarge,
                      },
                      {
                        name: ActionName.DeleteAction,
                        onClick: () => handleDelete(id, url),
                        size: SmartLinkSize.XLarge,
                      },
                    ]}
                  />
                </Card>
                {editingLink === id && (
                  <LinkPickerPopup
                    onSubmit={(payload, analytic) =>
                      handleEdit(payload, analytic, id)
                    }
                    isOpen={true}
                    handleToggle={() => setEditLink(id)}
                    plugins={plugins.current}
                    url={links.find(link => link.id === id)?.url}
                    placement="bottom-end"
                    trigger={({ ref, ...triggerProps }) => (
                      <EditTrigger ref={ref} {...triggerProps} />
                    )}
                  />
                )}
              </Fragment>
            ))}
          </div>
          <LinkPickerPopup
            onSubmit={handleSubmit}
            isOpen={isOpen}
            handleToggle={handleToggle}
            plugins={plugins.current}
            trigger={({ ref, ...triggerProps }) => (
              <Button
                {...triggerProps}
                ref={ref}
                appearance="primary"
                isSelected={isOpen}
                onClick={handleToggle}
              >
                Add Link
              </Button>
            )}
          />
        </div>
      </IntlProvider>
    </div>
  );
}

export default function LifecycleAnalyticsWithProvider() {
  return (
    <SmartCardProvider>
      <LifecycleAnalytics />
    </SmartCardProvider>
  );
}
