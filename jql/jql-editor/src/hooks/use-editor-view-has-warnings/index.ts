import { di } from 'react-magnetic-di';

import { useExternalMessages, useHydratedDeprecations } from '../../state';

export const useEditorViewHasWarnings = (): boolean => {
	di(useHydratedDeprecations, useExternalMessages);

	const [hydratedDeprecations] = useHydratedDeprecations();
	const [{ warnings: externalWarnings }] = useExternalMessages();

	return hydratedDeprecations.length > 0 || externalWarnings.length > 0;
};
