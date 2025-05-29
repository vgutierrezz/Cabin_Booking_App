package com.proyectofinal.api.config;

import com.proyectofinal.api.dto.AddressDTO;
import com.proyectofinal.api.dto.CabinDTO;
import com.proyectofinal.api.model.Address;
import com.proyectofinal.api.model.Cabin;
import com.proyectofinal.api.model.Category;
import com.proyectofinal.api.repository.ICabinRepository;
import com.proyectofinal.api.repository.ICategoryRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final ICategoryRepository categoryRepository;
    private final ICabinRepository cabinRepository;

    public DataInitializer(ICategoryRepository categoryRepository, ICabinRepository cabinRepository) {
        this.categoryRepository = categoryRepository;
        this.cabinRepository = cabinRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (categoryRepository.count() == 0) {
            Category rustica = categoryRepository.save(new Category("Rústica", "Cabañas rústicas de montaña"));
            Category moderna = categoryRepository.save(new Category("Moderna", "Cabañas modernas y equipadas"));
            Category ecologica = categoryRepository.save(new Category("Ecológica", "Cabañas ecológicas sustentables"));

            //CREO LAS CABAÑAS
            cabinRepository.save(new Cabin(
                    "Cabaña del Sol",
                    "Cabaña cálida y acogedora en la montaña",
                    "img",
                    4,
                    6500,
                    new Address("Calle de la Mancha", 123, "Madrid", "Madrid", "España"),
                    rustica
            ));

            cabinRepository.save(new Cabin(
                    "Cabaña El Refugio",
                    "Ideal para escapadas románticas en plena naturaleza",
                    "img",
                    2,
                    7200,
                    new Address("Ruta Provincial 5", 340, "Villa General Belgrano", "Córdoba", "Argentina"),
                    rustica
            ));

            cabinRepository.save(new Cabin(
                    "Cabaña La Tranquera",
                    "Una cabaña rústica con vista a las sierras",
                    "img",
                    3,
                    6900,
                    new Address("Ruta 38", 220, "La Cumbre", "Córdoba", "Argentina"),
                    rustica
            ));

            cabinRepository.save(new Cabin(
                    "Cabaña Tierra Adentro",
                    "Rústica, sencilla y perfecta para desconectarse",
                    "img",
                    3,
                    6200,
                    new Address("Calle de la Paz", 90, "Tafí del Valle", "Tucumán", "Argentina"),
                    rustica
            ));

            // MODERNAS
            cabinRepository.save(new Cabin(
                    "Cabaña Monteverde",
                    "Conexión plena con la naturaleza y excelente ubicación",
                    "img",
                    4,
                    7400,
                    new Address("Sendero Verde", 101, "El Bolsón", "Río Negro", "Argentina"),
                    moderna
            ));

            cabinRepository.save(new Cabin(
                    "Cabaña El Ceibo",
                    "Moderna pero con toques rústicos y excelente equipamiento",
                    "img",
                    4,
                    7000,
                    new Address("Camino de los Artesanos", 300, "Mina Clavero", "Córdoba", "Argentina"),
                    moderna
            ));

            cabinRepository.save(new Cabin(
                    "Cabaña Las Lomas",
                    "Estilo alpino y mucha calidez en sus ambientes",
                    "img",
                    6,
                    9200,
                    new Address("Loma del Sol", 88, "San Martín de los Andes", "Neuquén", "Argentina"),
                    moderna
            ));

            // ECOLÓGICAS
            cabinRepository.save(new Cabin(
                    "Cabaña Amanecer",
                    "Una vista inigualable al lago desde todas las habitaciones",
                    "img",
                    2,
                    8000,
                    new Address("Av. del Lago", 456, "Villa La Angostura", "Neuquén", "Argentina"),
                    ecologica
            ));

            cabinRepository.save(new Cabin(
                    "Cabaña Zorzal",
                    "Una hermosa cabaña rodeada de naturaleza",
                    "img",
                    3,
                    7000,
                    new Address("Calle Zorzal", 123, "San Martín de los Andes", "Neuquén", "Argentina"),
                    ecologica
            ));

            cabinRepository.save(new Cabin(
                    "Cabaña Los Pinos",
                    "Amplia cabaña en medio de un bosque de pinos",
                    "img",
                    5,
                    8600,
                    new Address("Av. de los Pinos", 178, "Esquel", "Chubut", "Argentina"),
                    ecologica
            ));
        }
    }
}


