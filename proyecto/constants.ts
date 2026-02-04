

import { Camp, Review } from './types';

const sampleReviews: { [key: number]: Review[] } = {
    1: [
        { authorName: 'Familia García', authorAvatar: 'https://i.pravatar.cc/150?u=garcia', rating: 5, text: '¡Nuestros hijos volvieron encantados! Las actividades en la naturaleza son fantásticas y los monitores muy atentos.' },
        { authorName: 'Elena Rodríguez', authorAvatar: 'https://i.pravatar.cc/150?u=elena', rating: 4, text: 'Muy buena organización. Mi hija aprendió mucho sobre el medio ambiente y se divirtió a lo grande.' }
    ],
    2: [
        { authorName: 'Marcos Soler', authorAvatar: 'https://i.pravatar.cc/150?u=marcos', rating: 5, text: 'Si a tu hijo/a le gustan los deportes de agua, este es su campamento. El entorno del embalse es espectacular.' },
        { authorName: 'Lucía Jiménez', authorAvatar: 'https://i.pravatar.cc/150?u=lucia', rating: 5, text: 'Una experiencia inolvidable. El equipo de monitores es profesional y muy cercano. ¡Repetiremos seguro!' }
    ],
    3: [
        { authorName: 'Pedro Navarro', authorAvatar: 'https://i.pravatar.cc/150?u=pedro', rating: 4, text: 'La granja escuela es una maravilla. Los niños aprenden de verdad a cuidar de los animales. Muy recomendable.' }
    ],
    // ... add more sample reviews for other camps if needed
};

// Array vacío: los campamentos solo aparecerán cuando sean contratados y añadidos desde Supabase
export const CAMPS_DATA: Camp[] = [];