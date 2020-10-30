import * as exenv from 'exenv';

class FakeKeyboardEvent {
  constructor(_: string, __: any) {}
}
class KeyboardEventWithKeyCode extends (exenv.canUseDOM
  ? KeyboardEvent
  : Object) {
  constructor(type: string, options: any) {
    super(type, options);
  }
}

const Class = exenv.canUseDOM
  ? KeyboardEventWithKeyCode
  : (FakeKeyboardEvent as any);

export default Class;
