import { ReactNode } from 'react';

import { CodeBidiWarningConfig, RefractorNode } from '../../types';

import createElement from './create-element';

export default function createChildren(
  codeBidiWarningConfig: CodeBidiWarningConfig,
): (children: RefractorNode[]) => ReactNode[] {
  let childrenCount = 0;

  return (children: RefractorNode[]) => {
    childrenCount += 1;
    return children.map((child: RefractorNode, i: number) =>
      createElement({
        node: child,
        codeBidiWarningConfig,
        key: `code-segment-${childrenCount}-${i}`,
      }),
    );
  };
}
