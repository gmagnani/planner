import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import nodemailer from 'nodemailer'
import { prisma } from '../lib/prisma'
import { dayjs } from '../lib/dayjs'
import { getMailClient } from '../lib/mail'
import { ClientError } from '../errors/client-error'
import { env } from '../env'

export async function createInvite(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/trips/:tripId/invites',
    {
      schema: {
        params: z.object({
          tripId: z.string().uuid(),
        }),
        body: z.object({
          email: z.string().email(),
        }),
      },
    },
    async (request) => {
      const { tripId } = request.params
      const { email } = request.body

      const trip = await prisma.trip.findUnique({
        where: { id: tripId }
      })

      if (!trip) {
        throw new ClientError('Trip not found')
      }

      const participant = await prisma.participant.create({
        data: {
          email,
          trip_id: tripId,
        }
      })

      const participants = await prisma.participant.findMany({
        where: {
          trip_id: tripId,
        },
        select: {
          id: true,
          email: true,
          is_confirmed: true,
          name: true,
        },
      })

      return { participantId: participant.id, participants }
    },
  )
}
