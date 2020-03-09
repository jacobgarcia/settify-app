// Libraries
import React from 'react';
import { render, wait, fireEvent } from '@testing-library/react';
import store from 'store';

// Components
import { AuthProvider, GOOGLE_ID, NAME, EMAIL, PRICY_TOKEN } from '..';
import useAuth from 'hooks/auth';
import APIMock from 'api';
import LogRocketMock from 'logrocket';

jest.mock('api');
jest.mock('logrocket');

const ContextWrapper = ({ children }) => {
  const contextProps = useAuth();
  return children(contextProps);
};

const testGID = 'test_g_id';
const testName = 'test_username';
const testEmail = 'test_email';
const testPricyToken = 'test_p_token';
const testFirebaseToken = 'test_f_token';

afterEach(() => {
  store.clearAll();
});

describe('<AuthContext/>', () => {
  test('Is loading the default the auth without a token', () => {
    const mockFunction = jest.fn(() => 'mock_func');
    render(
      <AuthProvider>
        <ContextWrapper>
          {(contextProps) => mockFunction(contextProps)}
        </ContextWrapper>
      </AuthProvider>
    );
    expect(mockFunction).toHaveBeenLastCalledWith({
      authenticate: expect.any(Function),
      getProfile: expect.any(Function),
      getToken: expect.any(Function),
      removeSession: expect.any(Function),
      setProfile: expect.any(Function),
      hasToken: false,
      isLoading: false,
      isExternalUser: false,
    });

    expect(LogRocketMock.identify).not.toHaveBeenCalled();
    expect(APIMock.RolesByUser.getUserRole).not.toHaveBeenCalled();
  });

  test('Is loading the info when a user logs in', async () => {
    APIMock.Login.authenticate.mockResolvedValue({ token: testPricyToken });

    const mockFunction = jest.fn(() => 'mock_func');
    const { getByTestId } = render(
      <AuthProvider>
        <ContextWrapper>
          {(contextProps) => (
            <>
              {mockFunction(contextProps)}
              <button
                type="button"
                data-testid="login-btn"
                onClick={() => {
                  contextProps.authenticate({
                    tokenId: testFirebaseToken,
                    profileObj: {
                      name: testName,
                      googleId: testGID,
                      email: testEmail,
                    },
                    isFirebaseLogin: true,
                  });
                }}
              />
            </>
          )}
        </ContextWrapper>
      </AuthProvider>
    );

    const loginButton = getByTestId('login-btn');
    fireEvent.click(loginButton);
    await wait();

    expect(APIMock.Login.authenticate).toHaveBeenLastCalledWith({
      code: testFirebaseToken,
      login_method: 'firebase',
      email: testEmail,
    });

    expect(LogRocketMock.identify).toHaveBeenLastCalledWith(testGID, {
      email: testEmail,
      name: testName,
    });

    expect(APIMock.RolesByUser.getUserRole).toHaveBeenLastCalledWith(testEmail);

    expect(mockFunction).toHaveBeenLastCalledWith({
      hasToken: true,
      isLoading: false,
      authenticate: expect.any(Function),
      getProfile: expect.any(Function),
      getToken: expect.any(Function),
      removeSession: expect.any(Function),
      setProfile: expect.any(Function),
      isExternalUser: false,
    });
  });

  test('Is loading the saved profile', () => {
    const mockFunction = jest.fn(() => 'mock_func');

    store.set(GOOGLE_ID, testGID);
    store.set(NAME, testName);
    store.set(EMAIL, testEmail);
    store.set(PRICY_TOKEN, testPricyToken);

    render(
      <AuthProvider>
        <ContextWrapper>
          {(contextProps) => mockFunction(contextProps)}
        </ContextWrapper>
      </AuthProvider>
    );
    expect(mockFunction).toHaveBeenLastCalledWith({
      authenticate: expect.any(Function),
      getProfile: expect.any(Function),
      getToken: expect.any(Function),
      hasToken: true,
      isLoading: true,
      removeSession: expect.any(Function),
      setProfile: expect.any(Function),
      isExternalUser: false,
    });

    expect(LogRocketMock.identify).toHaveBeenLastCalledWith(testGID, {
      email: testEmail,
      name: testName,
    });

    expect(APIMock.RolesByUser.getUserRole).toHaveBeenLastCalledWith(testEmail);
  });

  test('Is returning that the user is premium', async () => {
    const mockFunction = jest.fn(() => 'mock_func');

    store.set(GOOGLE_ID, testGID);
    store.set(NAME, testName);
    store.set(EMAIL, testEmail);
    store.set(PRICY_TOKEN, testPricyToken);

    render(
      <AuthProvider>
        <ContextWrapper>
          {(contextProps) => mockFunction(contextProps)}
        </ContextWrapper>
      </AuthProvider>
    );

    await wait();

    expect(mockFunction).toHaveBeenLastCalledWith({
      authenticate: expect.any(Function),
      getProfile: expect.any(Function),
      getToken: expect.any(Function),
      hasToken: true,
      isLoading: false,
      removeSession: expect.any(Function),
      setProfile: expect.any(Function),
      isExternalUser: false,
    });
    expect(APIMock.RolesByUser.getUserRole).toHaveBeenLastCalledWith(testEmail);
  });

  test('Knows when using a user is extenal', () => {
    const mockFunction = jest.fn(() => 'mock_func');
    global.window = Object.create(window);

    const url = 'http://cotizador.credijusto.com';
    Object.defineProperty(window, 'location', {
      value: {
        hostname: url,
      },
      writable: true,
    });

    render(
      <AuthProvider>
        <ContextWrapper>
          {(contextProps) => mockFunction(contextProps)}
        </ContextWrapper>
      </AuthProvider>
    );
    expect(mockFunction).toHaveBeenLastCalledWith({
      authenticate: expect.any(Function),
      getProfile: expect.any(Function),
      getToken: expect.any(Function),
      hasToken: false,
      isLoading: false,
      removeSession: expect.any(Function),
      setProfile: expect.any(Function),
      isExternalUser: true,
    });
  });
});
