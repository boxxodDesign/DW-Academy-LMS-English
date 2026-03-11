import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Course, Progress, AuthState } from '../types';

interface LMSStore extends AuthState {
  users: User[];
  courses: Course[];
  progress: Progress[];
  
  // Auth Actions
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  
  // Admin Actions
  addUser: (user: User) => void;
  deleteUser: (userId: string) => void;
  addCourse: (course: Course) => void;
  updateCourse: (courseId: string, updates: Partial<Course>) => void;
  deleteCourse: (courseId: string) => void;
  
  // Progress Actions
  updateProgress: (progress: Progress) => void;
}

// Mock Data
const initialUsers: User[] = [
  { id: '1', nombre: 'Admin User', email: 'admin@lms.com', password: 'password123', role: 'Admin', puntos_totales: 0 },
  { id: '2', nombre: 'Instructor John', email: 'instructor@lms.com', password: 'password123', role: 'Instructor', puntos_totales: 0 },
  { id: '3', nombre: 'Salesperson John', email: 'juan@lms.com', password: 'password123', role: 'Salesperson', puntos_totales: 150 },
];

const initialCourses: Course[] = [
  {
    id: 'c1',
    titulo: '9000 Series: Professional Engineering',
    descripcion: 'The flagship hardware of DW Drums. Master the technical specifications, adjustments, and maintenance of the industry-standard 9000 series pedals and stands.',
    imagen_caratula: 'https://drumcenternh.com/cdn/shop/products/dw9000tourpack.jpg?v=1695221894',
    status: 'Available',
    modules: [
      {
        id: 'm1',
        course_id: 'c1',
        orden: 1,
        titulo: '9000 Series Pedals: Infinite Adjustability',
        imagen_modulo: 'https://images.unsplash.com/photo-1558979158-65a1eaa08691?auto=format&fit=crop&w=800&q=80',
        lessons: [
          {
            id: 'l1',
            module_id: 'm1',
            titulo: 'Infinite Adjustable Cam & Drive',
            contenido_texto: 'The 9000 Series pedals features the patented Infinite Adjustable Cam, allowing drummers to easily change the cam from an Accelerator™ style (eccentric) for increased speed to a Turbo™ style (linear) for a more powerful stroke. This module also covers the Free-Floating Rotor Drive system which ensures direct energy transfer from the footboard to the beater.',
            video_url: 'https://www.youtube.com/embed/S2O6xT0F8m0', // Example DW 9000 video
            imagenes_array: []
          },
          {
            id: 'l2',
            module_id: 'm1',
            titulo: 'Patented Floating Swivel Spring',
            contenido_texto: 'Learn how the Floating Swivel Spring increases efficiency on both the downstroke and return stroke. By reducing resistance, it creates an exceptionally smooth feel. We also explore the Tri-Pivot Toe Clamp which uses three self-aligning rubber pads to secure the pedal to any bass drum hoop without damage.',
            imagenes_array: []
          }
        ],
        quiz: [
          { id: 'q1', pregunta: 'What does the "Infinite Adjustable Cam" allow in the 9000 pedal?', opciones: ['Change beater weight', 'Adjust between Accelerator and Turbo', 'Add a second pedal', 'Change pedal color'], respuesta_correcta: 1 },
          { id: 'q2', pregunta: 'What is the function of the Tri-Pivot Toe Clamp?', opciones: ['Increase speed', 'Securely grip the bass drum without damaging the hoop', 'Silence impact', 'Adjust spring tension'], respuesta_correcta: 1 }
        ]
      },
      {
        id: 'm2',
        course_id: 'c1',
        orden: 2,
        titulo: '9500 Hi-Hats: Precision Response',
        imagen_modulo: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
        lessons: [
          {
            id: 'l1',
            module_id: 'm2',
            titulo: 'Double Eccentric Cam & Spring Tension',
            contenido_texto: 'The 9500 Hi-Hat stand utilizes a Patented Double Eccentric Cam that increases the sensitivity of the footboard in relation to cymbal movement. You will learn to adjust the Infinitely Adjustable Locking Spring Tension to offset the weight of various top cymbals for a personalized feel.',
            imagenes_array: []
          },
          {
            id: 'l2',
            module_id: 'm2',
            titulo: 'Lateral Cymbal Seat & SM379 Clutch',
            contenido_texto: 'This lesson covers the Lateral Cymbal Seat for instant bottom cymbal angle adjustment and the SM379 Locking Clutch which allows for precise "sloshiness" control that stays locked during performance.',
            imagenes_array: []
          }
        ],
        quiz: [{ id: 'q3', pregunta: 'What advantage does the Lateral Cymbal Seat offer?', opciones: ['Greater height', 'Instant bottom cymbal angle adjustment', 'Lighter weight', 'Eliminates vibrations'], respuesta_correcta: 1 }]
      },
      {
        id: 'm3',
        course_id: 'c1',
        orden: 3,
        titulo: '9300 Snare Stands & TechLock',
        imagen_modulo: 'https://images.unsplash.com/photo-1541533260371-b8fabc4b0652?auto=format&fit=crop&w=800&q=80',
        lessons: [
          {
            id: 'l1',
            module_id: 'm3',
            titulo: 'Offset Basket & TechLock Security',
            contenido_texto: 'The 9300 Snare Stand features an offset basket for optimal positioning with double pedal setups. We dive into the TechLock secondary locking system which ensures your snare angle remains exactly where you set it, even under the heaviest playing.',
            imagenes_array: []
          }
        ],
        quiz: [{ id: 'q4', pregunta: 'What is the TechLock system for?', opciones: ['Adjust height', 'Secondary locking to prevent angle changes', 'Reduce weight', 'Measure stroke force'], respuesta_correcta: 1 }]
      }
    ]
  },
  {
    id: 'c2',
    titulo: '5000 Series: The Industry Standard',
    descripcion: 'Used by professionals worldwide. Learn the legendary durability and patented features of the 5000 Series pedals and stands.',
    imagen_caratula: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80',
    status: 'Available',
    modules: [
      {
        id: 'm4',
        course_id: 'c2',
        orden: 1,
        titulo: '5000AD4 Pedals: Accelerator Drive',
        imagen_modulo: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=800&q=80',
        lessons: [
          {
            id: 'l4',
            module_id: 'm4',
            titulo: 'Accelerator™ Cam & Dual-Chain',
            contenido_texto: 'The 5000AD4 Accelerator™ Drive pedal features an eccentric cam that shortens the stroke length, increasing velocity and sensitivity for quick, powerful kick strokes. Learn about the robust Dual-Chain drive and the importance of chain alignment for peak performance.',
            video_url: 'https://www.youtube.com/embed/H0WfU1S3w3Y', // Example 5000 video
            imagenes_array: []
          },
          {
            id: 'l5',
            module_id: 'm4',
            titulo: 'Tri-Pivot Clamp & Delta Hinge',
            contenido_texto: 'The Tri-Pivot Toe Clamp features three independent 360-degree rotating rubber pads that securely grip almost any bass drum hoop. Discover the engineering behind the Delta Ball-Bearing Hinge which uses lightweight aluminum to maximize fluid footboard action.',
            imagenes_array: []
          }
        ],
        quiz: [
          { id: 'q5', pregunta: 'What effect does the "Accelerator Cam" have on the 5000 pedal?', opciones: ['Reduces weight', 'Increases velocity and sensitivity', 'Maintains constant tension', 'Eliminates noise'], respuesta_correcta: 1 },
          { id: 'q6', pregunta: 'How many rotating rubber pads does the Tri-Pivot Toe Clamp have?', opciones: ['One', 'Two', 'Three', 'Four'], respuesta_correcta: 2 }
        ]
      },
      {
        id: 'm5',
        course_id: 'c2',
        orden: 2,
        titulo: '5500TD Hi-Hats: Tour Reliability',
        imagen_modulo: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80',
        lessons: [
          {
            id: 'l6',
            module_id: 'm5',
            titulo: 'Lateral Cymbal Seat Adjustment',
            contenido_texto: 'The 5500TD Hi-Hat stand includes the patented Lateral Cymbal Seat, allowing you to adjust the angle of the bottom cymbal on-the-fly. We also explore the Uni-body Folding Footboard which stays attached to the base during transport.',
            imagenes_array: []
          }
        ],
        quiz: [{ id: 'q7', pregunta: 'What is the advantage of the Uni-body Folding Footboard?', opciones: ['Colors can be changed', 'Stays attached to the base when folded', 'It is louder', 'Does not need cleaning'], respuesta_correcta: 1 }]
      }
    ]
  }
];

