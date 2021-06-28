import React, { useState } from 'react';

const { Provider, Consumer } = React.createContext<string | undefined>(
  undefined,
);

type Props = {
  nestedHeaderIds: string[];
  onNestedHeaderIdMatch: () => void;
};

/**
 * We need to expose this abstraction on top of the native Consumer in order to control when
 * The consumer will get notified when a match has happened. If we use the Consumer directly in
 * Expand components without this inner state, everytime a new prop comes in, and the `newActiveHeaderId`
 * is the same as before, we will set the expand to true forever, until the active header id changes.
 * Thus, the user won't be able to collapse the expand.
 *
 * By exposing `onNestedHeaderIdMatch` here we can control when will consumers be notified:
 * only when a `newActiveHeaderId` comes in from the Provider and the list of header ids includes it.
 */
const ActiveHeaderIdConsumer = ({
  nestedHeaderIds,
  onNestedHeaderIdMatch,
}: Props) => {
  const [activeHeaderId, setActiveHeaderId] = useState<string | undefined>();

  return (
    <Consumer>
      {(newActiveHeaderId) => {
        if (
          !newActiveHeaderId ||
          !nestedHeaderIds.includes(newActiveHeaderId)
        ) {
          setActiveHeaderId(undefined);
        } else if (
          newActiveHeaderId !== activeHeaderId &&
          nestedHeaderIds.includes(newActiveHeaderId)
        ) {
          setActiveHeaderId(newActiveHeaderId);
          onNestedHeaderIdMatch();
        }

        return null;
      }}
    </Consumer>
  );
};

export { Provider as ActiveHeaderIdProvider, ActiveHeaderIdConsumer };
