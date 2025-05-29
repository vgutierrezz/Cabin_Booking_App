import './home.css'
import { HeaderComponent } from '../../component/Header/HeaderComponent';
import { CardComponent } from '../../component/Card/CardComponent';
import { SearchComponent } from '../../component/Search/SearchComponent'
import { useEffect, useState } from 'react';
import { NavBarAdminComponent } from '../../component/NavBarAdmin/NavBarAdminComponent';

//Defino el DTO que voy a recibir
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

    const [rusticas, setRusticas] = useState<CabinDTO[]>([]);
    const [modernas, setModernas] = useState<CabinDTO[]>([]);
    const [ecologicas, setEcologicas] = useState<CabinDTO[]>([]);

    //Obtengo las cabañas por categoría
    const fetchCabinsByCategory = async (category: string, setState: React.Dispatch<React.SetStateAction<CabinDTO[]>>) => {
        try {
            const encodedCategory = encodeURIComponent(category);
            const res = await fetch(`http://localhost:8080/cabins/category/${encodedCategory}`);
            if (!res.ok) throw new Error('Error al obtener cabañas');
            const data = await res.json();
            setState(data);
        } catch (error) {
            console.error(`Error al cargar ${category}:`, error);
        }
    };

    useEffect(() => {
        fetchCabinsByCategory('Rústica', setRusticas);
        fetchCabinsByCategory('Moderna', setModernas);
        fetchCabinsByCategory('Ecológica', setEcologicas);
    }, []);

    //Función para mostrar 2 cabañas aleatorias de cada categoría
    function getRandomTwo<T>(array: T[]): T[] {
        const shuffled = [...array].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 2);
    }

    return (
        <>
            <NavBarAdminComponent />
            <SearchComponent />
            <main>
                <div className='buscador-container'>
                    <h3>Cabañas Rústicas</h3>
                    <CardComponent cabins={getRandomTwo(rusticas).map(c => ({
                        id: c.id,
                        title: c.name,
                        description: c.description,
                        image: c.image
                    }))} />
                </div>

                <div className='categoria-container'>
                    <h3>Cabañas Modernas</h3>
                    <CardComponent cabins={getRandomTwo(modernas).map(c => ({
                        id: c.id,
                        title: c.name,
                        description: c.description,
                        image: c.image
                    }))} />
                </div>

                <div className='recomendaciones-container'>
                    <h3>Cabañas Ecológicas</h3>
                    <CardComponent cabins={getRandomTwo(ecologicas).map(c => ({
                        id: c.id,
                        title: c.name,
                        description: c.description,
                        image: c.image
                    }))} />
                </div>
            </main>
        </>
    )
};
