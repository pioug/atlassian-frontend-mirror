import React, { type PropsWithChildren } from 'react';
import { useCallback } from 'react';
import Button from '@atlaskit/button/new';

export function TabLink({ tabId, children }: PropsWithChildren<{ tabId: string }>) {
	const handleClick = useCallback(() => {
		// eslint-disable-next-line @atlaskit/platform/no-direct-document-usage
		const tabElem = document.querySelector(`[data-tab-id="${tabId}"]`) as HTMLButtonElement;
		tabElem?.scrollIntoView();
		tabElem?.click();
	}, [tabId]);

	return <Button onClick={handleClick}>{children}</Button>;
}
