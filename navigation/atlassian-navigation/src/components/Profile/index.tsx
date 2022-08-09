import { IconButton } from '../IconButton';
import { IconButtonProps } from '../IconButton/types';

/**
 * __Profile__
 *
 * A profile button which takes an icon/avatar component can be that can be
 * passed into `AtlassianNavigation`'s `renderProfile` prop.
 *
 * - [Examples](https://atlassian.design/components/atlassian-navigation/examples#profile)
 * - [Code](https://atlassian.design/components/atlassian-navigation/code)
 */
export const Profile = IconButton;

// This exists only to extract props.
// eslint-disable-next-line @repo/internal/react/use-noop
export default (props: IconButtonProps) => {};
