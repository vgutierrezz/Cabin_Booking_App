import { CardComponent } from '../../component/Card/CardComponent';
import { SearchComponent } from '../../component/Search/SearchComponent';

import { useEffect, useState, useMemo } from 'react';

import './home.css';
import { FooterComponent } from '../../component/Footer/FooterComponent';

// Defino el DTO que voy a recibir
type CabinDTO = {
    id: number;
    name: string;
    description: string;
    image: string;
    capacity: number;
    rating: number;
    price: number;
    street: string;
    number: number;
    location: string;
    province: string;
    country: string;
    categoryName: string;
};

export const Home = () => {

    // Estados para las cabañas por categoría
    const [rusticas, setRusticas] = useState<CabinDTO[]>([]);
    const [modernas, setModernas] = useState<CabinDTO[]>([]);
    const [ecologicas, setEcologicas] = useState<CabinDTO[]>([]);

    // Estados para manejo de carga y error
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Función para traer cabañas por categoría
    const fetchCabinsByCategory = async (category: string): Promise<CabinDTO[]> => {
        const encodedCategory = encodeURIComponent(category);
        try {
            const res = await fetch(`http://localhost:8080/cabins/category/${encodedCategory}`);

            const contentType = res.headers.get("content-type");
            if (!res.ok) {
                const text = await res.text(); // leer como texto para ver qué vino
                throw new Error(`Error ${res.status} (${res.statusText}): ${text}`);
            }

            if (contentType && contentType.includes("application/json")) {
                return await res.json();
            } else {
                const text = await res.text();
                throw new Error(`Respuesta no JSON: ${text}`);
            }
        } catch (err) {
            console.error("Error en fetch:", err);
            throw err;
        }
    };


    useEffect(() => {
        setLoading(true);
        setError(null);
        const categories = ['Rústica', 'Moderna', 'Ecológica'];

        Promise.all(categories.map(cat => fetchCabinsByCategory(cat)))
            .then(([rusticasData, modernasData, ecologicasData]) => {
                setRusticas(rusticasData);
                setModernas(modernasData);
                setEcologicas(ecologicasData);
            })
            .catch((err) => {
                console.error(err);
                setError('Error al cargar cabañas. Intenta nuevamente.');
            })
            .finally(() => setLoading(false));
    }, []);

    // Función para mostrar 2 cabañas aleatorias de cada categoría
    function getRandomTwo<T>(array: T[]): T[] {
        const shuffled = [...array].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 2);
    }

    // Memoizar para evitar que se mezclen las cabañas en cada render
    const randomRusticas = useMemo(() => getRandomTwo(rusticas), [rusticas]);
    const randomModernas = useMemo(() => getRandomTwo(modernas), [modernas]);
    const randomEcologicas = useMemo(() => getRandomTwo(ecologicas), [ecologicas]);

    // Función para mapear datos de CabinDTO a props de CardComponent
    const mapToCardProps = (c: CabinDTO) => ({
        id: c.id,
        title: c.name,
        description: c.description,
        image: c.image
    });

    return (
        <>
            <SearchComponent />
            {loading && <p>Cargando cabañas...</p>}
            {error && <p className="error">{error}</p>}
            {!loading && !error && (
                <main>
                    <div className='buscador-container'>
                        <h3>Cabañas Rústicas</h3>
                        <CardComponent cabins={randomRusticas.map(mapToCardProps)} />
                    </div>

                    <div className='categoria-container'>
                        <h3>Cabañas Modernas</h3>
                        <CardComponent cabins={randomModernas.map(mapToCardProps)} />
                    </div>

                    <div className='recomendaciones-container'>
                        <h3>Cabañas Ecológicas</h3>
                        <CardComponent cabins={randomEcologicas.map(mapToCardProps)} />
                    </div>
                </main>
            )}
        </>
    );
};
