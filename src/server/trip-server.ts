import { api } from "./api";

export type TripDetails = {
    id: string,
    destination: string,
    starts_at: string,
    ends_at: string,
    is_confirmed: boolean
}

type TripCreate = Omit<TripDetails, "id"| "is_confirmed"> & {
    email_to_invite: string[]
}

async function getById(id: string) {
    try {
        const {data} = await api.get<{trip: TripDetails}>(`/trips/${id}`);
        return data.trip;
    } catch (error) {
        throw error;
    }
} 

async function create({destination, starts_at, ends_at, email_to_invite}: TripCreate){
    const payload = {
        destination: destination,
        starts_at: starts_at,
        ends_at: ends_at,
        email_to_invite: email_to_invite,
        owner_name: "Anania Augusto",
        owner_email: "ananiasjaimeaugusto@example.com", 
    }
    try {
        const { data } = await api.post<{tripId: string}>(`/trips`, payload);
        return data;
    } catch (error) {
        throw error;
    }
}

export const tripServer = { getById, create }