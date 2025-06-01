
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Client {
  id: string
  nume_complet: string
  cnp: string
  nr_carte_identitate: string
  permis_conducere: string
  telefon: string
  email: string
  created_at: string
}

export interface Vehicle {
  id: string
  marca: string
  model: string
  numar_inmatriculare: string
  status: 'disponibil' | 'inchiriat' | 'mentenanta'
  created_at: string
}

export interface Reservation {
  id: string
  client_id: string
  vehicle_id: string
  data_inceput: string
  data_sfarsit: string
  status: 'activa' | 'finalizata' | 'anulata'
  observatii?: string
  created_at: string
}

export interface Transaction {
  id: string
  reservation_id: string
  suma: number
  status: 'platit' | 'neplatit'
  created_at: string
}
