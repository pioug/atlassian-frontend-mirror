import React from 'react';
import { RendererCssClassName } from '../../consts';
import { useSelectAllTrap } from '../utils/use-select-all-trap';

export default function Doc(props: any) {
  return <div className={RendererCssClassName.DOCUMENT}>{props.children}</div>;
}

export function DocWithSelectAllTrap(props: any) {
  return (
    <div
      ref={useSelectAllTrap<HTMLDivElement>()}
      className={RendererCssClassName.DOCUMENT}
    >
      {props.children}
    </div>
  );
}
