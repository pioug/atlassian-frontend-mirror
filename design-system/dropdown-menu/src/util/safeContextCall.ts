type ContextKey = string;

interface Instance {
  context: Record<string, Record<string, (...args: any[]) => string>>; // TODO: Does this return a string?
}

// There are cases where the context is not available, such as when a dropdown item is used
// inside @atlaskit/navigation. For this reason we have this helper function which safely calls
// the context functions if they are available.
export default (instance: Instance, contextKey: ContextKey) => (
  fnToCall: string,
  ...args: Array<any>
) => {
  if (!instance.context[contextKey]) {
    return null;
  }

  return instance.context[contextKey][fnToCall](...args);
};
