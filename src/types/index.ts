export type Role = 'Admin' | 'Instructor' | 'Salesperson';

export interface User {
  id: string;
  nombre: string;
  email: string;
  password?: string; // Optional for safety in some contexts, but needed for management
  role: Role;
  puntos_totales: number;
}

export interface Lesson {
  id: string;
  module_id: string;
  titulo: string;
  contenido_texto: string;
  video_url?: string;
  imagenes_array: string[];
}

export interface QuizQuestion {
  id: string;
  pregunta: string;
  opciones: string[];
  respuesta_correcta: number; // Index of the correct option
}

export interface Module {
  id: string;
  course_id: string;
  orden: number;
  titulo: string;
  imagen_modulo: string;
  lessons: Lesson[];
  quiz?: QuizQuestion[];
}

export interface Course {
  id: string;
  titulo: string;
  descripcion: string;
  imagen_caratula: string;
  status: 'Available' | 'In Progress' | 'Completed';
  modules: Module[];
}

export interface Progress {
  user_id: string;
  course_id: string;
  modulo_id: string;
  lecciones_vistas: string[]; // IDs of lessons seen
  score_trivia: number;
  tiempo_respuesta: number; // in seconds
  completed: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}
