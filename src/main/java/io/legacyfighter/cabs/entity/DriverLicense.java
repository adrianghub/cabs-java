package io.legacyfighter.cabs.entity;

import javax.persistence.Column;
import javax.persistence.Embeddable;

@Embeddable
public class DriverLicense {
  public static final String DRIVER_LICENSE_REGEX = "^[A-Z9]{5}\\d{6}[A-Z9]{2}\\d[A-Z]{2}$";

  @Column(name = "driver_license")
  private String license;

  protected DriverLicense() {
  }

  private DriverLicense(String license) {
    this.license = license;
  }

  public static DriverLicense withLicense(String license) {
    if (license == null || license.isEmpty() || !license.matches(DRIVER_LICENSE_REGEX)) {
      throw new IllegalArgumentException("Invalid license: " + license);
    }

    return new DriverLicense(license);
  }

  public static DriverLicense withoutValidation(String license) {
    return new DriverLicense(license);
  }

  public String asString() {
    return license;
  }
}
