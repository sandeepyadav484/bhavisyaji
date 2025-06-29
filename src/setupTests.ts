// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import React from 'react';
import { User } from 'firebase/auth';

// Mock Firebase
jest.mock('./config/firebase', () => {
  const mockAuth = {
    onAuthStateChanged: jest.fn(() => jest.fn()),
    signInWithPhoneNumber: jest.fn(),
    createUserWithPhoneNumber: jest.fn(),
    signOut: jest.fn(),
    currentUser: null,
  };

  return {
    app: {},
    auth: mockAuth,
    firestore: {
      collection: jest.fn(() => ({
        doc: jest.fn(() => ({
          get: jest.fn(),
          set: jest.fn(),
          update: jest.fn(),
        })),
      })),
    },
    analytics: {},
  };
});

// Mock UserContext
jest.mock('./contexts/UserContext', () => {
  const mockUser: User = {
    uid: 'test-uid',
    email: null,
    emailVerified: false,
    isAnonymous: false,
    metadata: {},
    providerData: [],
    refreshToken: '',
    tenantId: null,
    delete: jest.fn(),
    getIdToken: jest.fn(),
    getIdTokenResult: jest.fn(),
    reload: jest.fn(),
    toJSON: jest.fn(),
    displayName: null,
    phoneNumber: '+1234567890',
    photoURL: null,
    providerId: 'phone',
  };

  const UserProvider = ({ children }: { children: React.ReactNode }) => React.createElement('div', null, children);
  const useUser = () => ({ 
    user: mockUser, 
    loading: false, 
    setUser: jest.fn() 
  });

  return {
    UserProvider,
    useUser,
  };
});

// Mock AuthGuard
jest.mock('./components/auth/AuthGuard', () => {
  const AuthGuard = ({ children }: { children: React.ReactNode }) => React.createElement('div', null, children);
  AuthGuard.displayName = 'AuthGuard';
  return {
    __esModule: true,
    default: AuthGuard,
  };
});

// Mock Material UI components that cause issues
jest.mock('@mui/material', () => {
  const mui = jest.requireActual('@mui/material');
  return {
    ...mui,
    TextField: (props: any) => {
      const { select, children, onChange, value, inputProps = {}, label, fullWidth, ...rest } = props;
      const labelId = `${label}-label`.toLowerCase().replace(/\s+/g, '-');
      
      if (select) {
        return React.createElement(
          'div',
          null,
          React.createElement(
            'label',
            {
              id: labelId,
              htmlFor: rest.id || labelId,
            },
            label
          ),
          React.createElement(
            'select',
            {
              'data-testid': 'mui-select',
              value: value || '',
              onChange: (e: any) => onChange?.({ target: { value: e.target.value } }),
              'aria-label': label,
              'aria-labelledby': labelId,
              id: rest.id || labelId,
              role: 'combobox',
              ...rest,
              ...inputProps,
            },
            React.Children.map(children, (child: any) => {
              if (child?.type?.render?.displayName === 'MenuItem') {
                return React.createElement(
                  'option',
                  {
                    value: child.props.value || '',
                    role: 'option',
                    'data-value': child.props.value,
                  },
                  child.props.children
                );
              }
              return child;
            })
          )
        );
      }
      return React.createElement(
        'div',
        null,
        React.createElement(
          'label',
          {
            id: labelId,
            htmlFor: rest.id || labelId,
          },
          label
        ),
        React.createElement(
          'input',
          {
            type: 'text',
            value: value || '',
            onChange: (e: any) => onChange?.(e),
            'aria-label': label,
            'aria-labelledby': labelId,
            id: rest.id || labelId,
            role: 'textbox',
            ...rest,
            ...inputProps,
          }
        )
      );
    },
    Button: (props: any) => {
      const { children, onClick, variant, color, type, 'aria-label': ariaLabel, ...rest } = props;
      const buttonText = typeof children === 'string' ? children : Array.isArray(children) ? children.join('') : '';
      return React.createElement(
        'button',
        {
          onClick,
          type: type || 'button',
          role: 'button',
          'aria-label': ariaLabel || buttonText,
          ...rest,
        },
        children
      );
    },
    Select: (props: any) => {
      const { children, onChange, value, label, inputProps = {}, ...rest } = props;
      const labelId = `${label}-label`.toLowerCase().replace(/\s+/g, '-');
      return React.createElement(
        'div',
        null,
        React.createElement(
          'label',
          {
            id: labelId,
            htmlFor: rest.id || labelId,
          },
          label
        ),
        React.createElement(
          'select',
          {
            value: value || '',
            onChange: (e: any) => onChange?.({ target: { value: e.target.value } }),
            'aria-label': label,
            'aria-labelledby': labelId,
            id: rest.id || labelId,
            role: 'combobox',
            ...rest,
            ...inputProps,
          },
          children
        )
      );
    },
    MenuItem: (props: any) => {
      const { children, value, ...rest } = props;
      return React.createElement(
        'option',
        {
          value: value || '',
          role: 'option',
          'data-value': value,
          ...rest,
        },
        children
      );
    },
    Checkbox: (props: any) => {
      const { checked, onChange, label, inputProps = {}, ...rest } = props;
      const labelId = `${label}-label`.toLowerCase().replace(/\s+/g, '-');
      return React.createElement(
        'div',
        null,
        React.createElement(
          'label',
          {
            id: labelId,
            htmlFor: rest.id || labelId,
          },
          React.createElement(
            'input',
            {
              type: 'checkbox',
              checked: checked || false,
              onChange: (e: any) => onChange?.(e),
              'aria-label': label,
              'aria-labelledby': labelId,
              id: rest.id || labelId,
              role: 'checkbox',
              ...rest,
              ...inputProps,
            }
          ),
          label
        )
      );
    },
  };
});

