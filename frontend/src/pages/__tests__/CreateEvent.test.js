import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import CreateEvent from '../CreateEvent'; // Adjust the import path based on your file structure
import apiClient from '../../axiosConfig'; // Adjust the import path based on your file structure

jest.mock('../../axiosConfig');

describe('CreateEvent Component', () => {
  beforeEach(() => {
    apiClient.post.mockResolvedValue({ status: 201 });
  });

  test('renders CreateEvent form', () => {
    render(<CreateEvent />);
    
    // Check if form elements are rendered
    expect(screen.getByLabelText(/event name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText('Date:')).toBeInTheDocument();
    expect(screen.getByLabelText('Start Time:')).toBeInTheDocument();
    expect(screen.getByLabelText(/location/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/ticket availability/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/price vip/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/price cat1/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/price cat2/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/price cat3/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/price cat4/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/price cat5/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/raffle start date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/raffle end date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/event image/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create event/i })).toBeInTheDocument();
  });

  test('submits the form with valid data', async () => {
    render(<CreateEvent />);
    
    // Fill out form fields
    fireEvent.change(screen.getByLabelText(/event name/i), { target: { value: 'Sample Event' } });
    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'This is a sample event.' } });
    fireEvent.change(screen.getByLabelText('Date:'), { target: { value: '2024-12-25' } });
    fireEvent.change(screen.getByLabelText('Start Time:'), { target: { value: '12:00' } });
    fireEvent.change(screen.getByLabelText(/location/i), { target: { value: 'National Stadium' } });
    fireEvent.change(screen.getByLabelText(/ticket availability/i), { target: { value: '100' } });
    fireEvent.change(screen.getByLabelText(/price vip/i), { target: { value: '200' } });
    fireEvent.change(screen.getByLabelText(/price cat1/i), { target: { value: '150' } });
    fireEvent.change(screen.getByLabelText(/price cat2/i), { target: { value: '100' } });
    fireEvent.change(screen.getByLabelText(/price cat3/i), { target: { value: '80' } });
    fireEvent.change(screen.getByLabelText(/price cat4/i), { target: { value: '60' } });
    fireEvent.change(screen.getByLabelText(/price cat5/i), { target: { value: '50' } });
    fireEvent.change(screen.getByLabelText(/raffle start date/i), { target: { value: '2024-12-01' } });
    fireEvent.change(screen.getByLabelText(/raffle end date/i), { target: { value: '2024-12-10' } });
    
    const file = new File(['event-image'], 'event-image.png', { type: 'image/png' });
    fireEvent.change(screen.getByLabelText(/event image/i), { target: { files: [file] } });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /create event/i }));

    // Check if the form submission is successful
    await waitFor(() => {
      console.log(document.body.innerHTML);
      expect(screen.getByRole('alert')).toHaveTextContent('Event created successfully');
    });
  });
});


