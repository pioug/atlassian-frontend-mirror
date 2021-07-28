import { sniffUserBrowserExtensions } from '../browser-extensions';

const createElement = ({
  tag,
  attribute,
}: {
  tag?: string;
  attribute?: string;
}) => {
  const elem = document.createElement(tag ?? 'div');
  if (attribute) {
    elem.setAttribute(attribute, 'true');
  }
  document.body.appendChild(elem);
};

const resetDom = () => (document.body.innerHTML = '');
const mockRequestAnimationFrame = () =>
  jest
    .spyOn(window, 'requestAnimationFrame')
    .mockImplementation((cb: Function) => cb());

describe('sniffUserBrowserExtensions', () => {
  describe('supported detectors', () => {
    describe('grammarly', () => {
      beforeEach(() => {
        resetDom();
        mockRequestAnimationFrame();
      });
      describe('synchronous checks', () => {
        it('should not include "grammarly" when does not exist', () => {
          const extensions = sniffUserBrowserExtensions({
            extensions: ['grammarly'],
          });
          expect(extensions).toEqual([]);
        });

        it('should include "grammarly" when grammarly-popups tag exists', () => {
          createElement({ tag: 'grammarly-popups' });
          const extensions = sniffUserBrowserExtensions({
            extensions: ['grammarly'],
          });
          expect(extensions).toEqual(['grammarly']);
        });

        it('should include "grammarly" when grammarly-extension tag exists', () => {
          createElement({ tag: 'grammarly-extension' });
          const extensions = sniffUserBrowserExtensions({
            extensions: ['grammarly'],
          });
          expect(extensions).toEqual(['grammarly']);
        });

        it('should include "grammarly" when data-grammarly-shadow-root attribute exists', () => {
          createElement({
            attribute: 'data-grammarly-shadow-root',
          });
          const extensions = sniffUserBrowserExtensions({
            extensions: ['grammarly'],
          });
          expect(extensions).toEqual(['grammarly']);
        });
      });
      describe('asynchronous checks', () => {
        it('should not include "grammarly" when "grammarly" when does not eventually exist', async () => {
          const extensions = await sniffUserBrowserExtensions({
            extensions: ['grammarly'],
            async: true,
            asyncTimeoutMs: 500,
          });
          expect(extensions).toEqual([]);
        });

        it('should not include "grammarly" when timeout elapses (before grammarly-extension tag exists)', async () => {
          setTimeout(() => createElement({ tag: 'grammarly-extension' }), 1000);
          const extensions = await sniffUserBrowserExtensions({
            extensions: ['grammarly'],
            async: true,
            asyncTimeoutMs: 500,
          });
          expect(extensions).toEqual([]);
        });

        it('should include "grammarly" when grammarly-popups tag already exists', async () => {
          createElement({ tag: 'grammarly-popups' });
          const extensions = await sniffUserBrowserExtensions({
            extensions: ['grammarly'],
            async: true,
            asyncTimeoutMs: 500,
          });
          expect(extensions).toEqual(['grammarly']);
        });

        it('should include "grammarly" when grammarly-popups tag eventually exists', async () => {
          setTimeout(() => createElement({ tag: 'grammarly-popups' }), 500);
          const extensions = await sniffUserBrowserExtensions({
            extensions: ['grammarly'],
            async: true,
            asyncTimeoutMs: 1000,
          });
          expect(extensions).toEqual(['grammarly']);
        });

        it('should include "grammarly" when grammarly-extension tag eventually exists', async () => {
          setTimeout(() => createElement({ tag: 'grammarly-extension' }), 500);
          const extensions = await sniffUserBrowserExtensions({
            extensions: ['grammarly'],
            async: true,
            asyncTimeoutMs: 1000,
          });
          expect(extensions).toEqual(['grammarly']);
        });

        it('should include "grammarly" when data-grammarly-shadow-root attribute eventually exists', async () => {
          setTimeout(
            () => createElement({ attribute: 'data-grammarly-shadow-root' }),
            500,
          );
          const extensions = await sniffUserBrowserExtensions({
            extensions: ['grammarly'],
            async: true,
            asyncTimeoutMs: 1000,
          });
          expect(extensions).toEqual(['grammarly']);
        });
      });
    });
  });
});
