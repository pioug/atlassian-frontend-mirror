import React, { Component } from 'react';
import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/standard-button';
import Textfield from '@atlaskit/textfield';
import Lozenge from '@atlaskit/lozenge';

import Client, { PubSubClientConfig, SpecialEventType } from '../src';
import { FeatureFlags } from '../src/featureFlags';
import PubNubProtocol from '../src/protocols/pubnub';
import APSProtocol from '../src/protocols/aps';
import { APSTransportType } from '../src/apiTypes';

let clientConfig: { serviceConfig: PubSubClientConfig };
let defaultApsUrl: string;
let preferredApsTransport: APSTransportType;
try {
  // eslint-disable-next-line import/no-unresolved
  const localConfig = require('../local-config');
  clientConfig = localConfig['default'];
  defaultApsUrl = localConfig.apsParams.url;
  preferredApsTransport = localConfig.apsParams.preferredTransport;
} catch (e) {
  // eslint-disable-next-line import/no-unresolved
  const localConfig = require('../local-config-example');
  clientConfig = localConfig['default'];
  defaultApsUrl = localConfig.apsParams.url;
  preferredApsTransport = localConfig.apsParams.preferredTransport;
}

interface State {
  fpsUrl: string;
  apsUrl: string;
  channelInput: string;
  eventType: string;
  events: string[];
  status: string;
  protocols: ProtocolName[];
  client: Client;
}

type ProtocolName = 'PUBNUB' | 'APS';

class PubSubEventComponent extends Component<{}, State> {
  private readonly serviceConfig: PubSubClientConfig;

  constructor(props: any) {
    super(props);
    this.serviceConfig = clientConfig.serviceConfig;
    this.state = {
      fpsUrl: clientConfig.serviceConfig.url,
      apsUrl: defaultApsUrl,
      channelInput: 'ari:cloud:platform::site/666',
      eventType: 'avi:emoji-service:updated:emoji',
      events: [],
      status: 'NOT CONNECTED',
      protocols: ['PUBNUB', 'APS'],
      client: this.initClient(clientConfig.serviceConfig.url, defaultApsUrl, [
        'PUBNUB',
        'APS',
      ]),
    };
  }

  toggleProtocol = (protocol: ProtocolName) => {
    const protocols = this.state.protocols;
    let newProtocols: ProtocolName[];

    if (this.usesProtocol(protocol)) {
      newProtocols = protocols.filter((p) => p !== protocol);
    } else {
      newProtocols = [...protocols, protocol];
    }

    this.setState({
      protocols: newProtocols,
      client: this.initClient(
        this.state.fpsUrl,
        this.state.apsUrl,
        newProtocols,
      ),
    });
  };

  usesProtocol = (protocol: ProtocolName) =>
    this.state.protocols.includes(protocol);

  onJoin = () => {
    this.state.client.join([this.state.channelInput]);
  };

  onLeave = () => {
    this.state.client.leave([this.state.channelInput]);
  };

  onNetworkUp = () => {
    this.state.client.networkUp();
  };

  onNetworkDown = () => {
    this.state.client.networkDown();
  };

  onChannelChange = (e: React.FormEvent<HTMLInputElement>) => {
    this.setState({
      channelInput: e.currentTarget.value,
    });
  };

  onUrlChange = (e: React.FormEvent<HTMLInputElement>) => {
    const newUrl = e.currentTarget.value;

    this.setState({
      fpsUrl: newUrl,
      client: this.initClient(newUrl, this.state.apsUrl, this.state.protocols),
    });
  };

  onEventTypeChange = (e: React.FormEvent<HTMLInputElement>) => {
    this.setState({
      eventType: e.currentTarget.value,
    });
  };

  onSubscribe = () => {
    this.state.client.on(this.state.eventType, this.onEvent);
  };

  onUnsubscribe = () => {
    this.state.client.off(this.state.eventType, this.onEvent);
  };

  onEvent = (event: any, msg: any) => {
    this.setState(({ events }) => {
      return {
        events: [...events, `${event}:${msg}`],
      };
    });
  };

  updateStatus = (status: string) => {
    this.setState({
      status,
    });
  };

  private initClient = (
    fpsUrl: string,
    apsUrl: string,
    protocols: ProtocolName[],
  ): Client => {
    this.setState({
      status: 'NOT CONNECTED',
    });

    const protocolsMap = {
      PUBNUB: new PubNubProtocol(
        new FeatureFlags(this.serviceConfig.featureFlags),
      ),
      APS: new APSProtocol(
        apsUrl ? new URL(apsUrl) : undefined,
        preferredApsTransport,
      ),
    };

    const usedProtocols = protocols.map((protocol) => protocolsMap[protocol]);

    const client = new Client(
      { ...this.serviceConfig, url: fpsUrl },
      usedProtocols,
    );

    client.on(SpecialEventType.CONNECTED, () => this.updateStatus('CONNECTED'));

    return client;
  };

  render() {
    return (
      <div>
        <h2>Config</h2>

        <label>Service</label>
        <Textfield
          id="serviceUrl"
          label="Service"
          onChange={this.onUrlChange}
          value={this.state.fpsUrl}
        />
        <label>Protocols</label>
        <div>
          <ButtonGroup>
            <Button
              id="pubnubProtocol"
              onClick={() => this.toggleProtocol('PUBNUB')}
              appearance={this.usesProtocol('PUBNUB') ? 'primary' : undefined}
            >
              PubNub
            </Button>
            <Button
              id="apsProtocol"
              onClick={() => this.toggleProtocol('APS')}
              appearance={this.usesProtocol('APS') ? 'primary' : undefined}
            >
              APS
            </Button>
          </ButtonGroup>
          {this.usesProtocol('APS') && (
            <div>
              <label>APS URL</label>
              <Textfield
                id="apsURL"
                label="APS URL"
                value={this.state.apsUrl}
              />
            </div>
          )}
        </div>
        <label>Channel</label>
        <Textfield
          id="channel"
          label="Channel"
          onChange={this.onChannelChange}
          value={this.state.channelInput}
        />
        <ButtonGroup>
          <Button onClick={this.onJoin}>Join</Button>
          <Button onClick={this.onLeave}>Leave</Button>
          <Lozenge appearance="success">{this.state.status}</Lozenge>
        </ButtonGroup>
        <div>
          <label>Event type</label>
          <Textfield
            id="eventType"
            label="Event type"
            onChange={this.onEventTypeChange}
            value={this.state.eventType}
          />
        </div>
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
