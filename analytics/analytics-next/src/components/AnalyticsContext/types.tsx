import { AnalyticsReactContextInterface } from '@atlaskit/analytics-next-stable-react-context';

export type AnalyticsContextFunction = (
  props: {
    /** Children! */
    children: React.ReactNode;
    /** Arbitrary data. Any events created below this component in the tree will
     * have this added as an item in their context array. */
    data: Object;
  },
  context?: AnalyticsReactContextInterface,
) => JSX.Element;
