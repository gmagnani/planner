
import { Button } from "../../components/button";
import { useParams} from 'react-router-dom'
import { MapPin, Calendar, Settings2, ArrowRight, X } from "lucide-react";
import { useEffect, useState } from "react";
import { DateRange, DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css"
import {format} from 'date-fns'
import { api } from "../../lib/axios";
import { toast } from "react-toastify";

interface Trip{
    id: string
    destination: string
    starts_at: string   
    ends_at: string
    is_confirmed: boolean
}


export function DestinationAndDateHeader() {
    const {tripId} = useParams()
    const [trip, setTrip] = useState<Trip | undefined>()
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
    const [eventStartAndEndDates, setEventStartAndEndDates] = useState<DateRange | undefined>()
    const [destination, setDestination] = useState(trip?.destination)
    
    useEffect(()=>{
        api.get(`/trips/${tripId}`).then(response => setTrip(response.data.trip))
    }, [tripId])
    
    function openDatePicker() {
        return setIsDatePickerOpen(true)
    }
    function closeDatePicker() {
        return setIsDatePickerOpen(false)
    }

    const displayedDate = trip?.ends_at && trip.starts_at ? 
    format(trip.starts_at, "d' de 'LLL").concat(' até ').concat(format(trip.ends_at, "d' de 'LLL")) : 
    null

    const newDisplayedDate = eventStartAndEndDates && eventStartAndEndDates.from && eventStartAndEndDates.to ? 
    format(eventStartAndEndDates.from, "d' de 'LLL").concat(' até ').concat(format(eventStartAndEndDates.to, "d' de 'LLL")) : 
    null

    function editTrip(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        api.put(`/trips/${tripId}`, {
            destination,
            starts_at: eventStartAndEndDates?.from,
            ends_at: eventStartAndEndDates?.to
        }).then(response => {
            toast.success('Viagem alterada com sucesso!',{
                theme: 'colored'
            })
            setIsDatePickerOpen(false)
        })
    }

    return (
        <form onSubmit={editTrip} className="h-16 bg-zinc-900 px-4 rounded-xl flex items-center shadow-shape gap-3">
            <div className='flex items-center gap-2 flex-1'>
                <MapPin className='size-5 text-zinc-400' />
                <input type="text"
                placeholder="Para onde você vai?" 
                className="bg-transparent text-lg placeholder-zinc-400 outline-none flex-1" 
                onChange={event => setDestination(event.target.value)}
                defaultValue={trip?.destination}
                />
            </div>
            <button onClick={openDatePicker} className='flex items-center gap-2 text-left w-[220px]'>
                <Calendar className='size-5 text-zinc-400' />
                <span className=" text-zinc-400 w-40 flex-1">
                    {newDisplayedDate || displayedDate || 'Quando?'}
                </span>
            </button>

            {isDatePickerOpen && (
                <div className='fixed inset-0 bg-black/60 flex items-center justify-center'>
                    <div className=' rounded-xl py-5 px-6 shadow-shape bg-zinc-900 space-y-5'>
                        <div className='space-y-2'>
                            <div className='flex items-center justify-between'>
                                <h2 className='text-lg font-semibold'>Selecione a data</h2>
                                <button type='button' onClick={closeDatePicker}>
                                    <X className='size-5 text-zinc-400' />
                                </button>
                            </div>
                        </div>
                        <DayPicker mode="range" selected={eventStartAndEndDates} onSelect={setEventStartAndEndDates}/>
                    </div>
                </div>
            )}
            <div className='w-px h-6 bg-zinc-800' />
            <Button variant="secondary" type="submit">
                Alterar local/data
                <Settings2 className='size-5' />
            </Button>
        </form>
    )

}