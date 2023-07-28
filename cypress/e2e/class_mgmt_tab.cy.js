/// <reference types="Cypress"/>
import { faker } from "@faker-js/faker";

describe("class management tab", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.get(".p-menuitem-link").contains("Class Management").click();
    cy.get(".app-content h1").should("have.text", "Class Management");
  });

  describe("New Class Form", () => {
    const myClass = {
      name: faker.company.buzzNoun(),
      type: faker.helpers.arrayElement(["cohort", "attachment"]),
    };

    beforeEach(() => {
      // navigate to the new class form
      cy.get("button").contains("New Class").click();
      cy.get("button").contains("Create/Update Class").as("CreateClassBtn");
    });

    it("Navigates to the correct form", () => {
      cy.get(".app-content h1").should("have.text", "Create New Class");
    });

    it("Gives an error if required fields are missing", () => {
      cy.get("@CreateClassBtn").click();
      cy.get("span").contains("Field is required").should("exist");
    });

    it("Creates a new class successfully", () => {
      cy.getByPlaceholder("Class Name*").type(myClass.name);
      cy.get(".p-dropdown-label").contains("Type of class").click();
      cy.get(".p-dropdown-item").contains(myClass.type).click();

      // for the start date
      // TODO: implement a good way to set the date
      //

      cy.get(".p-calendar-w-btn-right input").eq(0).click();
      cy.get(".p-datepicker").find("td").contains("10").first().click(); // 10th current month

      // for the end date
      cy.get(".p-calendar-w-btn-right input").eq(1).click();
      cy.get("td").contains("20").eq(-1).click(); // 20th current month

      cy.get('input[inputmode="numeric"]').type(20);

      cy.get(".p-dropdown-label").contains("Trainer").click();
      cy.get(".p-dropdown-item").eq(0).click();

      cy.get("textarea").type("Class Description goes here");

      cy.get("@CreateClassBtn").click();

      //check if page navigates back
      cy.url().should("include", "/class/management");

      // assert that the new class is created and is inactive
      cy.get(".p-datatable").eq(1).should("contain.text", myClass.name);
    });
  });
});
