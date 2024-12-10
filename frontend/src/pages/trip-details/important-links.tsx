import { Link2, Plus, X } from "lucide-react";
import { Button } from "../../components/button";
import { useEffect, useState } from "react";
import { api } from "../../lib/axios";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

interface Links {
    id: string
    title: string
    url: string
}
export function ImportantLinks() {
    const { tripId } = useParams()
    const [isLinkModalOpen, setIsLinkModalOpen] = useState(false)
    const [links, setLinks] = useState<Links[]>([])

    useEffect(() => {
        api.get(`/trips/${tripId}/links`).then(response => setLinks(response.data.links))
    },[])

    function openLinkModal() {
        setIsLinkModalOpen(true)
    }

    function closeLinkModal() {
        setIsLinkModalOpen(false)
    }

    function createLink(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const data = new FormData(event.currentTarget)
        const title = data.get('title')?.toString()
        const url = data.get('url')?.toString()
        event.currentTarget.reset()
        if (!title || !url) {
            return
        }

        api.post(`/trips/${tripId}/links`, { title, url }).then(response => {
            setLinks(response.data.links)
            toast.success('Link adicionado com sucesso',{
                theme: 'colored'
            })
        })
    }
    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold">Links Importantes</h2>
            <div className="space-y-5">
                {
                    links.map(link => (
                        <div key={link.id} className="flex items-center justify-between gap-4">
                            <div className="space-y-1.5">
                                <span className="block font-medium text-zinc-100">{link.title}</span>
                                <a href={link.url} className="block text-xs text-zinc-400 truncate hover:text-zinc-200">{link.url}</a>
                            </div>
                            <Link2 className="text-zinc-400 size-5 shrink-0" />
                        </div>
                    ))
                }
            </div>

            <Button variant="secondary" size="full" onClick={openLinkModal}>
                <Plus className='size-5' />
                Cadastrar novo link
            </Button>
            {
                isLinkModalOpen && (
                <div className='fixed inset-0 bg-black/60 flex items-center justify-center'>
                    <div className='w-[640px] rounded-xl py-5 px-6 shadow-shape bg-zinc-900 space-y-5'>
                        <div className='space-y-2'>
                            <div className='flex items-center justify-between'>
                                <h2 className='text-lg font-semibold'>Links</h2>
                                <button type='button' onClick={closeLinkModal}>
                                    <X className='size-5 text-zinc-400' />
                                </button>
                            </div>
                            <p className='text-sm text-zinc-400'>Adicionar novo link.
                            </p>
                        </div>   
                        <form onSubmit={createLink} className='space-y-3'>
                            <div className='h-14 px-4 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2'>
                                <input
                                    type="text"
                                    name='title'
                                    placeholder="Qual o título?"
                                    className="bg-transparent text-lg placeholder-zinc-400 outline-none flex-1"
                                />
                            </div>
                            <div className='h-14 px-4 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2'>
                                <Link2 className='size-5 text-zinc-400' />
                                <input
                                    type="text"
                                    name='url'
                                    placeholder="Qual a url?"
                                    className="bg-transparent text-lg placeholder-zinc-400 outline-none flex-1"
                                />
                            </div>

                            <Button type='submit' variant="primary" size="default">
                                <Plus className='size-5 ' />
                                Adicionar
                            </Button>
                        </form>
                    </div>
                </div>
                )
            }
        </div>
    )
}