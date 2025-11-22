package io.legacyfighter.cabs.entity;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.Test;

class DriverLicenseTest {
  @Test
  void canCreateValidLicense() {
      // Arrange
      String validLicense = "FARME100165AB5EW";

      // Act
      DriverLicense license = DriverLicense.withLicense(validLicense);

      // Assert
      assertNotNull(license);
      assertEquals(validLicense, license.asString());
  }

  @Test
  void cannotCreateInvalidLicense() {
      // Act & Assert
      assertThrows(IllegalArgumentException.class, () -> {
          DriverLicense.withLicense("INVALID_LICENSE");
      });

      assertThrows(IllegalArgumentException.class, () -> {
          DriverLicense.withLicense("");
      });

      assertThrows(IllegalArgumentException.class, () -> {
          DriverLicense.withLicense(null);
      });
  }

  @Test
  void canCreateValidLicenseExplicitly() {
      // Arrange
      String invalidLicense = "INVALID";

      // Act
      DriverLicense license = DriverLicense.withoutValidation(invalidLicense);

      // Assert
      assertNotNull(license);
      assertEquals(invalidLicense, license.asString());
  }
}
