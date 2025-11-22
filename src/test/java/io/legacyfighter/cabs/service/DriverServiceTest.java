package io.legacyfighter.cabs.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import java.lang.reflect.Field;
import java.util.Arrays;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import io.legacyfighter.cabs.entity.Driver;
import io.legacyfighter.cabs.entity.Transit;
import io.legacyfighter.cabs.repository.DriverRepository;
import io.legacyfighter.cabs.repository.TransitRepository;

@ExtendWith(MockitoExtension.class)
class DriverServiceTest {

    @Mock
    private DriverRepository driverRepository;

    @Mock
    private TransitRepository transitRepository;

    @Mock
    private DriverFeeService driverFeeService;

    @InjectMocks
    private DriverService driverService;

    @Test
    void calculateDriverMonthlyPayment() {
        // Arrange
        Long driverId = 1L;
        Driver driver = new Driver();
        setId(driver, driverId);

        Transit transit1 = new Transit();
        setId(transit1, 10L);
        Transit transit2 = new Transit();
        setId(transit2, 20L);

        when(driverRepository.getOne(driverId)).thenReturn(driver);
        when(transitRepository.findAllByDriverAndDateTimeBetween(any(), any(), any()))
                .thenReturn(Arrays.asList(transit1, transit2));
        when(driverFeeService.calculateDriverFee(10L)).thenReturn(100);
        when(driverFeeService.calculateDriverFee(20L)).thenReturn(200);

        // Act
        Integer result = driverService.calculateDriverMonthlyPayment(driverId, 2020, 10);

        // Assert
        assertEquals(300, result);
    }

    private void setId(Object entity, Long id) {
        try {
            Field field = io.legacyfighter.cabs.common.BaseEntity.class.getDeclaredField("id");
            field.setAccessible(true);
            field.set(entity, id);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
