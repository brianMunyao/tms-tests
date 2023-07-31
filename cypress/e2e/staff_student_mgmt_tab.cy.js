/// <reference types="Cypress"/>
import { faker } from "@faker-js/faker";

describe("staff/student management tab", () => {
  beforeEach(() => {
    cy.intercept("POST", "https://tms-staging-api.azurewebsites.net/staff").as(
      "insertStaff"
    );

    cy.intercept(
      "POST",
      "https://tms-staging-api.azurewebsites.net/api/students"
    ).as("insertStudent");

    cy.openStaffStudentTab();
    cy.get(".app-content h1").should("have.text", "Staff & Student Management");
  });

  describe("Search operations", () => {
    beforeEach(() => {
      cy.get('a[role="tab"]').contains("Students").as("StudentsTab");
      cy.get('a[role="tab"]').contains("Staff").as("StaffTab");
    });

    it("filters staff on search", () => {
      cy.get("@StaffTab").click();
      cy.getByTestId("staff-panel")
        .find(".card")
        .should("have.length", 2)
        .first()
        .find("tbody tr")
        .should("have.length", 10);

      cy.getByTestId("search-input").type("briantest"); // One user with this name exists

      cy.getByTestId("staff-panel")
        .find(".card")
        .first()
        .find("tbody tr")
        .should("have.length", 1);
    });

    it("filters students on search", () => {
      const existingStudent = "brianteststudent@gmail.com";

      cy.get("@StudentsTab").click();

      cy.get("span").contains("Student Name").should("exist");

      cy.getByTestId("search-input").type(existingStudent);
      cy.get(".card")
        .first()
        .find("tbody tr")
        .should("have.length.at.least", 1);
    });
  });

  describe("New Staff Form", () => {
    const staffInfo = {
      email: faker.internet.email(),
      password: faker.internet.password({ prefix: "Hello1." }),
      suffix: faker.helpers.arrayElement(["Mr", "Mrs", "Ms", "Dr", "Prof"]),
      firstName: faker.person.firstName(),
      surname: faker.person.lastName(),
      phoneNumber: faker.phone.number("2547########"),
    };

    beforeEach(() => {
      cy.getByTestId("add-new-staff-button").click();
      cy.get("button").contains("Save Changes").as("SaveChanges");
    });

    it("gives input error if required fields are missing", () => {
      cy.get("@SaveChanges").click();

      cy.get("span").contains("Invalid email provided").should("exist");
      cy.get("span").contains("Field is required").should("exist");
    });

    it("gives an error if password pattern is not matched", () => {
      cy.fillNewStaffForm({ ...staffInfo, password: "12345678" });

      cy.get("span").contains("Invalid password").should("exist");
    });

    it("gives an error when the email given already exists", () => {
      cy.fillNewStaffForm({ ...staffInfo, email: "briantest@gmail.com" });

      cy.wait("@insertStaff").its("response.statusCode").should("eq", 400);
    });

    it("creates a new staff", () => {
      cy.fillNewStaffForm(staffInfo);

      cy.wait("@insertStaff", { timeout: 10000 })
        .its("response.statusCode")
        .should("eq", 201);
    });
  });

  describe("New Student Form", () => {
    const studentInfo = {
      suffix: faker.helpers.arrayElement(["Mr", "Mrs", "Ms", "Dr", "Prof"]),
      firstName: faker.person.firstName(),
      surname: faker.person.lastName(),
      phoneNumber: faker.phone.number("2547########"),
      email: faker.internet.email(),
      campus: faker.helpers.arrayElement([
        "JKUAT",
        "KU",
        "UON",
        "DEKUT",
        "USIU",
      ]),
      major: `Degree in ${faker.company.buzzNoun()}`,
    };

    beforeEach(() => {
      cy.getByTestId("add-new-student-button").click();
      cy.get("button").contains("Save Changes").as("SaveChanges");
    });

    it("gives input error if required fields are missing", () => {
      cy.get("@SaveChanges").click();

      cy.get("span").contains("Invalid email provided").should("exist");
      cy.get("span").contains("Field is required").should("exist");
    });

    //TODO: Should give an error if email exists

    it("creates a new student", () => {
      cy.fillNewStudentForm(studentInfo);

      cy.wait("@insertStudent").its("response.statusCode").should("eq", 201);
    });
  });
});
