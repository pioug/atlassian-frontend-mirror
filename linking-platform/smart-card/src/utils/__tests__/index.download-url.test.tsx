import { skipAutoA11yFile } from '@atlassian/a11y-jest-testing';

import { downloadUrl } from '../index';

// This file exposes one or more accessibility violations. Testing is currently skipped but violations need to
// be fixed in a timely manner or result in escalation. Once all violations have been fixed, you can remove
// the next line and associated import. For more information, see go/afm-a11y-tooling:jest
skipAutoA11yFile();

const createIframe = (iframeName: string) => {
	let iframe = document.createElement('iframe');
	iframe.style.display = 'none';
	iframe.id = iframeName;
	iframe.name = iframeName;
	return iframe;
};

const createLink = (url: string, iframeName: string) => {
	const link = document.createElement('a');
	link.href = url;
	link.download = url;
	link.target = iframeName;
	return link;
};

describe('downloadUrl', () => {
	const url = 'some-url';
	const iframeName = 'media-download-iframe';

	let appendSpy: jest.SpyInstance;
	let removeSpy: jest.SpyInstance;

	const assertOnClick = (url?: string, target?: string) => (e: MouseEvent) => {
		const eventTarget = e.target as HTMLAnchorElement;
		expect(eventTarget?.tagName).toBe('A');
		expect(eventTarget?.getAttribute('href')).toBe(url);
		expect(eventTarget?.getAttribute('target')).toBe(target);
	};

	beforeEach(() => {
		document.body.innerHTML = '';
		appendSpy = jest.spyOn(document.body, 'appendChild');
		removeSpy = jest.spyOn(document.body, 'removeChild');
	});

	afterEach(() => {
		appendSpy.mockRestore();
		removeSpy.mockRestore();
		document.body.innerHTML = '';
	});

	it('creates a download anchor', async () => {
		const onClick = assertOnClick(url, iframeName);
		document.addEventListener('click', onClick);

		const iframe = createIframe(iframeName);
		document.body.appendChild(iframe);
		appendSpy.mockClear();

		const link = createLink(url, iframeName);

		await downloadUrl(url);

		expect(appendSpy).toHaveBeenCalledTimes(1);
		expect(appendSpy).toHaveBeenNthCalledWith(1, link);
		expect(removeSpy).toHaveBeenCalledTimes(1);
		expect(removeSpy).toHaveBeenNthCalledWith(1, link);
		expect(document.querySelectorAll('a').length).toBe(0);

		document.removeEventListener('click', onClick);
	});

	it('create an iframe if it does not already exist in document', async () => {
		const iframe = createIframe(iframeName);
		const link = createLink(url, iframeName);

		const onClick = assertOnClick(url, iframeName);
		document.addEventListener('click', onClick);

		await downloadUrl(url);

		expect(appendSpy).toHaveBeenCalledTimes(2);
		expect(appendSpy).toHaveBeenNthCalledWith(1, iframe);
		expect(appendSpy).toHaveBeenNthCalledWith(2, link);

		expect(removeSpy).toHaveBeenCalledTimes(1);
		expect(removeSpy).toHaveBeenNthCalledWith(1, link);
		expect(document.querySelectorAll('a').length).toBe(0);

		document.removeEventListener('click', onClick);
	});

	it('does not create a download anchor or iframe if there is no url', async () => {
		const onClick = jest.fn();
		document.addEventListener('click', onClick);

		await downloadUrl();

		expect(appendSpy).not.toHaveBeenCalled();
		expect(removeSpy).not.toHaveBeenCalled();
		expect(document.querySelectorAll('a').length).toBe(0);
		expect(onClick).not.toHaveBeenCalled();

		document.removeEventListener('click', onClick);
	});
});
