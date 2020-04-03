/*
The matchEvent method is responsible for deciding whether a Decorator or
Listener should take action based on the event name and the `match` prop.
*/

const ENDS_WITH_DOT = /\.$/;

function matchEvent(matcher, name) {
  if (matcher === '*' || name === undefined) {
    return true;
  }
  if (typeof matcher === 'string') {
    if (ENDS_WITH_DOT.test(matcher)) {
      return name.substr(0, matcher.length) === matcher;
    }
    return name === matcher;
  }
  if (typeof matcher === 'function') {
    return matcher(name);
  }
  if (matcher instanceof RegExp) {
    return matcher.test(name);
  }
  return false;
}

export default matchEvent;
