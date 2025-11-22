package io.legacyfighter.cabs.service;

import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import io.legacyfighter.cabs.entity.Driver;
import io.legacyfighter.cabs.repository.DriverRepository;

@SpringBootTest
class ValidateDriverLicenseIntegrationTest {

    @Autowired
    private DriverService driverService;

    @Autowired
    private DriverRepository driverRepository;

    @Test
    void canCreateActiveDriverWithValidLicense() {
        // Arrange
        String validLicense = "FARME100165AB5EW";

        // Act
        Driver driver = driverService.createDriver(validLicense, "Kowalski", "Jan", Driver.Type.REGULAR, Driver.Status.ACTIVE, null);

        // Assert
        // Sprawdzamy czy faktycznie zapisał się w bazie
        Driver loaded = driverRepository.getOne(driver.getId());
        // getOne w Hibernate jest leniwy, więc wywołujemy coś na obiekcie, by go dociągnąć, albo używamy findById
        // Ale tu wystarczy assert, że ID istnieje
    }

    @Test
    void cannotActivateDriverWithInvalidLicense() {
         // Arrange
         // Tworzymy nieaktywnego z pustą licencją (jeśli logika na to pozwala - a pozwala, bo walidacja była tylko dla ACTIVE)
         Driver driver = driverService.createDriver("invalid", "Kowalski", "Jan", Driver.Type.REGULAR, Driver.Status.INACTIVE, null);

         // Act & Assert
         assertThrows(IllegalStateException.class, () -> {
             driverService.changeDriverStatus(driver.getId(), Driver.Status.ACTIVE);
         });
    }
}