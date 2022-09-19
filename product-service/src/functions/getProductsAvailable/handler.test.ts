import apiRequest from '@tests/requests/api.json'
import mock from './handler.test.mock.json'
import { main } from './handler'

const mockBookRepository = {
  available: jest.fn(),
}
jest.mock('@repository/index', () => {
  return {
    BookRepository: jest.fn().mockImplementation(() => {
      return mockBookRepository
    }),
  }
})

test('Get book available list handler (200)', async () => {
  const request = { ...apiRequest, mock }
  const response = await main(request)
  expect(response.statusCode).toEqual(200)
})

test('Get book available list handler (500)', async () => {
  const request = { ...apiRequest, mock }
  mockBookRepository.available.mockRejectedValue('err')
  const response = await main(request)
  expect(response.statusCode).toEqual(500)
})

test('Get book available list handler data', async () => {
  const request = { ...apiRequest, mock }
  mockBookRepository.available.mockResolvedValue([
    { id: 'id', count: 1, description: 'info', price: 0.1, title: 'Title', category_id: 2 },
  ])
  const response = await main(request)
  expect(response.statusCode).toEqual(200)
  expect(response.body).toBe(
    JSON.stringify({ data: [{ id: 'id', count: 1, description: 'info', price: 0.1, title: 'Title', category_id: 2 }] }),
  )
})
