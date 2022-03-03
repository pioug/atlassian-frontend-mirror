import { useCallbackOne } from 'use-memo-one';

import { useAnalyticsEvents } from '@atlaskit/analytics-next';

const TAG_TYPE_KEY = '__TAG_TYPE__';
const BODY_KEY = '__BODY_KEY__';
const DATA_WRM_KEY = 'data-wrm-key';

export function loadResourceTags(
  tagsStrings: Array<string | undefined | null>,
  prepend: boolean,
): Promise<any> {
  const fragment = window.document.createDocumentFragment();
  const promises = tagsStrings.flatMap((tagsString) => {
    if (!tagsString) {
      return [];
    }
    return parseTags(tagsString).map(
      ({ src, href, ...attributes }) =>
        new Promise((resolve, reject) => {
          if (
            attributes[DATA_WRM_KEY] &&
            window.document.querySelector(
              `${attributes[TAG_TYPE_KEY]}[${DATA_WRM_KEY}='${attributes[DATA_WRM_KEY]}']`,
            )
          ) {
            resolve(null);
          } else {
            const tagElement = window.document.createElement(
              attributes[TAG_TYPE_KEY],
            );
            if (tagElement instanceof HTMLScriptElement) {
              tagElement.async = false;
              if (src && 'src' in tagElement) {
                tagElement.src = src.startsWith('//') ? `https:${src}` : src;
              }
            }
            if (tagElement instanceof HTMLLinkElement) {
              if (href) {
                tagElement.href = href.startsWith('//')
                  ? `https:${href}`
                  : href;
              }
            }
            tagElement.onload = resolve;
            tagElement.onerror = reject;
            if (attributes[BODY_KEY]) {
              tagElement.innerHTML = attributes[BODY_KEY];
            }
            Object.keys(attributes).forEach((attributeKey) => {
              if (attributeKey !== TAG_TYPE_KEY && attributeKey !== BODY_KEY) {
                tagElement.setAttribute(attributeKey, attributes[attributeKey]);
              }
            });
            fragment.appendChild(tagElement);
          }
        }),
    );
  });

  if (prepend) {
    document.head.prepend(fragment);
  } else {
    document.head.appendChild(fragment);
  }

  return Promise.all(promises);
}

const SCRIPT_REGEX = /<(script|link)([^>]*)(?:>([^]*?)<\/\1>|\/*>\n)/gi;
const QUOTES_REGEX = /^(["']*)(?<value>.*?)\1$/;
const SPACE_REGEX = /\s+/;

function parseTags(tagsString: string): { [key: string]: string }[] {
  if (typeof tagsString !== 'string') {
    return [];
  }

  const result: { [key: string]: string }[] = [];
  for (const [, tagType, attributes, body] of tagsString.matchAll(
    SCRIPT_REGEX,
  )) {
    let tag = Object.fromEntries(
      attributes
        .split(SPACE_REGEX)
        .filter((pair) => pair)
        .map((pair) => {
          const pos = pair.indexOf('=');
          if (pos !== -1) {
            const key = pair.substring(0, pos);
            const rawValue = pair.substring(pos + 1);
            const match = rawValue.match(QUOTES_REGEX);
            const value = match?.groups?.value ?? rawValue;
            return [key, value];
          } else {
            return [pair, pair];
          }
        }),
    );

    tag[TAG_TYPE_KEY] = tagType;
    tag[BODY_KEY] = body;
    result.push(tag);
  }
  return result;
}

const makeMacroViewedAnalyticsParams = (
  extensionKey: String,
  renderingStrategy: String,
) => {
  return {
    eventType: 'track',
    action: 'viewed',
    actionSubject: 'macro',
    actionSubjectId: extensionKey,
    attributes: {
      renderingStrategy: renderingStrategy,
    },
  };
};

export const useMacroViewedAnalyticsEvent = () => {
  const { createAnalyticsEvent } = useAnalyticsEvents();
  return useCallbackOne(
    (extensionKey: string, renderingStrategy: string) => {
      const analyticsParams = makeMacroViewedAnalyticsParams(
        extensionKey,
        renderingStrategy,
      );
      const event = createAnalyticsEvent(analyticsParams);
      event.fire('confluence-mobile-macros');
    },
    [createAnalyticsEvent],
  );
};
