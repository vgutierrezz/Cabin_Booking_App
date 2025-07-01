import { useState } from "react";
import { FiX } from "react-icons/fi";
import './Search.css'; // Asegurate de importar el CSS

interface SearchProps {
    onSearch: (keyword: string) => void;
}

export const Search = ({ onSearch }: SearchProps) => {
    const [keyword, setKeyword] = useState('');

    const handleSearch = () => {
        if (keyword.trim() === "") return;
        onSearch(keyword.trim());
    };

    const handleClear = () => {
        setKeyword("");
    };


    return (
        <form className="search-form" onSubmit={handleSearch}>
            <div className="search-input-wrapper">
                <input
                    type="text"
                    placeholder="Buscá tu próximo alojamiento"
                    className="search-input"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                />
                {keyword && (
                    <button
                        type="button"
                        onClick={handleClear}
                        aria-label="Limpiar búsqueda"
                        className="clear-button"
                    >
                        <FiX size={20} />
                    </button>
                )}
            </div>
            <button type="submit" className="search-button">
                Buscar
            </button>
        </form>
    );
};
