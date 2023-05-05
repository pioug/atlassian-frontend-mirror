// Implementation obtained from https://github.com/auth0/jwt-decode
// Copied from https://bitbucket.org/atlassian/%7Bc8e2f021-38d2-46d0-9b7a-b3f7b428f724%7D/pull-requests/13080

/* Decodes base64 string into unicode */
const b64DecodeUnicode = (str: string) => {
  return decodeURIComponent(
    atob(str).replace(/(.)/g, function (m, p) {
      let code = p.charCodeAt(0).toString(16).toUpperCase();
      if (code.length < 2) {
        code = '0' + code;
      }
      return '%' + code;
    }),
  );
};

/* Decodes base64url string into unicode */
const b64Decode = (str: string) => {
  let output = str.replace(/-/g, '+').replace(/_/g, '/');
  switch (output.length % 4) {
    case 0:
      break;
    case 2:
      output += '==';
      break;
    case 3:
      output += '=';
      break;
    default:
      throw new Error('Illegal base64url string!');
  }

  try {
    return b64DecodeUnicode(output);
  } catch (err) {
    return atob(output);
  }
};

export default function (token: string): unknown {
  try {
    const body = token.split('.')[1];
    return JSON.parse(b64Decode(body));
  } catch (e) {
    if (e instanceof Error) {
      throw new Error('Invalid token specified: ' + e.message);
    }
    throw e;
  }
}