// Mock browser APIs
class MockTextEncoder {
  encode(text: string): Uint8Array {
    const buffer = new Uint8Array(text.length);
    for (let i = 0; i < text.length; i++) {
      buffer[i] = text.charCodeAt(i);
    }
    return buffer;
  }
  encoding = 'utf-8';
  encodeInto(source: string, destination: Uint8Array): { read: number; written: number } {
    const encoded = this.encode(source);
    const written = Math.min(encoded.length, destination.length);
    destination.set(encoded.slice(0, written));
    return { read: source.length, written };
  }
}

class MockTextDecoder {
  constructor(public encoding = 'utf-8', public fatal = false, public ignoreBOM = false) {}
  decode(buffer: Uint8Array): string {
    let result = '';
    for (let i = 0; i < buffer.length; i++) {
      result += String.fromCharCode(buffer[i]);
    }
    return result;
  }
}

global.TextEncoder = MockTextEncoder as any;
global.TextDecoder = MockTextDecoder as any;

// Mock window.location
const mockWindow = {
  location: {
    pathname: '/',
    search: '',
    hash: '',
    href: 'http://localhost/',
    origin: 'http://localhost',
    protocol: 'http:',
    host: 'localhost',
    hostname: 'localhost',
    port: '',
    assign: jest.fn(),
    replace: jest.fn(),
    reload: jest.fn(),
  },
  history: {
    pushState: jest.fn(),
    replaceState: jest.fn(),
    go: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
  },
};

Object.defineProperty(window, 'location', {
  value: mockWindow.location,
  writable: true,
});

Object.defineProperty(window, 'history', {
  value: mockWindow.history,
  writable: true,
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock location search functionality
jest.mock('./services/location', () => ({
  searchLocations: jest.fn().mockResolvedValue([
    {
      name: 'New Delhi, India',
      coordinates: { lat: 28.6139, lng: 77.2090 }
    },
    {
      name: 'Mumbai, India',
      coordinates: { lat: 19.0760, lng: 72.8777 }
    }
  ])
}));
