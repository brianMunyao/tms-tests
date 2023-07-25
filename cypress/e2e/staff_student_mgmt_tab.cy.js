/// <reference types="Cypress"/>
import { faker } from "@faker-js/faker";

describe("staff/student management tab", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.get(".p-menuitem-link").contains("Staff/Student Management").click();

    // Tabs
    cy.get('a[role="tab"]').contains("Students").as("StudentsTab");
    cy.get('a[role="tab"]').contains("Staff").as("StaffTab");
  });

  it("visits the page succesfully", () => {
    // check whether page has changed
    cy.get(".app-content h1").should("have.text", "Staff & Student Management");
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
    cy.get(".card").first().find("tbody tr").should("have.length.at.least", 1);
  });

  describe("New Staff Form", () => {
    const staffInfo = {
      email: faker.internet.email(),
      password: faker.internet.password(),
      suffix: faker.helpers.arrayElement(["Mr", "Mrs", "Ms", "Dr", "Prof"]),
      firstName: faker.person.firstName(),
      surname: faker.person.lastName(),
      phoneNumber: faker.phone.number("+254 7## ### ###"),
      trainer: "test2@gmail.com",
    };

    // navigate to new staff form
    beforeEach(() => {
      cy.visit("/");
      cy.get(".p-menuitem-link").contains("Staff/Student Management").click();
      cy.getByTestId("add-new-staff-button").click();
      cy.get("button").contains("Save Changes").as("SaveChanges");
    });

    it("gives input error if required fields are missing", () => {
      cy.get("@SaveChanges").click();

      cy.get("span").contains("Invalid email provided").should("exist");
      cy.get("span").contains("Field is required").should("exist");
    });

    it("creates a new staff", () => {
      /**
       * Account Information
       */
      cy.getByPlaceholder("Email Address").eq(0).type(staffInfo.email);
      cy.getByPlaceholder("Password").type(staffInfo.password);

      /**
       * Personal Information
       */
      cy.get("span").contains("Suffix").click();
      cy.get(".p-dropdown-item").contains(staffInfo.suffix).click();

      cy.getByPlaceholder("First Name*").type(staffInfo.firstName);
      cy.getByPlaceholder("Surname*").type(staffInfo.surname);
      cy.getByPlaceholder("Phone Number").eq(0).type(staffInfo.phoneNumber);

      cy.get("span").contains("Trainer").click();
      cy.get(".p-dropdown-item").contains(staffInfo.trainer).click();

      /**
       * Class Assignment
       */
      cy.get("span.p-dropdown-label").contains("Cohort").click();
      cy.get(".p-dropdown-item").eq(0).click();

      cy.get("button").contains("Save Changes").click();
      cy.intercept(
        "POST",
        "https://tms-staging-api.azurewebsites.net/staff"
      ).as("insertStaff");

      cy.wait("@insertStaff").its("response.statusCode").should("eq", 201);

      // TODO: Check if the staff was added???
      // Go back after successfully submiting
      cy.go("back");
    });
  });

  describe("New Student Form", () => {
    const studentInfo = {
      suffix: faker.helpers.arrayElement(["Mr", "Mrs", "Ms", "Dr", "Prof"]),
      firstName: faker.person.firstName(),
      surname: faker.person.lastName(),
      phoneNumber: faker.phone.number("+254 7## ### ###"),
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
      cy.visit("/");
      cy.get(".p-menuitem-link").contains("Staff/Student Management").click();
      cy.getByTestId("add-new-student-button").click();
      cy.get("button").contains("Save Changes").as("SaveChanges");
    });

    it("gives input error if required fields are missing", () => {
      cy.get("@SaveChanges").click();

      cy.get("span").contains("Invalid email provided").should("exist");
      cy.get("span").contains("Field is required").should("exist");
    });

    it("creates a new student", () => {
      /**
       *
       * Personal Information
       */
      cy.get("span").contains("Suffix").click();
      cy.get(".p-dropdown-item").contains(studentInfo.suffix).click();

      cy.getByPlaceholder("First Name*").type(studentInfo.firstName);
      cy.getByPlaceholder("Surname*").type(studentInfo.surname);

      cy.getByPlaceholder("Email Address").eq(0).type(studentInfo.email);
      cy.getByPlaceholder("Phone Number").type(studentInfo.phoneNumber);

      /**
       *
       * Education Information
       */
      cy.getByPlaceholder("University Name").type(studentInfo.campus);
      cy.getByPlaceholder("Subject Major").type(studentInfo.major);

      cy.get(".p-calendar-w-btn-right input").click();

      cy.get(".p-datepicker").find("span").contains("20").click(); // 20th current month

      /**
       *
       * TMS Class Section
       */
      cy.get("span").contains("Please select an option").eq(0).click();
      cy.get(".p-dropdown-item").first().click();

      //after the value above is selected this becomes the only span with that text
      cy.get("span").contains("Please select an option").eq(0).click();
      cy.get(".p-dropdown-item").first().click();

      cy.get("button").contains("Save Changes").click();

      cy.intercept(
        "POST",
        "https://tms-staging-api.azurewebsites.net/api/students"
      ).as("insertStudent");

      cy.wait("@insertStudent").its("response.statusCode").should("eq", 201);

      // TODO: Check if the student was added???
      // Go back after succefully submiting
      cy.go("back");
    });
  });
});
