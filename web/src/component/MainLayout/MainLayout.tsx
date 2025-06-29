import { HeaderComponent } from '../Header/HeaderComponent';
import { FooterComponent } from '../Footer/FooterComponent';
import { Outlet } from 'react-router-dom';

export const MainLayout = () => {
    return (
        <div className="d-flex flex-column min-vh-100">
            <HeaderComponent />
            <main className="flex-grow-1">
                <Outlet /> {/* Acá se renderizan las vistas */}
            </main>
            <FooterComponent />
        </div>
    );
};
