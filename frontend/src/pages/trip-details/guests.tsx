import { CheckCircle2, CircleDashed, Trash, UserCog, X, AtSign, Plus } from "lucide-react";
import { Button } from "../../components/button";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../lib/axios";
import { toast } from "react-toastify";

interface Participant {
    id: string
    name: string | null
    email: string | null
    is_confirmed: boolean
}


export function Guests() {
    const { tripId } = useParams()
    const [participants, setParticipants] = useState<Participant[]>([])
    const [isMenagingGuestsOpen, setIsMenagingGuestsOpen] = useState(false)

    function openMenagingGuests() {
        setIsMenagingGuestsOpen(true)
    }

    function closeMenagingGuests() {
        setIsMenagingGuestsOpen(false)
    }

    useEffect(() => {
        api.get(`/trips/${tripId}/participants`).then(response => setParticipants(response.data.participants))
    }, [tripId])

    function removeParticipant(participantId: string) {
        api.delete(`/trips/${tripId}/participants/${participantId}`).then(() => {
            setParticipants(participants.filter(participant => participant.id !== participantId))
            toast.success('Convidado removido com sucesso',{
                theme: 'colored'
            })
        })
    }

    function inviteParticipant(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const data = new FormData(event.currentTarget)
        const email = data.get('email')?.toString()
        event.currentTarget.reset()
        if (!email) {
            return
        }

        api.post(`/trips/${tripId}/invites`, { email }).then(response => {
            setParticipants(response.data.participants)
            toast.success('Convidado adicionado com sucesso',{
                theme: 'colored'
            })
        })
    }


    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold">Convidados</h2>
            <div className="space-y-5">
                {participants.map((participant, index) => {
                    return (
                        <div key={participant.id} className="flex items-center justify-between gap-4">
                            <div className="space-y-1.5">
                                <span className="block font-medium text-zinc-100">{participant.name ?? `Convidado ${index}` }</span>
                                <span className="block text-sm text-zinc-400 truncate">{participant.email}</span>
                            </div>
                            {participant.is_confirmed ? (
                                <CheckCircle2 className="text-green-400 size-5 shrink-0" />
                            ):(
                                <CircleDashed className="text-zinc-400 size-5 shrink-0" />
                            )}
                        </div>
                    )
                })}

            </div>

            <Button variant="secondary" size="full" onClick={openMenagingGuests}>
                <UserCog className='size-5' />
                Geerenciar convidados
            </Button>

            {
                isMenagingGuestsOpen && (
                    <div className='fixed inset-0 bg-black/60 flex items-center justify-center'>
                        <div className='w-[640px] rounded-xl py-5 px-6 shadow-shape bg-zinc-900 space-y-5'>
                            <div className='space-y-2'>
                                <div className='flex items-center justify-between'>
                                    <h2 className='text-lg font-semibold'>Convidados</h2>
                                    <button type='button' onClick={closeMenagingGuests}>
                                        <X className='size-5 text-zinc-400' />
                                    </button>
                                </div>
                                <p className='text-sm text-zinc-400'>Gerenciar convidados da viagem.
                                </p>
                            </div>
                            <div className="space-y-5">
                                {participants.map((participant, index) => {
                                    return (
                                        <div key={participant.id} className="flex items-center justify-between gap-4">
                                            <div className="space-y-1.5">
                                                <span className="block font-medium text-zinc-100">{participant.name ?? `Convidado ${index}` }</span>
                                                <span className="block text-sm text-zinc-400 truncate">{participant.email}</span>
                                            </div>
                                            <div className="flex gap-2">
                                                {participant.is_confirmed ? (
                                                    <CheckCircle2 className="text-green-400 size-5 shrink-0" />
                                                ):(
                                                    <CircleDashed className="text-zinc-400 size-5 shrink-0" />
                                                )}
                                                {
                                                    !participant.is_confirmed && (
                                                        <Trash className='text-red-600 size-5 cursor-pointer' onClick={() => removeParticipant(participant.id)}/>
                                                    )
                                                }
                                                
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>    
                            <form onSubmit={inviteParticipant}  className='p-2.5 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2'>
                                <div className='px-2 flex items-center flex-1 gap-2'>
                                    <AtSign className='size-5 text-zinc-400' />
                                    <input
                                        type="email"
                                        name='email'
                                        placeholder="Digite o e-mail do convidado"
                                        className="bg-transparent text-lg placeholder-zinc-400 outline-none flex-1"
                                    />

                                </div>

                                <Button type='submit' variant="primary" size="default">
                                    Convidar
                                    <Plus className='size-5 ' />
                                </Button>
                            </form>
                        </div>
                    </div>
                )
            }
        </div>
    )
}