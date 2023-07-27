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

  cy.get("span").contains("Trainer").click();
  cy.get(".p-dropdown-item").eq(0).click();

  /**
   * Class Assignment
   */
  cy.get("span.p-dropdown-label").contains("Cohort").click();
  cy.get(".p-dropdown-item").eq(0).click();

  cy.get("button").contains("Save Changes").click();
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
});
