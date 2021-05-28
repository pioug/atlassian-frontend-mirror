import parseJwt from '../../parseJwt';

describe('parseJwt', () => {
  const token =
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmb28iOiJiYXIiLCJleHAiOjEzOTMyODY4OTMsImlhdCI6MTM5MzI2ODg5M30.4-iaDojEVl0pJQMjrbM1EzUIfAZgsbK_kgnVyVxFSVo';

  it('should decode the token data', function () {
    const decoded = parseJwt(token) as any;
    expect(decoded.exp).toBe(1393286893);
    expect(decoded.iat).toBe(1393268893);
    expect(decoded.foo).toBe('bar');
  });

  it('should work with utf8 tokens', function () {
    const utf8_token =
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoiSm9zw6kiLCJpYXQiOjE0MjU2NDQ5NjZ9.1CfFtdGUPs6q8kT3OGQSVlhEMdbuX0HfNSqum0023a0';
    const decoded = parseJwt(utf8_token) as any;
    expect(decoded.name).toBe('José');
  });

  it('should work with binary tokens', function () {
    const utf8_token =
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoiSm9z6SIsImlhdCI6MTQyNTY0NDk2Nn0.cpnplCBxiw7Xqz5thkqs4Mo_dymvztnI0CI4BN0d1t8';
    const decoded = parseJwt(utf8_token) as any;
    expect(decoded.name).toBe('José');
  });
});
