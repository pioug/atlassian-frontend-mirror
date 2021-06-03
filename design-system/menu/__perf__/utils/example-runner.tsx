import React, { useLayoutEffect, useRef, useState } from 'react';

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

    el.addEventListener('toggle-select', toggleSelect);
    el.addEventListener('toggle-disabled', toggleDisabled);

    return () => {
      el.removeEventListener('toggle-select', toggleSelect);
      el.removeEventListener('toggle-disabled', toggleDisabled);
    };
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
