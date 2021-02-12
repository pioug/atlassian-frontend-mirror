import sample from 'lodash/sample';

import { Team } from '../src/types';

const avatarImages = [
  'data:image/gif;base64,R0lGODdhgACAAPIHAABRzMHT8l6O3o2w6env+zh22P///xRe0CwAAAAAgACAAAAD/wi63P4wykmrvTjrzbv/YCiOZGmeaKqubOu+cCzPdG3feK7vfO//wKBwSCwaj8ikcslsOp/QqHRKrVqv2Kx2y+16v+CweEwum8/otHrNbrvf8Lh8Tq83CwGDgTA4RA4DBHoBAnADeoh7BQ8HgokGA24Cj4gED3mUBoVsmJmbC5OZe22iepEMh6V+a6UGAQ2poouspacLsZmrap2UswsFpa9sjZnCsLJuBY6IAbrHiQSfbQcCAQED0g8FA9YCznbg4eLj5OVO2zMDvlXKrt8qB3kE61LEg/Qo8ZX4TvrQ2SbaQXvHxB+lPicAiWomBdejaCUEFiPIxOGjAPw04GnFkIiKxYveOFRrBQlLKJKEKDagFohkySwSSRK4NgBbAQE1uS2TCdCKQZdAUaq0ImBn0KN6IIppiTQon6FbqBlt+hBhmm1Tj/LpebVaVkoz1YUrQDZnTbIZzaldy7at27dw48qdS7eu3bt48+rdy7ev37+AAwseTLiw4cOIEytezLix48eQI0uenDcBADs=',
  'data:image/gif;base64,R0lGODdhgACAAPIHAACjv2fE1sXp70S2zR+qxJbV4////+r3+SwAAAAAgACAAAAD/wi63P4wykmrvTjrzbv/YCiOZGmeaKqubOu+cCzPdG3feK7vfO//wKBwSCwaj8ikcslsOp/QqHRKrVqv2Kx2y+16v+CweEwum8/otHrNbrvf8Lh8Tq83BwKD4VAgRAgFB3oCAXAFeoh7Aw8EgokGBW4Bj4gHD3mUBoVsmJmbC5OZe22iepEMh6V+a6UGAg2poouspacLsZmrap2UswsDpa9sjZnCsLJuA46IArrHiQefbQQBAgIF0g8DBdYBznbg4eLj5OVO2zMFvlXKrt8qBHkH61LEg/Qo8ZX4TvrQ2SbaQXvHxB+lPicAiWomBdejaCUEFiPIxOEjAfw04GnFkIiKxYveOFRrBQlLKJKEKDagFohkySwSSR64VgDbgAA1uS2TCdCKQZdAUaq0EmBn0KN6IIppiTQon6FbqBlt+hBhmm1Tj/LpebVaVkoz1YUbQDZnTbIZzaldy7at27dw48qdS7eu3bt48+rdy7ev37+AAwseTLiw4cOIEytezLix48eQI0uenDcBADs=',
  'data:image/gif;base64,R0lGODdhgACAAPIHAACHWur18arVxYjDrlarjMnk2v///yeUbSwAAAAAgACAAAAD/wi63P4wykmrvTjrzbv/YCiOZGmeaKqubOu+cCzPdG3feK7vfO//wKBwSCwaj8ikcslsOp/QqHRKrVqv2Kx2y+16v+CweEwum8/otHrNbrvf8Lh8Tq83CQKDISA4RA4DAXoFBHADeoh7fg4HgokGAm4Ej4gBDwWUeoVsmJkGmwuTnpZsnnqRDIemi2qmBgUNqp6gaa4Dsa6saXmzDQemsGyNmai4mbpqw4kFyAu8lbTCAwUFAtEOeNQDzXbd3t/g4eJMgDPbWMPMLwd5AdxPyq/vJQedilT1jwHXJQSOlfOS5Mt0zgQgT+qiPKO0r98/SgkVuiIUgoC9TBGlLMRIIIagBIuuIGERFdKaRwUH8Dz0dCuLv5CVqg0YQKDmzGkrTTXcwg6mz58Zt7z8SVQfPy6BihINUHAMoJxKEzE96UVl1ErW4AASAJWhgKZ1UhK4ObMm1XFo06pdy7at27dw48qdS7eu3bt48+rdy7ev37+AAwseTLiw4cOIEytezLix48eQI8tNAAA7',
  'data:image/gif;base64,R0lGODdhgACAAPIHAFJCqfDu+LGp2XlqvJGFyGBRsP///9TQ6iwAAAAAgACAAAAD/wi63P4wykmrvTjrzbv/YCiOZGmeaKqubOu+cCzPdG3feK7vfO//wKBwSCwaj8ikcslsOp/QqHRKrVqv2Kx2y+16v+CweEwum8/otHrNbrvf8Lh8Tq83BweDISAoRAoCAXoHBHACeoh7Aw8FgokGAm4Ej4gBD3mUBoVsmJmbC5OZe22iepEMh6V+a6UGBw2poouspacLsZmrap2UswsDpa9sjZnCsLJuA46IB7rHiQGfbQUEBwcC0g8DAtYEznbg4eLj5OVO2zMCvlXKrt8qBXkB61LEg/Qo8ZX4TvrQ2SbaQXvHxB+lPicAiWomBdejaCUEFiPIxOGjA/w04GnFkIiKxYveOFRrBQlLKJKEKDagFohkySwSSQa4JgDbAAI1uS2TCdCKQZdAUaq0QmBn0KN6IIppiTQon6FbqBlt+hBhmm1Tj/LpebVaVkoz1YUbQDZnTbIZzaldy7at27dw48qdS7eu3bt48+rdy7ev37+AAwseTLiw4cOIEytezLix48eQI0uenDcBADs=',
  'data:image/gif;base64,R0lGODdhgACAAPIHAN41Cvzs6vfMxPGgkeRTNeBAG////+lvVywAAAAAgACAAEAD/wi63P4wykmrvTjrzbv/YCiOZGmeaKqubOu+62DMdEA8REDTA+x7uZ1BUIDIdoHDbzkh9H6DG5N1EFpngoO0eRjorrvndOwgHLqD9OC8Jbvf8Lh8Tq/b7/i8fs/v+/+AgYKDhIUrYFgNR2BKho6GBQJgA0UmBYtCRI8RXoienwYBlJukpaanqKmqq6ytrq+wsbKztLW2t7i5uru8vRySjA1VYAG9wFeNCwSIAr7OzzAFX0NtKQTHNqWYVlkhB8dXmqeRoOXmAtWwXdPmSGvQ8PHy8/T19vf4+fr7/P3+/wADChxIsKDBgwgTKlzIsKHDhxAjSpxI4tsMUZUeXPrSzYfXMCvFHIDbkUyXJzEKtglJZ+ukIk8ZcwXh9kDlDJa4LgkQ8E5Cl51RKAodGieIuBbkspEih6TkiQPsQsUsZPOiUxBQmU2l+inLVgsWXaLKWi4AzzRn0AwQEBVREldk28m1SmvjXE8YezlhW5YnTqKAAwseTLiw4cOIEytezLix48eQI0smkQAAOw==',
  'data:image/gif;base64,R0lGODdhgACAAPIHAP+ZH/+vUv/Rnf+gMv+9cf/26//////mySwAAAAAgACAAAAD/wi63P4wykmrvTjrzbv/YCiOZGmeaKqubOu+cCzPdG3feK7vfO//wKBwSCwaj8ikcslsOp/QqHRKrVqv2Kx2y+16v+CweEwum8/otHrNbrvf8Lh8Tq83AweDoSAYRAYCBXoHBHACeoh7AQ8DgokGAm4Ej4gFD3mUBoVsmJmbC5OZe22iepEMh6V+a6UGBw2poouspacLsZmrap2UswsBpa9sjZnCsLJuAY6IB7rHiQWfbQMEBwcC0g8BAtYEznbg4eLj5OVO2zMCvlXKrt8qA3kF61LEg/Qo8ZX4TvrQ2SbaQXvHxB+lPicAiWomBdejaCUEFiPIxOGjA/w04GnFkIiKxYveOFRrBQlLKJKEKDagFohkySwSSRa4JgBbAAI1uS2TCdCKQZdAUaq0QmBn0KN6IIppiTQon6FbqBlt+hBhmm1Tj/LpebVaVkoz1YULQDZnTbIZzaldy7at27dw48qdS7eu3bt48+rdy7ev37+AAwseTLiw4cOIEytezLix48eQI0uenDcBADs=',
  '', // to test invalid img src
];

