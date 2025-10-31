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
    const trafficSignText = screen.getByText('Traffic Sign')
    const detectiveText = screen.getByText('Detective 🕵️')
    expect(trafficSignText).toBeInTheDocument()
    expect(detectiveText).toBeInTheDocument()
  })

  it('renders the upload section', () => {
    render(<Home />)
    const uploadText = screen.getByText(/Drop your traffic sign here/i)
    expect(uploadText).toBeInTheDocument()
  })

  it('renders the upload instruction', () => {
    render(<Home />)
    const uploadInstruction = screen.getByText(/or click to browse your files/i)
    expect(uploadInstruction).toBeInTheDocument()
  })

  it('renders file format information', () => {
    render(<Home />)
    const formatInfo = screen.getByText(/PNG, JPG, JPEG/i)
    expect(formatInfo).toBeInTheDocument()
  })
})