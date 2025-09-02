// hello.atlassian.net cloud id
const HELLO_CLOUD_ID = 'a436116f-02ce-4520-8fbb-7301462a1674';

// spike page https://hello.atlassian.net/wiki/spaces/~7120208ef57ce4d614485e876489301a16b906/pages/5626233808
const TEST_PAGE_ID = '5626233808';

export const getPageId = () => {
	return (
		// eslint-disable-next-line require-unicode-regexp
		window.location.href.match(/pageId=(\d+)/)?.[1] ||
		// eslint-disable-next-line require-unicode-regexp
		window.location.href.match(/pages\/edit-v2\/(\d+)/)?.[1] ||
		// eslint-disable-next-line require-unicode-regexp
		window.location.pathname.match(/pages\/(\d+)/)?.[1] || // view page or live doc
		TEST_PAGE_ID
	);
};

interface CustomWindow {
	__INITIAL_STATE__?: {
		meta?: {
			'cloud-id'?: string;
		};
	};
}

/**
 * This by no means is a stable way to get the cloud id, but it works for now.
 * We should switch passing the cloud id from Confluence to a Editor plugin,
 * for instance the user preferences plugin would have a seperate place for user and cloud info
 * @returns the cloud id from the initial state
 */
export const getCloudId = () => {
	return (window as CustomWindow).__INITIAL_STATE__?.meta?.['cloud-id'] || HELLO_CLOUD_ID;
};
