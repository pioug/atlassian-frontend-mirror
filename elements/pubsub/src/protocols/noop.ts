import { Protocol, ProtocolConfig } from '../types';
import { OnEvent } from '../apiTypes';
import { EventType } from '../types';

export default class NoopProtocol implements Protocol {
  getType(): string {
    return 'noop';
  }

  subscribe(_: ProtocolConfig): void {}

  unsubscribeAll(): void {}

  getCapabilities(): string[] {
    return [];
  }

  on(_event: EventType, _handler: OnEvent): void {}

  off(_event: EventType, _handler: OnEvent): void {}

  networkUp(): void {}

  networkDown(): void {}
}
