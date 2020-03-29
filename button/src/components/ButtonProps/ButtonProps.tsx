import { OnlyButtonProps } from '../../types';

// This file exists for extract-react-types. It is to work
// around extract-react-types not knowing how to extract the
// complex type that we use for ButtonProps.
// https://github.com/atlassian/extract-react-types/issues/59
// @ts-ignore
export default function(props: OnlyButtonProps) {
  throw Error(
    'this component should never be rendered. It is for dev purposes only. Please use the default export from `@atlaskit/button`',
  );
}
