import { EventEmitter2 } from 'eventemitter2';
import {
  EventHandler,
  Lifecycle,
  LifecycleEvents,
} from '@atlaskit/collab-provider/types';

export class LifecycleImpl implements Lifecycle {
  private emitter = new EventEmitter2();

  on(event: LifecycleEvents, handler: EventHandler) {
    this.emitter.on(event, handler);
  }

  saveCollabChanges() {
    this.emitter.emit('save');
  }

  restoreCollabChanges() {
    this.emitter.emit('restore');
  }
}
