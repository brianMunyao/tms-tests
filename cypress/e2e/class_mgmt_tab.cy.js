/// <reference types="Cypress"/>
import { faker } from "@faker-js/faker";
import classes from "../fixtures/classes.json";

describe("class management tab", () => {
  beforeEach(() => {
    cy.intercept(
      "GET",
      "https://tms-staging-api.azurewebsites.net/api/classes"
    ).as("getClasses");

    cy.visit("/");
    cy.get(".p-menuitem-link").contains("Class Management").click();
    cy.get(".app-content h1").should("have.text", "Class Management");
  });

  const newClass = {
    name: faker.helpers.arrayElement(classes.techClasses),
    type: faker.helpers.arrayElement(["cohort", "attachment"]),
  };

  describe("New Class Form", () => {
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
      cy.getByPlaceholder("Class Name*").type(newClass.name, {
        matchCase: false,
      });
      cy.get(".p-dropdown-label").contains("Type of class").click();
      cy.get(".p-dropdown-item")
        .contains(newClass.type, { matchCase: false })
        .click();

      // TODO: implement a good way to set the date

      // for the start date
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
      cy.get(".p-datatable").eq(1).should("contain.text", newClass.name);
    });
  });

  describe("Actions on a class in the list", () => {
    const classToTest = "Redux";

    beforeEach(() => {
      cy.wait("@getClasses"); // wait for the classes to be retrieved

      cy.contains('tr[role="row"]', classToTest)
        .find("button")
        .as("optionsBtn");

      cy.get("@optionsBtn").click();

      cy.get(".p-dialog-title")
        .contains(`${classToTest} Actions`)
        .should("exist");
    });

    it("can open the created class and update through (View Details)", () => {
      // Check if user can close the opened dialog box
      cy.get(".p-dialog-header").find('button[aria-label="Close"]').click();
      cy.get("@optionsBtn").click();

      cy.get("li").contains("View Details").click();

      // check if the correct page was opened with disabled inputs
      cy.get("input[name='details.className']").as("nameInput");
      cy.get("@nameInput").should("have.value", classToTest).and("be.disabled");

      cy.get("button span").contains("Edit").click();

      cy.get("@nameInput")
        .should("have.value", classToTest)
        .and("not.be.disabled");

      //TODO: Click update details
    });

    it("can open the created class and update through (Edit)", () => {
      cy.get("li").contains("Edit").click();

      // check if the correct page was opened with disabled inputs
      cy.get("input[name='details.className']")
        .should("have.value", classToTest)
        .and("not.be.disabled");

      //TODO: Click update details
    });
  });
});