export const useLMSStore = create<LMSStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      users: initialUsers,
      courses: initialCourses,
      progress: [
        { user_id: '3', course_id: 'c1', modulo_id: 'm1', lecciones_vistas: ['l1'], score_trivia: 100, tiempo_respuesta: 45, completed: true },
        { user_id: '3', course_id: 'c1', modulo_id: 'm2', lecciones_vistas: [], score_trivia: 0, tiempo_respuesta: 0, completed: false },
      ],

      login: async (email, password) => {
        const user = get().users.find(u => u.email === email);
        if (user && user.password === password) {
          set({ user, isAuthenticated: true });
          return true;
        }
        return false;
      },

      logout: () => set({ user: null, isAuthenticated: false }),

      addUser: (user) => set((state) => ({ users: [...state.users, user] })),
      deleteUser: (userId) => set((state) => ({
        users: state.users.filter(u => u.id !== userId)
      })),
      addCourse: (course) => set((state) => ({ courses: [...state.courses, course] })),
      updateCourse: (courseId, updates) => set((state) => ({
        courses: state.courses.map(c => c.id === courseId ? { ...c, ...updates } : c)
      })),

      deleteCourse: (courseId) => set((state) => ({
        courses: state.courses.filter(c => c.id !== courseId)
      })),

      updateProgress: (newProgress) => set((state) => {
        const index = state.progress.findIndex(p => 
          p.user_id === newProgress.user_id && 
          p.course_id === newProgress.course_id && 
          p.modulo_id === newProgress.modulo_id
        );
        
        if (index > -1) {
          const updatedProgress = [...state.progress];
          updatedProgress[index] = { ...updatedProgress[index], ...newProgress };
          return { progress: updatedProgress };
        }
        return { progress: [...state.progress, newProgress] };
      }),
    }),
    {
      name: 'lms-storage',
    }
  )
);