const getAvatar = () => sample(avatarImages)!;

const memberNames = [
  'Kramer Hatfield',
  'Schwartz Mclaughlin',
  'Nichole Walter',
  'Cleveland Rodriquez',
  'Hess Stone',
  'Lewis Cervantes',
  'Abbott Lamb',
  'Conner Duncan',
  'Bauer Burch',
  'Mcbride Haynes',
  'Maddy Estes',
  'Nikki Villanueva',
  'Adam Burks',
  'Milly Walters',
  'Phoebe Clarkson',
  'Samuel Dunlap',
  'Naomi Boyer',
  'Silas Gomez',
  'Josie Lancaster',
  'Fred Kirkpatrick',
  'Beck Rutledge',
  'Rebecca Woods',
];

const members = memberNames.map((name, index) => ({
  id: index.toString(),
  avatarUrl: getAvatar(),
  fullName: name,
}));

const sampleImage =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKAAAABACAMAAACqVYydAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAGBQTFRF/zX7+DP73i77uyb8kR78ZhX9PQz+GwX+/jT78jL71Sz7ryT8hRv8WhL9Mwr+EwT+/TT76jD7yyr7pCL8eRn9ThD9KQj+DAL/+jT74i/7wCj8lx/8bBb9Qw3+IAb+BgH/HFKiKQAAAIBJREFUeJztzjkOggAAAEEEORTkFOQS/v9L+u1INDQ7L5ggOOkGIURwhxgSSOHsz6BBgwYNGjRo0OBvgxk84Ak5FPCCEiowaNCgQYMGDRo0eG2whgZa6OANPQzwAYMGDRo0aNCgQYPXBkeYYIYFVvjCBjsYNGjQoEGDBg0a/GvwADIe8BAKQVCtAAAAAElFTkSuQmCC';

const names: Record<string, string> = {
  Short: 'Lemon',
  Medium: 'The Fat Cats',
  Long: 'People and Teams Collective Developers',
  Overlong:
    "Teamwork Platform's People and Teams Collective Frontend Developer Group",
};

const longDescription =
  'This is information about the team. They are responsible for all the cool stuff that happens at Acme.';

const descriptions: Record<string, string> = {
  None: '',
  Short: 'A very cool team!',
  Medium: 'This is a pretty cool team, that does a lot of work here.',
  Long: longDescription,
  Overlong: [longDescription, longDescription].join(' '),
};

export default function teamData({
  headerImage = 'None',
  displayName = 'Short',
  members: memberCount = 1,
  description = 'Long',
}: {
  headerImage?: 'None' | 'Picture';
  displayName?: 'Short' | 'Medium' | 'Long' | 'Overlong';
  members?: number;
  description?: 'None' | 'Short' | 'Medium' | 'Long' | 'Overlong';
}): Team {
  return {
    id: 'team-id',
    largeHeaderImageUrl: headerImage === 'Picture' ? sampleImage : undefined,
    displayName: names[displayName] || names.Short,
    members: members.slice(0, memberCount),
    description: description ? descriptions[description] : descriptions.Long,
  };
}
