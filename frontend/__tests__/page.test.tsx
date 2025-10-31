import { render, screen } from '@testing-library/react'
import Home from '../src/app/page'

// Mock the environment variables
const mockEnv = {
  NEXT_PUBLIC_BACKEND_URL: 'http://localhost:8001'
}

jest.mock('process', () => ({
  env: mockEnv
}))

describe('Home Page', () => {
  it('renders the main heading', () => {
    render(<Home />)
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toBeInTheDocument()
    expect(heading).toHaveTextContent('Traffic Sign Recognition')
  })

  it('renders the upload section', () => {
    render(<Home />)
    const uploadText = screen.getByText(/Select an image to classify/i)
    expect(uploadText).toBeInTheDocument()
  })

  it('renders the upload button', () => {
    render(<Home />)
    const uploadButton = screen.getByText(/Choose Image/i)
    expect(uploadButton).toBeInTheDocument()
  })
})