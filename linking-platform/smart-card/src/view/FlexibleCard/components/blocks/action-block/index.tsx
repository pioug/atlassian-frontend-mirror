import { Stack, xcss } from '@atlaskit/primitives';
import React, { useMemo } from 'react';
import { ActionName, SmartLinkSize } from '../../../../../constants';
import {
  useFlexibleUiContext,
  useFlexibleUiOptionContext,
} from '../../../../../state/flexible-ui-context';
import * as Actions from '../../actions';
import { getPrimitivesPaddingSpaceBySize } from '../../utils';
import { ActionBlockProps } from './types';

// We have to find a better way to ignore container padding
// This has become more and more of a common use case.
const ignoreContainerPaddingStyles = xcss({
  marginLeft: 'calc(var(--container-gap-left) * -1)',
  marginRight: 'calc(var(--container-gap-right) * -1)',
});

const ActionBlock: React.FC<ActionBlockProps> = ({
  blockRef,
  onClick: onClickCallback,
  size,
  sort,
  spaceInline,
  testId = 'smart-block-action',
}) => {
  const context = useFlexibleUiContext();
  const ui = useFlexibleUiOptionContext();

  const padding = !ui?.hidePadding
    ? getPrimitivesPaddingSpaceBySize(ui?.size || SmartLinkSize.Medium)
    : undefined;

  const actions = useMemo(() => {
    if (!context?.actions) {
      return;
    }

    const arr = Object.keys(context.actions) as ActionName[];

    if (sort) {
      arr.sort(sort);
    }

    return arr.map((name: ActionName) => {
      const Action =
        name in Actions ? Actions[name as keyof typeof Actions] : undefined;
      return Action ? (
        <Action
          as="stack-item"
          spaceInline={spaceInline}
          key={name}
          onClick={() => onClickCallback?.(name)}
          size={size}
          xcss={xcss({ paddingInline: padding })}
        />
      ) : null;
    });
  }, [context?.actions, onClickCallback, padding, size, sort, spaceInline]);

  return actions ? (
    <Stack
      grow="fill"
      xcss={ignoreContainerPaddingStyles}
      ref={blockRef}
      testId={testId}
    >
      {actions}
    </Stack>
  ) : null;
};

export default ActionBlock;
