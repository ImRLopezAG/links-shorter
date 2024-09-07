import { swaggerUI } from '@hono/swagger-ui'
import { Hono } from 'hono'
import { handle } from 'hono/vercel'

const app = new Hono().basePath('/api')

const errorSchema = {
  type: 'object',
  properties: {
    error: {
      type: 'string'
    }
  }
}
const imageSchema = {
  type: 'object',
  properties: {
    file: {
      type: 'string'
    },
    width: {
      type: 'number'
    },
    height: {
      type: 'number'
    },
    quality: {
      type: 'number'
    }
  }
}

const urlResponse = {
  type: 'object',
  properties: {
    url: {
      type: 'string'
    }
  }
}

app.get(
  '/docs',
  swaggerUI({
    url: '/api/ui',
    spec: {
      info: {
        title: 'Shurl API',
        version: 'v1',
        description:
          'Shurl is a simple URL shortener that allows you to shorten your long URLs into a shorter version and image optimization service that allows you to optimize your images for the web, which helps in reducing the size of the image without losing the quality of the image'
      },
      openapi: '3.0.0',
      tags: [
        {
          name: 'health',
          description: 'Health check'
        },
        {
          name: 'Link shorter',
          description: 'Shorten and expand URLs'
        },
        {
          name: 'Image Optimizer',
          description: 'Optimize images'
        }
      ],
      paths: {
        '/api/health': {
          get: {
            tags: ['health'],
            summary: 'Health check',
            responses: {
              200: {
                description: 'Health check',
                content: {
                  'application/json': {
                    schema: {
                      type: 'string'
                    }
                  }
                }
              }
            }
          }
        },
        '/api/shorten': {
          post: {
            tags: ['Link shorter'],
            summary: 'Shorten URL',
            requestBody: {
              description: 'Shorten URL',
              required: true,
              content: {
                'application/json': {
                  schema: urlResponse
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
          }
        },
        '/api/image/{slug}': {
          get: {
            tags: ['Image Optimizer'],
            summary: 'Image optimization',
            parameters: [
              {
                name: 'slug',
                in: 'path',
                required: true,
                schema: {
                  type: 'string'
                }
              }
            ],
            responses: {
              200: {
                description: 'Image optimization',
                content: {
                  'image/webp': {
                    schema: {
                      type: 'string',
                      format: 'binary'
                    }
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
          }
        },
        '/api/image': {
          post: {
            tags: ['Image Optimizer'],
            summary: 'Image optimization',
            requestBody: {
              description: 'Image optimization',
              required: true,
              content: {
                'application/json': {
                  schema: imageSchema
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
              }
            }
          }
        }
      }
    }
  })
)

export const GET = handle(app)
export const POST = handle(app)
