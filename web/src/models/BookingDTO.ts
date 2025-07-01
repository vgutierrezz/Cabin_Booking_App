export interface BookingDTO {
  id: number;
  cabinName: string;
  startDate: string; // ISO string
  endDate: string;   // ISO string
  userId: number;
  cabinId: number;
  rating?: number; // Calificación del 1 al 5, opcional
}
