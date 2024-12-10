import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { ClientError } from '../errors/client-error'

export async function deleteInvite(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().delete(
    '/trips/:tripId/participants/:participantId',
    {
      schema: {
        params: z.object({
          tripId: z.string().uuid(),
          participantId: z.string().uuid(),
        }),
      },
    },
    async (request) => {
      const { tripId, participantId } = request.params

      const trip = await prisma.trip.findUnique({
        where: { id: tripId },
      })

      if (!trip) {
        throw new ClientError('Trip not found')
      }

      const participant = await prisma.participant.findUnique({
        where: { id: participantId },
      })

      if (!participant || participant.trip_id !== tripId) {
        throw new ClientError('Participant not found or not associated with the trip')
      }

      await prisma.participant.delete({
        where: { id: participantId },
      })

      return { message: 'Participant removed successfully' }
    },
  )
}
