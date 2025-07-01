package com.proyectofinal.api.configuration;

import com.proyectofinal.api.model.*;
import com.proyectofinal.api.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.*;

@Component
public class DataInitializer implements CommandLineRunner {

    private final ICategoryRepository categoryRepository;
    private final ICabinRepository cabinRepository;
    private final IImageRepository imageRepository;
    private final IUserRepository userRepository;
    private final IFeatureRepository featureRepository;
    private final PasswordEncoder passwordEncoder;
    private final IFavoritesRepository favoritesRepository;
    private final IBookingRepository bookingRepository;

    public DataInitializer(ICategoryRepository categoryRepository, ICabinRepository cabinRepository,
                           IImageRepository imageRepository, IUserRepository userRepository, IFeatureRepository featureRepository,
                           PasswordEncoder passwordEncoder, IFavoritesRepository favoritesRepository, IBookingRepository bookingRepository) {
        this.categoryRepository = categoryRepository;
        this.cabinRepository = cabinRepository;
        this.imageRepository = imageRepository;
        this.userRepository = userRepository;
        this.featureRepository = featureRepository;
        this.passwordEncoder = passwordEncoder;
        this.favoritesRepository = favoritesRepository;
        this.bookingRepository = bookingRepository;
    }

    private byte[] loadImage(String filename) {
        try {
            ClassPathResource imgFile = new ClassPathResource("static/img/" + filename);
            return imgFile.getInputStream().readAllBytes();
        } catch (IOException e) {
            System.err.println("No se pudo cargar la imagen: " + filename + ". Usando imagen por defecto.");
            try {
                return new ClassPathResource("static/img/default.jpg").getInputStream().readAllBytes();
            } catch (IOException ex) {
                throw new RuntimeException("No se pudo cargar la imagen por defecto");
            }
        }
    }

