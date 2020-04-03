// There are cases where the context is not available, such as when a dropdown item is used
// inside @atlaskit/navigation. For this reason we have this helper function which safely calls
// the context functions if they are available.
export default (instance, contextKey) => (fnToCall, ...args) => {
  if (!instance.context[contextKey]) {
    return null;
  }

  return instance.context[contextKey][fnToCall](...args);
};
