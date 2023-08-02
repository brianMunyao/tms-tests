/// <reference types="Cypress" />

const attachmentToTest = "Machine Learning with TensorFlow";
const cohortToTest = "Internet of Things (IoT) Applications";

describe("Homepage tests", () => {
  beforeEach(() => {
    cy.intercept(
      "GET",
      "https://tms-staging-api.azurewebsites.net/api/classes"
    ).as("getClasses");

    cy.visit("/");

    cy.getByTestId("test-id__sidebar-menu").as("SideBar");
  });

  it("retrieves cohorts and attachments successfully", () => {
    cy.wait("@getClasses").its("response.statusCode").should("eq", 200);
  });

  it("can open a cohort and an attachment direct from sidebar", () => {
    cy.get(".p-submenu-header").contains("Cohorts").as("CohortHeader");
    cy.get(".p-submenu-header").contains("Attachments").as("AttachmentHeader");

    cy.wait("@getClasses").then((res) => {
      cy.get(".p-menu-list")
        .contains("Cohorts")
        .parent()
        .parent()
        .as("ClassesContainer");

      //
      // Open Cohort
      //
      cy.get("@ClassesContainer")
        .find(".p-menuitem-link")
        .should("have.length.above", 1);

      cy.get(".p-menuitem-link").contains(cohortToTest).click();

      //
      // Update student grades
      //

      cy.get(".p-datatable-tbody")
        .find('tr[role="row"]')
        .eq(0)
        .find("button.p-row-toggler")
        .click();

      cy.get("span").contains("Professional Skills").should("exist");

      cy.get(".p-datatable-wrapper").find("button.p-button").first().click();

      cy.get("h2").contains("Student Name").should("exist");

      cy.fillGradesForm();

      //
      // Open Attachment
      //
      cy.get("@ClassesContainer")
        .find(".p-submenu-header")
        .contains("Attachments")
        .parent()
        .nextAll(".p-menuitem")
        .should("have.length.above", 1);

      cy.get(".p-menuitem-link").contains(attachmentToTest).click();

      //
      // Update student grades
      //

      cy.get(".p-datatable-tbody")
        .find('tr[role="row"]')
        .eq(0)
        .find("button.p-row-toggler")
        .click();

      cy.get("span").contains("Professional Skills").should("exist");

      cy.get(".p-datatable-wrapper").find("button.p-button").click();

      cy.get("h2").contains("Student Name").should("exist");

      cy.fillGradesForm();
    });
  });
});
