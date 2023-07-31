import { MockLinkPickerPlugin } from './mock-plugin';

export const getDefaultLinkPickerOptions = () => ({
  plugins: [new MockLinkPickerPlugin()],
});
