import './SearchComponent.css'

export const SearchComponent = () => {
    return (
        <>
            {/* Segunda fila centrada */}
            <div className="w-100 d-flex justify-content-center busqueda-custom">
                <form className="d-flex" role="search">
                    <input
                        className="form-control me-2 custom-width"
                        type="search"
                        placeholder="Buscá tu próximo alojamiento"
                        aria-label="Search"
                    />
                    <button className="btn btn-outline-success button-search" type="submit">
                        Buscar
                    </button>
                </form>
            </div>
        </>
    )
};
