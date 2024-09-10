import { createRoute, z } from '@hono/zod-openapi'

const imageSchema = z
  .object({
    file: z.string().openapi('file', {
      description: 'Base64 encoded image'
    }),
    width: z.number().openapi('width', {
      description: 'Width of the image',
      example: 200
    }),
    height: z.number().openapi('height', {
      description: 'Height of the image',
      example: 200
    }),
    quality: z.number().optional().openapi('quality', {
      description: 'Quality of the image',
      example: 90,
      default: 90
    })
  })
  .openapi('ImageSchema')

const urlResponse = z
  .object({
    url: z.string()
  })
  .openapi('UrlResponse')

const errorSchema = z.object({
  message: z.string()
})

const slugParam = z
  .object({
    slug: z.string().openapi('slug', {
      description: 'Slug of the resource'
    })
  })
  .openapi('SlugParam')

export const imageRoute = createRoute({
  method: 'post',
  path: '/image',
  request: {
    body: {
      content: {
        'application/json': {
          schema: imageSchema
        }
      }
    }
  },
  responses: {
    200: {
      description: 'Image optimization',
      content: {
        'application/json': {
          schema: urlResponse
        }
      }
    },
    400: {
      description: 'Bad request',
      content: {
        'application/json': {
          schema: errorSchema
        }
      }
    },
    500: {
      description: 'Internal server error',
      content: {
        'application/json': {
          schema: errorSchema
        }
      }
    }
  }
})

export const shortenRoute = createRoute({
  method: 'post',
  path: '/shorten',
  request: {
    body: {
      content: {
        'application/json': {
          schema: urlResponse
        }
      }
    }
  },
  responses: {
    200: {
      description: 'Shorten URL',
      content: {
        'application/json': {
          schema: urlResponse
        }
      }
    },
    400: {
      description: 'Missing required parameter',
      content: {
        'application/json': {
          schema: errorSchema
        }
      }
    },
    500: {
      description: 'Internal server error',
      content: {
        'application/json': {
          schema: errorSchema
        }
      }
    }
  }
})

export const getImagesRoute = createRoute({
  method: 'get',
  path: '/image/{slug}',
  request: {
    params: slugParam
  },
  responses: {
    200: {
      description: 'Image',
      content: {
        'image/webp': {
          schema: z.string()
        }
      }
    },
    400: {
      description: 'Bad request',
      content: {
        'application/json': {
          schema: errorSchema
        }
      }
    },
    401: {
      description: 'Unauthorized',
      content: {
        'application/json': {
          schema: errorSchema
        }
      }
    },
    404: {
      description: 'Not found',
      content: {
        'application/json': {
          schema: errorSchema
        }
      }
    }
  }
})

export const getShorterRoute = createRoute({
  method: 'get',
  path: '/shorten/{slug}',
  request: {
    params: slugParam
  },
  responses: {
    200: {
      description: 'Shortened URL',
      content: {
        'application/json': {
          schema: urlResponse
        }
      }
    },
    400: {
      description: 'Bad request',
      content: {
        'application/json': {
          schema: errorSchema
        }
      }
    },
    401: {
      description: 'Unauthorized',
      content: {
        'application/json': {
          schema: errorSchema
        }
      }
    },
    404: {
      description: 'Not found',
      content: {
        'application/json': {
          schema: errorSchema
        }
      }
    }
  }
})
