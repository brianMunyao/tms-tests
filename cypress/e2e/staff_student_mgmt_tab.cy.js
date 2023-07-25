/// <reference types="Cypress"/>

describe("staff/student management tab", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.get(".p-menuitem-link").contains("Staff/Student Management").click();
  });

  it("visits the page succesfully", () => {
    // check whether page has changed
    cy.get(".app-content h1").should("have.text", "Staff & Student Management");
  });

  it("filters on search", () => {
    // cy.intercept(
    //   "GET",
    //   "https://tms-staging-api.azurewebsites.net/staff?searchValue=&sortColumn=FirstName&sortOrder=ASC&pageSize=10&pageNumber=1&isActive=true"
    // ).as("staffQuery");
    // cy.wait("@staffQuery");
    cy.getByTestId("staff-panel")
      .find(".card")
      .should("have.length", 2)
      .first()
      .find("tbody tr")
      .should("have.length", 10);

    cy.getByTestId("search-input").type("briantest");

    cy.getByTestId("staff-panel")
      .find(".card")
      .first()
      .find("tbody tr")
      .should("have.length", 1);
  });

  it("creates a new staff", () => {
    const staffInfo = {
      email: "briantest@gmail.com",
      password: "password",
      suffix: "Mr",
      firstName: "brian",
      surname: "test",
      phoneNumber: "0712345678",
      trainer: "test2@gmail.com",
    };

    // click new staff btn
    cy.getByTestId("add-new-staff-button").click();

    cy.getByPlaceholder("Email Address").eq(0).type(staffInfo.email);
    cy.getByPlaceholder("Password").type(staffInfo.password);

    cy.get("span").contains("Suffix").click();
    cy.get(".p-dropdown-item").contains(staffInfo.suffix).click();

    cy.getByPlaceholder("First Name*").type(staffInfo.firstName);
    cy.getByPlaceholder("Surname*").type(staffInfo.surname);
    cy.getByPlaceholder("Phone Number").eq(0).type(staffInfo.phoneNumber);

    cy.get("span").contains("Trainer").click();
    cy.get(".p-dropdown-item").contains(staffInfo.trainer).click();

    cy.get("span.p-dropdown-label").contains("Cohort").click();
    cy.get(".p-dropdown-item").eq(0).click();

    cy.get("button").contains("Save Changes").click();

    //! Go back after successfully submiting
    cy.go("back");
  });

  it("creates a new student", () => {
    const studentInfo = {
      suffix: "Mr",
      firstName: "brian",
      surnmame: "teststudent",
      email: "brianteststudent@gmail.com",
      phoneNumber: "0711223344",
      campus: "Jomo Kenyatta",
      major: "Degree in Acturial Science",
    };

    /**
     *
     * Personal Information
     */

    // click new staff btn
    cy.getByTestId("add-new-student-button").click();

    cy.get("span").contains("Suffix").click();
    cy.get(".p-dropdown-item").contains(studentInfo.suffix).click();

    cy.getByPlaceholder("First Name*").type(studentInfo.firstName);
    cy.getByPlaceholder("Surname*").type(studentInfo.surnmame);

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
    //! Go back after succefully submiting
    // cy.go("back");
  });
});
