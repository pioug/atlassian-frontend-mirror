import { MockLinkPickerPlugin } from '@atlaskit/link-test-helpers/link-picker';

export const getDefaultLinkPickerOptions = () => ({
  plugins: [new MockLinkPickerPlugin()],
});
