import './home.css'
import { HeaderComponent } from '../../component/Header/HeaderComponent';
import { CardComponent } from '../../component/Card/CardComponent';
import { SearchComponent } from '../../component/Search/SearchComponent'

export const Home = () => {
    return (
        <>
            <HeaderComponent/>
            <SearchComponent/>
            <main>

            <div className='buscador-container'>
                <h3>Buscador</h3>
                <div className='card-container'>
                    <CardComponent/>
                </div>
            </div>

            <div className='categoria-container'>
                <h3>Categorías</h3>
                <div className='card-container'>
                    <CardComponent/>
                </div>
                    
            </div>

            <div className='recomendaciones-container'> 
                <h3>Recomendaciones</h3>
                <div className='card-container'>
                    <CardComponent/>
                </div>
            </div>
        </main>
        </>
    )
};
