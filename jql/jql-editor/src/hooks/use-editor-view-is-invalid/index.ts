import { useEffect, useState } from 'react';

import { di } from 'react-magnetic-di';

import { useEditorStateHasJqlError, useExternalMessages, useJqlError } from '../../state';

/**
 * Determine if the editor view should be displayed in an invalid state. To determine if the editor is invalid we adopt
 * the following rules:
 * 1. Client errors are dynamic
 *    a. If the user searches with invalid JQL then the invalid state is shown
 *    b. If the user fixes the error the invalid state is cleared until their next search
 * 2. External JQL errors are static
 *    a. If an external error is provided (and the previous search contains no client errors) then the invalid state is
 *    shown until their next search
 */
export const useEditorViewIsInvalid = (): boolean => {
	di(useJqlError, useExternalMessages, useEditorStateHasJqlError);

	const [jqlError] = useJqlError();
	const [{ errors: externalErrors }] = useExternalMessages();
	const [editorStateHasJqlError] = useEditorStateHasJqlError();

	// Determines if the last searched query contained an error that has not been fixed in the editor
	const [hasActiveError, setHasActiveError] = useState(false);

	const hasActiveExternalError = jqlError === null && externalErrors.length > 0;

	// Update hasActiveError whenever a query has been searched and the resulting jqlError has changed
	useEffect(() => {
		setHasActiveError(jqlError !== null);
	}, [jqlError]);

	// Set hasActiveError to false whenever the editor JQL is valid
	useEffect(() => {
		if (!editorStateHasJqlError) {
			setHasActiveError(false);
		}
	}, [editorStateHasJqlError]);

	return hasActiveError || hasActiveExternalError;
};
