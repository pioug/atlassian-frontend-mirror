import React from 'react';
import { Component } from 'react';
import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/standard-button';
import FieldText from '@atlaskit/field-text';
import Lozenge from '@atlaskit/lozenge';

import Client, { PubSubClientConfig, SpecialEventType } from '../src';

let clientConfig: { serviceConfig: PubSubClientConfig };
try {
  // eslint-disable-next-line import/no-unresolved
  clientConfig = require('../local-config')['default'];
} catch (e) {
  clientConfig = require('../local-config-example')['default'];
}

interface State {
  url: string;
  channelInput: string;
  eventType: string;
  events: string[];
  status: string;
}

class PubSubEventComponent extends Component<{}, State> {
  private client!: Client;
  private serviceConfig: PubSubClientConfig;

  constructor(props: any) {
    super(props);
    this.serviceConfig = clientConfig.serviceConfig;
    this.state = {
      url: clientConfig.serviceConfig.url,
      channelInput: 'ari:cloud:platform::site/666',
      eventType: 'avi:emoji-service:updated:emoji',
      events: [],
      status: 'NOT CONNECTED',
    };
    this.initClient(clientConfig.serviceConfig.url);
  }

  onJoin = () => {
    this.client.join([this.state.channelInput]);
  };

  onLeave = () => {
    this.client.leave([this.state.channelInput]);
  };

  onNetworkUp = () => {
    this.client.networkUp();
  };

  onNetworkDown = () => {
    this.client.networkDown();
  };

  onChannelChange = (e: React.FormEvent<HTMLInputElement>) => {
    this.setState({
      channelInput: e.currentTarget.value,
    });
  };

  onUrlChange = (e: React.FormEvent<HTMLInputElement>) => {
    const newUrl = e.currentTarget.value;
    this.setState({
      url: e.currentTarget.value,
    });

    this.client.leave([this.state.channelInput]).then((_) => {
      this.initClient(newUrl);
    });
  };

  onEventTypeChange = (e: React.FormEvent<HTMLInputElement>) => {
    this.setState({
      eventType: e.currentTarget.value,
    });
  };

  onSubscribe = () => {
    this.client.on(this.state.eventType, this.onEvent);
  };

  onUnsubscribe = () => {
    this.client.off(this.state.eventType, this.onEvent);
  };

  onEvent = (event: any, _: any) => {
    this.setState(({ events }) => {
      return {
        events: [...events, event],
      };
    });
  };

  updateStatus = (status: string) => {
    this.setState({
      status,
    });
  };

  private initClient = (url: string) => {
    this.setState({
      status: 'NOT CONNECTED',
    });

    this.client = new Client({ ...this.serviceConfig, url });
    this.client.on(SpecialEventType.CONNECTED, () =>
      this.updateStatus('CONNECTED'),
    );
  };

  render() {
    return (
      <div>
        <h2>Config</h2>
        <FieldText
          id="serviceUrl"
          label="Service"
          onChange={this.onUrlChange}
          value={this.state.url}
          shouldFitContainer
        />

        <FieldText
          id="channel"
          label="Channel"
          onChange={this.onChannelChange}
          value={this.state.channelInput}
          shouldFitContainer
        />
        <ButtonGroup>
          <Button onClick={this.onJoin}>Join</Button>
          <Button onClick={this.onLeave}>Leave</Button>
          <Lozenge appearance="success">{this.state.status}</Lozenge>
        </ButtonGroup>

        <FieldText
          id="eventType"
          label="Event type"
          onChange={this.onEventTypeChange}
          value={this.state.eventType}
          shouldFitContainer
        />
        <ButtonGroup>
          <Button id="subscribe" onClick={this.onSubscribe}>
            Subscribe
          </Button>
          <Button id="unsubscribe" onClick={this.onUnsubscribe}>
            Unsubscribe
          </Button>
        </ButtonGroup>

        <ButtonGroup>
          <Button id="networkUp" onClick={this.onNetworkUp}>
            Network Up
          </Button>
          <Button id="networkDown" onClick={this.onNetworkDown}>
            Network Down
          </Button>
        </ButtonGroup>

        <h2>Events</h2>
        <div>Received {this.state.events.length} events.</div>
        <ol id="events">
          {this.state.events.map((event, index) => {
            return <li key={index}>{event}</li>;
          })}
        </ol>
      </div>
    );
  }
}

export default () => (
  <div>
    <PubSubEventComponent />
  </div>
);
