import React from 'react';
import { PureComponent } from 'react';
import { MentionProvider } from '@atlaskit/mention/resource';
import { ResourcedMention } from '@atlaskit/mention/element';
import {
  ProviderFactory,
  WithProviders,
} from '@atlaskit/editor-common/provider-factory';
import type { Providers } from '@atlaskit/editor-common/provider-factory';
import type { MentionEventHandlers } from '@atlaskit/editor-common/ui';
import { browser } from '@atlaskit/editor-common/utils';
import { refreshBrowserSelection } from '../../../code-block/refresh-browser-selection';

export interface MentionProps {
  id: string;
  providers?: ProviderFactory;
  eventHandlers?: MentionEventHandlers;
  text: string;
  accessLevel?: string;
}

export default class Mention extends PureComponent<MentionProps, {}> {
  static displayName = 'Mention';

  private providerFactory: ProviderFactory;

  constructor(props: MentionProps) {
    super(props);
    this.providerFactory = props.providers || new ProviderFactory();
  }

  componentDidMount() {
    // Workaround an issue where the selection is not updated immediately after adding
    // a mention when "sanitizePrivateContent" is enabled in the editor on safari.
    // This affects both insertion and paste behaviour it is applied to the component.
    // https://product-fabric.atlassian.net/browse/ED-14859
    if (browser.safari) {
      setTimeout(refreshBrowserSelection, 0);
    }
  }

  componentWillUnmount() {
    if (!this.props.providers) {
      // new ProviderFactory is created if no `providers` has been set
      // in this case when component is unmounted it's safe to destroy this providerFactory
      this.providerFactory.destroy();
    }
  }

  private renderWithProvider = (providers: Providers) => {
    const { accessLevel, eventHandlers, id, text } = this.props;
    const { mentionProvider } = providers as {
      mentionProvider?: Promise<MentionProvider>;
    };

    const actionHandlers: Record<string, any> = {};
    ['onClick', 'onMouseEnter', 'onMouseLeave'].forEach((handler) => {
      actionHandlers[handler] =
        (eventHandlers && (eventHandlers as any)[handler]) || (() => {});
    });

    return (
      <ResourcedMention
        id={id}
        text={text}
        accessLevel={accessLevel}
        mentionProvider={mentionProvider}
        {...actionHandlers}
      />
    );
  };

  render() {
    return (
      <WithProviders
        providers={['mentionProvider', 'profilecardProvider']}
        providerFactory={this.providerFactory}
        renderNode={this.renderWithProvider}
      />
    );
  }
}
