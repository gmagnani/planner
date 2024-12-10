import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { ClientError } from '../errors/client-error'

export async function deleteLink(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().delete(
    '/trips/:tripId/links/:linkId',
    {
      schema: {
        params: z.object({
          tripId: z.string().uuid(),
          linkId: z.string().uuid(),
        }),
      },
    },
    async (request) => {
      const { tripId, linkId } = request.params

      const trip = await prisma.trip.findUnique({
        where: { id: tripId },
      })

      if (!trip) {
        throw new ClientError('Trip not found')
      }

      const link = await prisma.link.findUnique({
        where: { id: linkId },
      })

      if (!link || link.trip_id !== tripId) {
        throw new ClientError('Link not found or does not belong to this trip')
      }

      await prisma.link.delete({
        where: { id: linkId },
      })

      const links = await prisma.link.findMany({
        where: { trip_id: tripId },
        select: {
          id: true,
          title: true,
          url: true,
        },
      })

      return { links }
    }
  )
}