    @Override
    public void run(String... args) throws Exception {

        // CREAR USUARIO ADMIN SI NO EXISTE
        if (userRepository.findByEmail("admin@email.com").isEmpty()) {
            User admin = new User();
            admin.setFirstName("Nombre");
            admin.setLastName("Apellido");
            admin.setEmail("admin@email.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(Role.ADMIN);
            userRepository.save(admin);
            System.out.println("Usuario admin creado");
        }

        // CREAR USUARIO COMÚN SI NO EXISTE
        if (userRepository.findByEmail("usuario@email.com").isEmpty()) {
            User usuario = new User();
            usuario.setFirstName("Nombre Usuario");
            usuario.setLastName("Apellido Usuario");
            usuario.setEmail("usuario@email.com");
            usuario.setPassword(passwordEncoder.encode("usuario123"));
            usuario.setRole(Role.USER);
            userRepository.save(usuario);
            System.out.println("Usuario normal creado");
        }

        // CARGAR CATEGORÍAS Y CABAÑAS SI NO EXISTEN
        if (categoryRepository.count() == 0) {

            if (featureRepository.count() == 0) {
                List<String> nombresFeatures = List.of(
                        "wifi",
                        "aire",
                        "mascota",
                        "pileta",
                        "tv",
                        "estacionamiento",
                        "desayuno",
                        "parrilla",
                        "calefaccion",
                        "cocina",
                        "balcón",
                        "jardin",
                        "seguridad"
                );

                for (String nombre : nombresFeatures) {
                    Feature feature = Feature.builder()
                            .name(nombre)
                            .build();
                    featureRepository.save(feature);
                }

                System.out.println("Características iniciales creadas.");
            }

            Category rustica = categoryRepository.save(new Category("Rústica", "Cabañas rústicas de montaña"));
            Category moderna = categoryRepository.save(new Category("Moderna", "Cabañas modernas y equipadas"));
            Category ecologica = categoryRepository.save(new Category("Ecológica", "Cabañas ecológicas sustentables"));

            // Fragmento relevante dentro del método run()
            List<Feature> allFeatures = featureRepository.findAll();
            Random random = new Random();

            List<Cabin> cabins = List.of(
                    Cabin.builder()
                            .name("Cabaña del Sol")
                            .description("Cálida y acogedora")
                            .capacity(4)
                            .price(6500)
                            .address(new Address("Calle de la Mancha", 123, "Madrid", "Madrid", "España"))
                            .category(rustica)
                                    .images(new ArrayList<>())
                            .build(),
                    Cabin.builder()
                            .name("Cabaña El Refugio")
                            .description("Escapadas románticas")
                            .capacity(2)
                            .price(7200)
                            .address(new Address("Ruta Provincial 5", 340, "Villa General Belgrano", "Córdoba", "Argentina"))
                            .category(rustica)
                            .images(new ArrayList<>())
                            .build(),
                    Cabin.builder()
                            .name("Cabaña La Tranquera")
                            .description("Vista a las sierras")
                            .capacity(3)
                            .price(6900)
                            .address(new Address("Ruta 38", 220, "La Cumbre", "Córdoba", "Argentina"))
                            .category(rustica)
                            .images(new ArrayList<>())
                            .build(),
                    Cabin.builder()
                            .name("Cabaña Tierra Adentro")
                            .description("Perfecta para desconectarse")
                            .capacity(3)
                            .price(6200)
                            .address(new Address("Calle de la Paz", 90, "Tafí del Valle", "Tucumán", "Argentina"))
                            .category(rustica)
                            .images(new ArrayList<>())
                            .build(),
                    Cabin.builder()
                            .name("Cabaña Monteverde")
                            .description("Excelente ubicación")
                            .capacity(4)
                            .price(7400)
                            .address(new Address("Sendero Verde", 101, "El Bolsón", "Río Negro", "Argentina"))
                            .category(moderna)
                            .images(new ArrayList<>())
                            .build(),
                    Cabin.builder()
                            .name("Cabaña El Ceibo")
                            .description("Toques rústicos y buen equipamiento")
                            .capacity(4)
                            .price(7000)
                            .address(new Address("Camino de los Artesanos", 300, "Mina Clavero", "Córdoba", "Argentina"))
                            .category(moderna)
                            .images(new ArrayList<>())
                            .build(),
                    Cabin.builder()
                            .name("Cabaña Las Lomas")
                            .description("Estilo alpino y calidez")
                            .capacity(6)
                            .price(9200)
                            .address(new Address("Loma del Sol", 88, "San Martín de los Andes", "Neuquén", "Argentina"))
                            .category(moderna)
                            .images(new ArrayList<>())
                            .build(),
                    Cabin.builder()
                            .name("Cabaña Amanecer")
                            .description("Vista al lago")
                            .capacity(2)
                            .price(8000)
                            .address(new Address("Av. del Lago", 456, "Villa La Angostura", "Neuquén", "Argentina"))
                            .category(ecologica)
                            .images(new ArrayList<>())
                            .build(),
                    Cabin.builder()
                            .name("Cabaña Zorzal")
                            .description("Rodeada de naturaleza")
                            .capacity(3)
                            .price(7000)
                            .address(new Address("Calle Zorzal", 123, "San Martín de los Andes", "Neuquén", "Argentina"))
                            .category(ecologica)
                            .images(new ArrayList<>())
                            .build(),
                    Cabin.builder()
                            .name("Cabaña Los Pinos")
                            .description("En bosque de pinos")
                            .capacity(5)
                            .price(8600)
                            .address(new Address("Av. de los Pinos", 178, "Esquel", "Chubut", "Argentina"))
                            .category(ecologica)
                            .images(new ArrayList<>())
                            .build()
            );

            int imageIndex = 1;
            for (Cabin c : cabins) {
                // Selecciono de 2 a 4 características aleatorias
                Set<Feature> selectedFeatures = new HashSet<>();
                int featureCount = 3 + random.nextInt(10);
                while (selectedFeatures.size() < featureCount) {
                    Feature randomFeature = allFeatures.get(random.nextInt(allFeatures.size()));
                    selectedFeatures.add(randomFeature);
                }

                c.setFeatures(selectedFeatures);
                cabinRepository.save(c);

                // Cargar una única imagen para esta cabaña:
                String imageFileName = "cabania" + imageIndex + ".jpg";
                byte[] imageData = loadImage(imageFileName);

                Image image = new Image(imageFileName, imageData, c);
                c.getImages().add(image);


                cabinRepository.save(c);

                imageIndex++;
            }
            // GUARDO ALGUNAS CABAÑAS EN FAV PARA ROLE_USER
            Optional<User> userOpt = userRepository.findByEmail("usuario@email.com");
            if (userOpt.isPresent()) {
                User user = userOpt.get();

                List<Cabin> allCabins = cabinRepository.findAll();
                if (allCabins.size() >= 3) {
                    for (int i = 0; i < 3; i++) {
                        Cabin cabin = allCabins.get(i);
                        if (!favoritesRepository.existsByUserAndCabin(user, cabin)) {
                            Favorite favorite = Favorite.builder()
                                    .user(user)
                                    .cabin(cabin)
                                    .build();
                            favoritesRepository.save(favorite);
                        }
                    }
                    System.out.println("3 cabañas favoritas asignadas al usuario.");
                    // AGREGAR UNA RESERVA FINALIZADA PARA EL USUARIO ROLE_USER
                    if (cabins.size() >= 1) {
                        Cabin finishedCabin = cabins.get(5); // primera cabaña
                        Booking finishedBooking = Booking.builder()
                                .cabin(finishedCabin)
                                .user(user)
                                .startDate(java.time.LocalDate.of(2024, 5, 1))
                                .endDate(java.time.LocalDate.of(2024, 5, 10))
                                .build();
                        bookingRepository.save(finishedBooking);
                        System.out.println("Reserva finalizada creada para usuario rol USER en cabaña id " + finishedCabin.getId());
                    }
                } else {
                    System.out.println("No hay suficientes cabañas para asignar favoritos.");
                }
            }


        }

    }
}
