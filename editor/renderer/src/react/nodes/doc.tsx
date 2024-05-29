import React from 'react';
import { RendererCssClassName } from '../../consts';
import { useSelectAllTrap } from '../utils/use-select-all-trap';

export default function Doc(props: any) {
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
  return <div className={RendererCssClassName.DOCUMENT}>{props.children}</div>;
}

export function DocWithSelectAllTrap(props: any) {
  return (
    <div
      ref={useSelectAllTrap<HTMLDivElement>()}
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
      className={RendererCssClassName.DOCUMENT}
    >
      {props.children}
    </div>
  );
}
