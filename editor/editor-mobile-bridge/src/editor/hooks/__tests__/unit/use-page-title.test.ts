import { renderHook } from '@testing-library/react-hooks';
import { EditorProps } from '@atlaskit/editor-core';
import { usePageTitle } from '../../../hooks/use-page-title';
import WebBridgeImpl from '../../../native-to-web';

jest.mock('../../../native-to-web');

describe('use Page Title', () => {
  it('should not call setTitle when collabEdit is undefined', () => {
    const bridge = new WebBridgeImpl();
    renderHook(() => usePageTitle(bridge, undefined));
    expect(bridge.setTitle).not.toHaveBeenCalled();
  });

  it('should call setTitle when collabEdit is passed', () => {
    const bridge = new WebBridgeImpl();
    const collabEdit = { provider: {} } as EditorProps['collabEdit'];
    renderHook(() => usePageTitle(bridge, collabEdit));
    expect(bridge.setTitle).not.toHaveBeenCalled();
  });
});
