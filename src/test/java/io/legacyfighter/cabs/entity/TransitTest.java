package io.legacyfighter.cabs.entity;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.time.LocalDateTime;
import java.time.ZoneId;

import org.junit.jupiter.api.Test;

public class TransitTest {

  @Test
  void shouldCalculatePriceForNewYearsEve() {
      // Arrange
      Transit transit = new Transit();

      transit.setStatus(Transit.Status.DRAFT);

      LocalDateTime sylwester = LocalDateTime.of(2021, 12, 31, 23, 0);
      transit.setDateTime(sylwester.atZone(ZoneId.systemDefault()).toInstant());

      transit.setKm(10.0f);

      // Act
      Integer price = transit.estimateCost();

      // Assert
      assertEquals(4600, price);
  }

    @Test
    void shouldCalculatePriceForRegularDay() {
        // Arrange
        Transit transit = new Transit();
        transit.setStatus(Transit.Status.DRAFT); // Dla bezpieczeństwa

        // Zwykły dzień (nie piątek wieczór, nie weekend, nie święto)
        LocalDateTime regularDay = LocalDateTime.of(2021, 4, 14, 10, 0); // Środa, 10:00
        transit.setDateTime(regularDay.atZone(ZoneId.systemDefault()).toInstant());

        transit.setKm(20.0f); // 20 km

        // Act
        Integer price = transit.estimateCost();

        // Assert
        // Logika z Transit.java:
        // Rok > 2018
        // Dzień roboczy (Środa) -> kmRate = 1.0f
        // baseFee = 8 (stała) + 1 = 9
        // Cena = (20 km * 1.0 * 1 (factor)) + 9 = 29.00
        assertEquals(2900, price);
    }
}
