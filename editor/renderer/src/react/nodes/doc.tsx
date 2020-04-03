import React from 'react';
import { RendererCssClassName } from '../../consts';

export default function Doc(props: React.Props<any>) {
  return <div className={RendererCssClassName.DOCUMENT}>{props.children}</div>;
}
