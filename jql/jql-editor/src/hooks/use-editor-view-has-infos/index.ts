import { di } from 'react-magnetic-di';

import { useExternalMessages } from '../../state';

export const useEditorViewHasInfos = (): boolean => {
	di(useExternalMessages);

	const [{ infos: externalInfos }] = useExternalMessages();

	return externalInfos.length > 0;
};
