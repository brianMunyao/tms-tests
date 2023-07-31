// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

import data from "../fixtures/data.json";

Cypress.Commands.add("getByTestId", (testId, ...args) => {
  cy.get(`[data-testid=${testId}]`, ...args);
});

Cypress.Commands.add("getByPlaceholder", (placeholder, ...args) => {
  cy.get(`input[placeholder*="${placeholder}"]`, ...args);
});

Cypress.Commands.add("openStaffStudentTab", () => {
  cy.visit("/");
  cy.get(".p-menuitem-link").contains("Staff/Student Management").click();
});

Cypress.Commands.add("fillNewStaffForm", (staffInfo) => {
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

  cy.get("button[aria-label='Trainer']").click();
  cy.get(".p-autocomplete-item").eq(0).click();

  /**
   * Class Assignment
   */
  cy.get("span.p-dropdown-label").contains("Cohort").click();
  cy.get(".p-dropdown-item").eq(0).click();

  // cy.get("button").contains("Save Changes").click();
});

Cypress.Commands.add("fillNewStudentForm", (studentInfo) => {
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

  cy.selectDate("20-8-2025");

  /**
   *
   * TMS Class Section
   */
  cy.get("span").contains("Please select an option").eq(0).click();
  cy.get(".p-dropdown-item").first().click();

  //after the value above is selected this becomes the only span with that text
  cy.get("span").contains("Please select an option").eq(0).click();
  cy.get(".p-dropdown-item").first().click();

  // cy.get("button").contains("Save Changes").click();
});

Cypress.Commands.add("getElAndSetAlias", (selector, alias, index = 0) => {
  cy.get(selector).each(($el) => {
    if (Cypress.$.isArray($el)) {
      cy.wrap($el).eq(index).as(alias);
    } else {
      cy.wrap($el).as(alias);
    }
  });
});

Cypress.Commands.add("selectDate", (dateToPick, index = 0) => {
  const dateInfo = dateToPick.split("-");
  const months = data.months;

  const day = dateInfo[0];
  const month = months[dateInfo[1] - 1];
  const year = dateInfo[2];

  cy.getElAndSetAlias(".p-datepicker", "DatePicker", index);

  cy.getElAndSetAlias("button.p-datepicker-prev", "PrevBtn", index);

  cy.getElAndSetAlias("button.p-datepicker-next", "NextBtn", index);

  cy.getElAndSetAlias(".p-datepicker-month", "Month", index);

  cy.getElAndSetAlias(".p-datepicker-year", "Year", index);

  let yearChanged = false;

  //select year
  cy.get("@Year").then((elem) => {
    if (elem.text() !== year) {
      cy.get("@Year").click();
      cy.get(".p-yearpicker-year").contains(year).click();
      yearChanged = true;
    }
    console.log(yearChanged);

    if (yearChanged) {
      cy.get(".p-monthpicker-month").contains(month.substring(0, 3)).click();
    } else {
      cy.get("@Month").then((elem) => {
        if (elem.text() !== month) {
          cy.get("@Month").click();
          cy.get(".p-monthpicker-month")
            .contains(month.substring(0, 3))
            .click();
        }
      });
    }

    cy.get("@DatePicker")
      .find("td")
      .not(".p-datepicker-other-month")
      .contains(day)
      .click();
  });
});
