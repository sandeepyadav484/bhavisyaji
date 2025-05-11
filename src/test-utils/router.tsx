import React from 'react';
import { MemoryRouter } from 'react-router-dom';

interface RouterWrapperProps {
  children: React.ReactNode;
  initialEntries?: string[];
}

export const RouterWrapper: React.FC<RouterWrapperProps> = ({ children, initialEntries = ['/'] }) => {
  return (
    <MemoryRouter initialEntries={initialEntries}>
      {children}
    </MemoryRouter>
  );
};

// Mock useNavigate and useLocation
export const mockNavigate = jest.fn();
export const mockLocation = {
  pathname: '/',
  search: '',
  hash: '',
  state: null,
};

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: () => mockLocation,
})); 