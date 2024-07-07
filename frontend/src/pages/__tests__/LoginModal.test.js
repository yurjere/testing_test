// LoginModal.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import LoginModal from '../LoginModal'; // Adjust the import path based on your file structure
import { AuthProvider } from '../../context/AuthContext';
import apiClient from '../../axiosConfig'; // Adjust the import path based on your file structure

jest.mock('../../axiosConfig');

describe('LoginModal Component', () => {
  beforeEach(() => {
    apiClient.post.mockResolvedValue({ status: 200 });
  });

  const renderLoginModal = async (isOpen = true, initialIsLogin = true) => {
    await act(async () => {
      render(
        <AuthProvider>
          <LoginModal isOpen={isOpen} onClose={() => {}} initialIsLogin={initialIsLogin} />
        </AuthProvider>
      );
    });
  };

  test('handles login submission with valid data', async () => {
    await renderLoginModal();

    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'Password123!' } });
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });

//   test('handles login submission with invalid data', async () => {
//     await renderLoginModal();

//     fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'invalid-email' } });
//     fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'Password123!' } });
//     fireEvent.click(screen.getByRole('button', { name: /log in/i }));

//     await waitFor(() => {
//       expect(screen.getByText((content, element) => {
//         return element.tagName.toLowerCase() === 'div' && /please enter a valid email address\./i.test(content);
//       })).toBeInTheDocument();
//     });
//   });

  test('handles sign up submission with valid data', async () => {
    await renderLoginModal(true, false);

    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/phone number/i), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'john.doe@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'Password123!' } });
    
    // Click the submit button for sign up
    const signUpButtons = screen.getAllByRole('button', { name: /sign up/i });
    fireEvent.click(signUpButtons[1]); // Click the second "Sign Up" button which is the submit button

    await waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });
});
