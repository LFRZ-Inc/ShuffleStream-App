import type { NextApiRequest, NextApiResponse } from 'next'

interface UserList {
  id: string
  name: string
  description?: string
  isPublic: boolean
  items: ContentItem[]
  createdAt: string
  updatedAt: string
}

interface ContentItem {
  id: number
  title: string
  type: 'movie' | 'tv'
  platform: string
  poster: string
  addedAt: string
}

interface ListsResponse {
  success: boolean
  data?: UserList[]
  error?: string
}

interface CreateListRequest {
  name: string
  description?: string
  isPublic?: boolean
}

interface AddToListRequest {
  listId: string
  contentId: number
  title: string
  type: 'movie' | 'tv'
  platform: string
  poster: string
}

// Mock user lists
const MOCK_LISTS: UserList[] = [
  {
    id: 'list_1',
    name: 'My Favorites',
    description: 'All-time favorite movies and shows',
    isPublic: false,
    items: [
      {
        id: 1,
        title: 'Stranger Things',
        type: 'tv',
        platform: 'netflix',
        poster: '/x2LSRK2Cm7MZhjluni1msVJ3wDF.jpg',
        addedAt: '2024-01-15T10:30:00Z'
      },
      {
        id: 3,
        title: 'Dune',
        type: 'movie',
        platform: 'hbo',
        poster: '/d5NXSklXo0qyIYkgV94XAgMIckC.jpg',
        addedAt: '2024-01-20T14:15:00Z'
      }
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-20T14:15:00Z'
  },
  {
    id: 'list_2',
    name: 'Weekend Binge',
    description: 'Perfect for weekend marathons',
    isPublic: true,
    items: [
      {
        id: 2,
        title: 'The Mandalorian',
        type: 'tv',
        platform: 'disney',
        poster: '/sWgBv7LV2PRoQgkxwlibdGXKz1S.jpg',
        addedAt: '2024-01-10T09:00:00Z'
      },
      {
        id: 4,
        title: 'The Bear',
        type: 'tv',
        platform: 'hulu',
        poster: '/sHFlbKS3WLqMnp9t2ghADIJFnuQ.jpg',
        addedAt: '2024-01-12T16:45:00Z'
      }
    ],
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-12T16:45:00Z'
  }
]

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ListsResponse | { success: boolean; data?: UserList; error?: string }>
) {
  const { method } = req

  try {
    switch (method) {
      case 'GET':
        // Get user's lists
        return res.status(200).json({
          success: true,
          data: MOCK_LISTS
        })

      case 'POST':
        // Create new list
        const createRequest: CreateListRequest = req.body
        
        if (!createRequest.name) {
          return res.status(400).json({
            success: false,
            error: 'List name is required'
          })
        }

        const newList: UserList = {
          id: `list_${Date.now()}`,
          name: createRequest.name,
          description: createRequest.description,
          isPublic: createRequest.isPublic || false,
          items: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }

        MOCK_LISTS.push(newList)

        return res.status(201).json({
          success: true,
          data: newList
        })

      case 'PUT':
        // Add item to list
        const addRequest: AddToListRequest = req.body
        
        if (!addRequest.listId || !addRequest.contentId) {
          return res.status(400).json({
            success: false,
            error: 'List ID and content ID are required'
          })
        }

        const listIndex = MOCK_LISTS.findIndex(list => list.id === addRequest.listId)
        if (listIndex === -1) {
          return res.status(404).json({
            success: false,
            error: 'List not found'
          })
        }

        // Check if item already exists
        const existingItem = MOCK_LISTS[listIndex].items.find(
          item => item.id === addRequest.contentId
        )
        
        if (existingItem) {
          return res.status(409).json({
            success: false,
            error: 'Item already in list'
          })
        }

        const newItem: ContentItem = {
          id: addRequest.contentId,
          title: addRequest.title,
          type: addRequest.type,
          platform: addRequest.platform,
          poster: addRequest.poster,
          addedAt: new Date().toISOString()
        }

        MOCK_LISTS[listIndex].items.push(newItem)
        MOCK_LISTS[listIndex].updatedAt = new Date().toISOString()

        return res.status(200).json({
          success: true,
          data: MOCK_LISTS[listIndex]
        })

      case 'DELETE':
        // Remove item from list or delete list
        const { listId, contentId } = req.query

        if (!listId) {
          return res.status(400).json({
            success: false,
            error: 'List ID is required'
          })
        }

        const targetListIndex = MOCK_LISTS.findIndex(list => list.id === listId)
        if (targetListIndex === -1) {
          return res.status(404).json({
            success: false,
            error: 'List not found'
          })
        }

        if (contentId) {
          // Remove specific item from list
          const itemIndex = MOCK_LISTS[targetListIndex].items.findIndex(
            item => item.id.toString() === contentId
          )
          
          if (itemIndex === -1) {
            return res.status(404).json({
              success: false,
              error: 'Item not found in list'
            })
          }

          MOCK_LISTS[targetListIndex].items.splice(itemIndex, 1)
          MOCK_LISTS[targetListIndex].updatedAt = new Date().toISOString()

          return res.status(200).json({
            success: true,
            data: MOCK_LISTS[targetListIndex]
          })
        } else {
          // Delete entire list
          MOCK_LISTS.splice(targetListIndex, 1)
          
          return res.status(200).json({
            success: true
          })
        }

      default:
        return res.status(405).json({
          success: false,
          error: 'Method not allowed'
        })
    }

  } catch (error) {
    console.error('User lists API error:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
} 