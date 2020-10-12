import { urlToHostname } from '../../url-to-hostname';

const testCases = [
  ['https://www.example.com', 'www.example.com'],
  ['https://www.example.com/', 'www.example.com'],
  ['https://www.example.com?', 'www.example.com'],
  ['https://www.example.com/abcd', 'www.example.com'],
  ['https://www.example.com:443', 'www.example.com'],
  ['https://www.example.com:443/abc', 'www.example.com'],
  ['https://www.example.com:443/abcdef', 'www.example.com'],
  ['http://www.example.com', 'www.example.com'],
  ['http://www.example.com:443', 'www.example.com'],
  ['http://www.example.com:443/abc', 'www.example.com'],
  ['http://www.example.com:443/abcdef', 'www.example.com'],
  ['http://www.example.com:443/abcdef#def', 'www.example.com'],
  ['http://www.example.com:443?adfs', 'www.example.com'],
  ['http://www.example.com:443/adfs?a=b&c=d#adfs', 'www.example.com'],
  ['ftp://www.example.com', 'www.example.com'],

  ['www.example.com:443/abcdef', 'invalid'],
  ['www.example.com', 'invalid'],
  ['www.example.com:443', 'invalid'],
  ['www.example.com:443/abc', 'invalid'],
  ['www.example.com:443/abcdef', 'invalid'],
  ['www.example.com', 'invalid'],
  ['www.example.com:443', 'invalid'],
  ['www.example.com:443/abc', 'invalid'],
  ['www.example.com:443/abcdef', 'invalid'],
  ['', 'invalid'],
  [null, 'invalid'],
  [undefined, 'invalid'],
];

testCases.forEach(([url, expectedHostname]) => {
  it(`urlToHostname(${url}) == ${expectedHostname}`, () => {
    expect(urlToHostname(url)).toBe(expectedHostname);
  });
});
