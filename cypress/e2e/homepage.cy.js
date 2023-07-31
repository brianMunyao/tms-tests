/// <reference types="Cypress" />

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

      const classes = res.response.body.results;

      //
      // Open Cohort
      //
      const cohorts = classes.filter(
        (c) => c.classType.classTypeName === "Cohort"
      );

      if (classes.length > 0) {
        cy.get("@ClassesContainer")
          .find(".p-menuitem")
          .should("have.length.above", 1);
      }

      if (cohorts.length > 0) {
        const oneCohort = cohorts[0];
        cy.get(".p-menuitem").contains(oneCohort.name).click();
        cy.get("h1").contains(oneCohort.name).should("exist");
      }

      //
      // Update student grades
      //

      cy.get(".p-datatable-tbody")
        .find('tr[role="row"]')
        .eq(0)
        .find("button.p-row-toggler")
        .click();

      cy.get(".p-datatable-row-expansion")
        .contains("Professional Skills")
        .should("exist");

      cy.get(".p-datatable-row-expansion").find("button.p-button").click();

      cy.get("h2").contains("Student Name").should("exist");

      cy.fillGradesForm();

      //
      // Open Attachment
      //
      const attachments = classes.filter(
        (c) => c.classType.classTypeName === "Attachment"
      );

      if (attachments.length > 0) {
        const oneAttachment = attachments[0];

        cy.get("@ClassesContainer")
          .find(".p-submenu-header")
          .contains("Attachments")
          .parent()
          .nextAll(".p-menuitem")
          .contains(oneAttachment.name)
          .click();

        cy.get("h1").contains(oneAttachment.name).should("exist");
      }

      //
      // Update student grades
      //

      cy.get(".p-datatable-tbody")
        .find('tr[role="row"]')
        .eq(0)
        .find("button.p-row-toggler")
        .click();

      cy.get(".p-datatable-row-expansion")
        .contains("Professional Skills")
        .should("exist");

      cy.get(".p-datatable-row-expansion").find("button.p-button").click();

      cy.get("h2").contains("Student Name").should("exist");

      cy.fillGradesForm();
    });
  });
});
