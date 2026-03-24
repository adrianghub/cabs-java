import { describe, it, expect } from "vitest";
import { ClientSchema } from "../../schemas/client.schema";
import { DriverSchema } from "../../schemas/driver.schema";
import { TransitSchema } from "../../schemas/transit.schema";
import { AddressSchema } from "../../schemas/address.schema";
import { ClaimSchema } from "../../schemas/claim.schema";
import { ContractSchema } from "../../schemas/contract.schema";
import { CarTypeSchema } from "../../schemas/carType.schema";
import { AwardsAccountSchema } from "../../schemas/awards.schema";

describe("Zod Schemas", () => {
  describe("ClientSchema", () => {
    it("parses valid client", () => {
      const data = {
        id: 1,
        type: "VIP",
        name: "John",
        lastName: "Doe",
        defaultPaymentType: "PRE_PAID",
        clientType: "INDIVIDUAL",
      };
      expect(ClientSchema.parse(data)).toEqual(data);
    });

    it("accepts null fields", () => {
      const data = { id: null, type: null, name: null };
      expect(() => ClientSchema.parse(data)).not.toThrow();
    });

    it("accepts empty object", () => {
      expect(() => ClientSchema.parse({})).not.toThrow();
    });

    it("rejects invalid type enum", () => {
      expect(() =>
        ClientSchema.parse({ type: "SUPER_VIP" }),
      ).toThrow();
    });
  });

  describe("DriverSchema", () => {
    it("parses valid driver", () => {
      const data = {
        id: 1,
        firstName: "Jane",
        lastName: "Smith",
        driverLicense: "FARME100165AB2TT",
        status: "ACTIVE",
        type: "REGULAR",
      };
      expect(DriverSchema.parse(data)).toEqual(data);
    });

    it("rejects invalid status", () => {
      expect(() =>
        DriverSchema.parse({ status: "SUSPENDED" }),
      ).toThrow();
    });
  });

  describe("AddressSchema", () => {
    it("parses valid address", () => {
      const data = {
        country: "Poland",
        city: "Warsaw",
        street: "Main St",
        buildingNumber: 10,
      };
      expect(AddressSchema.parse(data)).toEqual(data);
    });
  });

  describe("TransitSchema", () => {
    it("parses transit with nested objects", () => {
      const data = {
        id: 1,
        status: "DRAFT",
        from: { city: "Warsaw", street: "A" },
        to: { city: "Krakow", street: "B" },
        carClass: "ECO",
        clientDTO: { id: 1, name: "John" },
        proposedDrivers: [{ id: 1, firstName: "Jane" }],
      };
      expect(() => TransitSchema.parse(data)).not.toThrow();
    });

    it("rejects invalid transit status", () => {
      expect(() =>
        TransitSchema.parse({ status: "FLYING" }),
      ).toThrow();
    });
  });

  describe("ClaimSchema", () => {
    it("parses valid claim", () => {
      const data = {
        claimID: 1,
        clientId: 1,
        transitId: 1,
        reason: "Bad ride",
        status: "DRAFT",
        claimNo: "CLM-001",
      };
      expect(ClaimSchema.parse(data)).toEqual(data);
    });
  });

  describe("ContractSchema", () => {
    it("parses contract with attachments", () => {
      const data = {
        id: 1,
        subject: "Partnership",
        partnerName: "ACME",
        status: "NEGOTIATIONS_IN_PROGRESS",
        contractNo: "CNT-001",
        attachments: [{ id: 1, status: "PROPOSED" }],
      };
      expect(() => ContractSchema.parse(data)).not.toThrow();
    });
  });

  describe("CarTypeSchema", () => {
    it("parses valid car type", () => {
      const data = {
        id: 1,
        carClass: "PREMIUM",
        status: "ACTIVE",
        carsCounter: 5,
        activeCarsCounter: 3,
      };
      expect(CarTypeSchema.parse(data)).toEqual(data);
    });
  });

  describe("AwardsAccountSchema", () => {
    it("parses awards with nested client", () => {
      const data = {
        client: { id: 1, name: "John" },
        isActive: true,
        transactions: 10,
      };
      expect(() => AwardsAccountSchema.parse(data)).not.toThrow();
    });
  });
});
