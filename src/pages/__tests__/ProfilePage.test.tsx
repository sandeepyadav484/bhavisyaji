import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import * as userService from '../../services/firestore/users';
import ProfilePage from '../ProfilePage';

jest.mock('../../services/firestore/users');

// Mock the UserContext
jest.mock('../../contexts/UserContext', () => ({
  useUser: () => ({
    user: {
      uid: 'test-uid',
      email: 'test@example.com',
      photoURL: null,
    },
    loading: false,
  }),
}));

const renderProfilePage = () => {
  return render(
    <MemoryRouter>
      <ProfilePage />
    </MemoryRouter>
  );
};

const selectGender = async (value: string) => {
  const genderSelect = screen.getByRole('combobox', { name: /gender/i });
  await act(async () => {
    fireEvent.change(genderSelect, { target: { value } });
  });
};

describe('ProfilePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (userService.getUserProfile as jest.Mock).mockResolvedValue(null);
    (userService.saveUserProfile as jest.Mock).mockResolvedValue(undefined);
  });

  it('validates required fields in each step', async () => {
    await renderProfilePage();
    
    // Try to advance without filling required fields
    const nextButton = screen.getByRole('button', { name: /next/i });
    await act(async () => {
      fireEvent.click(nextButton);
    });
    
    // Check for validation error
    await waitFor(() => {
      expect(screen.getByText('Name and gender are required.')).toBeInTheDocument();
    });
    
    // Fill required fields and advance
    const nameInput = screen.getByRole('textbox', { name: /full name/i });
    await act(async () => {
      fireEvent.change(nameInput, { target: { value: 'Test User' } });
    });
    await selectGender('male');
    
    await act(async () => {
      fireEvent.click(nextButton);
    });
    
    // Try to advance without birth details
    await act(async () => {
      fireEvent.click(nextButton);
    });
    
    // Check for validation error
    await waitFor(() => {
      expect(screen.getByText('Birth date is required.')).toBeInTheDocument();
    });
    
    // Fill birth details
    const birthDateInput = screen.getByRole('textbox', { name: /date of birth/i });
    await act(async () => {
      fireEvent.change(birthDateInput, { target: { value: '2000-01-01' } });
    });
    
    await act(async () => {
      fireEvent.click(nextButton);
    });
    
    // Try to save without location
    const saveButton = screen.getByRole('button', { name: /save/i });
    await act(async () => {
      fireEvent.click(saveButton);
    });
    
    // Check for validation error
    await waitFor(() => {
      expect(screen.getByText('Birth location is required.')).toBeInTheDocument();
    });
  });

  it('can submit the form with save button', async () => {
    await renderProfilePage();
    
    // Fill all steps and advance to final step
    await act(async () => {
      // Fill personal info
      const nameInput = screen.getByRole('textbox', { name: /full name/i });
      fireEvent.change(nameInput, { target: { value: 'Test User' } });
      await selectGender('male');
      
      // Advance to birth details
      const nextButton = screen.getByRole('button', { name: /next/i });
      fireEvent.click(nextButton);
      
      // Fill birth details
      const birthDateInput = screen.getByRole('textbox', { name: /date of birth/i });
      fireEvent.change(birthDateInput, { target: { value: '2000-01-01' } });
      
      // Advance to location
      fireEvent.click(nextButton);
    });
    
    // Fill location
    const locationInput = screen.getByRole('textbox', { name: /birth location/i });
    await act(async () => {
      fireEvent.change(locationInput, { target: { value: 'Delhi, India' } });
    });
    
    // Find and click save button
    const saveButton = screen.getByRole('button', { name: /save/i });
    await act(async () => {
      fireEvent.click(saveButton);
    });
    
    // Verify form submission
    await waitFor(() => {
      expect(userService.saveUserProfile).toHaveBeenCalledWith({
        name: 'Test User',
        gender: 'male',
        date: '2000-01-01',
        location: 'Delhi, India',
        userId: 'test-uid',
      });
    });
  });

  it('handles API errors during profile saving', async () => {
    (userService.saveUserProfile as jest.Mock).mockRejectedValue(new Error('API Error'));
    await renderProfilePage();
    
    // Fill all steps and advance to final step
    await act(async () => {
      // Fill personal info
      const nameInput = screen.getByRole('textbox', { name: /full name/i });
      fireEvent.change(nameInput, { target: { value: 'Test User' } });
      await selectGender('male');
      
      // Advance to birth details
      const nextButton = screen.getByRole('button', { name: /next/i });
      fireEvent.click(nextButton);
      
      // Fill birth details
      const birthDateInput = screen.getByRole('textbox', { name: /date of birth/i });
      fireEvent.change(birthDateInput, { target: { value: '2000-01-01' } });
      
      // Advance to location
      fireEvent.click(nextButton);
    });
    
    // Fill location
    const locationInput = screen.getByRole('textbox', { name: /birth location/i });
    await act(async () => {
      fireEvent.change(locationInput, { target: { value: 'Delhi, India' } });
    });
    
    // Find and click save button
    const saveButton = screen.getByRole('button', { name: /save/i });
    await act(async () => {
      fireEvent.click(saveButton);
    });
    
    // Verify error message
    await waitFor(() => {
      expect(screen.getByText('Failed to save profile. Please try again.')).toBeInTheDocument();
    });
  });
}); 