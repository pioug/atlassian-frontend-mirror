import React, { useLayoutEffect, useRef, useState } from 'react';

import { bindAll } from 'bind-event-listener';

import type { ButtonProps } from '../../src';

export default function Example({
  Component,
}: {
  Component: ButtonProps['component'];
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
      { type: 'toggle-select', listener: toggleSelect },
      { type: 'toggle-disabled', listener: toggleDisabled },
    ]);
  }, []);

  return (
    // @ts-ignore
    <Component
      ref={ref}
      testId="my-button"
      isSelected={isSelected}
      isDisabled={isDisabled}
      data-is-selected={isSelected}
    >
      Hello world
    </Component>
  );
}
