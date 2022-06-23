import React, { useLayoutEffect, useRef, useState } from 'react';

import { bindAll } from 'bind-event-listener';

type ItemComponentProps =
  | React.ComponentType<React.AllHTMLAttributes<HTMLElement>>
  | React.ElementType;

export default function Example({
  Component,
  displayName,
}: {
  Component: ItemComponentProps;
  displayName: string;
}) {
  const [isSelected, setIsSelected] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    function toggleSelect() {
      setIsSelected((value) => !value);
    }
    function toggleDisabled() {
      setIsDisabled((value) => !value);
    }

    const el: HTMLElement | null = ref.current;
    if (!el) {
      throw new Error('Could not find button ref');
    }

    return bindAll(el, [
      {
        type: 'toggle-select',
        listener: toggleSelect,
      },
      {
        type: 'toggle-disabled',
        listener: toggleDisabled,
      },
    ]);
  }, []);

  return (
    <Component
      ref={ref}
      testId="menu-item"
      isSelected={isSelected}
      isDisabled={isDisabled}
    >
      {displayName}
    </Component>
  );
}
