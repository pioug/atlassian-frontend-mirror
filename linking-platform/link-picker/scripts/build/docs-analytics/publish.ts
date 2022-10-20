/* eslint-disable no-console */
import fetch from 'node-fetch';

/**
 * ALL CODE BELOW HAS BEEN SSS'D (SWIFTLY and SHAMELESSLY STOLEN) FROM
 * https://bitbucket.org/atlassian/forge-smart-links/src/master/scripts/utils/confluence/index.ts
 */

const REQUEST_HEADERS = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

const ORIGIN = 'hello.atlassian.net';

export const getCurrentPageVersion = async (
  pageId: string,
  Authorization: string,
) => {
  console.log('Getting current page version number');
  // An incremented version of the page is required for updating content on the page.
  const getResponse = await fetch(
    `https://${ORIGIN}/wiki/rest/api/content/${pageId}?expand=body.atlas_doc_format,version`,
    {
      method: 'GET',
      headers: { ...REQUEST_HEADERS, Authorization },
    },
  );
  if (getResponse.status !== 200) {
    console.error(
      'Error making get request to get version of page',
      await getResponse.text(),
    );
  } else {
    const responseBody = await getResponse.json();
    // console.log(responseBody); //Uncomment to see ADF of page
    const {
      version: { number },
    } = responseBody;
    console.log(`Obtained page version number: ${number}`);
    return number;
  }
};

export const updatePage = async (
  currentVersion: number,
  adfValue: string,
  title: string,
  pageId: string,
  Authorization: string,
) => {
  console.log('Updating page with new content');
  const bodyData = JSON.stringify({
    version: {
      number: currentVersion + 1,
    },
    type: 'page',
    title,
    body: {
      atlas_doc_format: {
        representation: 'atlas_doc_format',
        value: adfValue,
      },
    },
  });

  const putResponse = await fetch(
    `https://${ORIGIN}/wiki/rest/api/content/${pageId}`,
    {
      method: 'PUT',
      headers: { ...REQUEST_HEADERS, Authorization },
      body: bodyData,
    },
  );
  const status = putResponse.status;
  if (status === 200) {
    console.log('Update successful');
  } else {
    console.error(
      `Failed to update the page with status code: ${status} and error: ${await putResponse.text()}`,
    );
  }
};
