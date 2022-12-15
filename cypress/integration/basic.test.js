// set environment URL in cypress.env.json to run in desired environment
const baseUrl = Cypress.env('host')

context('Lodgify contact page', () => {

  it('Page title is correct', () => {
    cy.visit(baseUrl + '/Contact.html');
    cy.title().should('equal', 'Contact');
  });

  it('Name field displays an error when it is left empty', () => {
      cy.get('input[name="name"]').as('name').clear();
      cy.get('input[name="phone"]').click();
      cy.get('.ui.input.error').should('contain', 'Name is mandatory');
      cy.get('@name').type('testName' + new Date().getTime());
  });

  it('Phone number field displays an error when it is left empty', () => {
      cy.get('input[name="phone"]').as('phone').type('+37123344567')
      cy.get('@phone').clear();
      cy.get('input[name="guests"]').type('1');
      cy.get('.ui.input.error').should('contain', 'Example error message for Phone field');
  });

  it('Email address field displays an error when it is left empty', () => {
      cy.get('input[name="email"]').as('email').type('hello@wor.ld');
      cy.get('@email').clear();
      cy.get('form[data-testid="form"]').click();
      cy.get('.ui.input.error').should('contain', 'Email is mandatory');
      cy.get('@email').type('hello@wor.ld');
  });

  it('Comment textarea displays an error when it is left empty', () => {
      cy.get('form[data-testid="form"]')
          .find('textarea')
          .as('comment')
          .type('automation test by Dmitry');
      cy.get('@comment').clear();
      cy.get('input[name="phone"]').click();
      cy.get('.ui.input.error').should('contain', 'Comment is mandatory');
  });

  it('Choosing dates from the date picker sets the correct date value', () => {
      // click it to open the date picker
      cy.get('.DateRangePickerInput > :nth-child(2)').as('setDate');
      cy.get('@setDate').click();

      // give the date picker element an alias and click next month until it is April
      cy.get('.DayPicker_transitionContainer')

      // set the dates for the test
      const arrival = new Date(2023, 4-1, 14)
      const departure = new Date(2023, 6-1, 14)
      const formArrDate = arrival.toLocaleDateString("en-GB", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
      });

      const formDepDate = departure.toLocaleDateString("en-GB", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
      });

      const monthList = ["January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"];
      let leftMonthText = '';
      let rightMonthText = '';

      cy.wrap(monthList).each((month) => {
          if(month === monthList[departure.getMonth()]) return false;
          cy.get('body').then($body => {
              if ($body.find('.DayPickerNavigation_rightButton__horizontalDefault').length > 0) {
                  cy.get('.DayPickerNavigation_rightButton__horizontalDefault')
                      .as('dateRightArrow')
                      .then($rightArrow => {
                          if ($rightArrow.is(':visible')) {
                              cy.get('@dateRightArrow').click();
                          }
                      });

                  // find month captions, give them aliases, and then store their calendar contents
                  cy.get(':nth-child(2) > .CalendarMonth > .CalendarMonth_caption')
                      .then(($leftMonthCap) => {
                          leftMonthText = $leftMonthCap.text();
                          if (leftMonthText.includes(monthList[arrival.getMonth()])) {
                              cy.get(':nth-child(2) > .CalendarMonth > .CalendarMonth_table')
                                  .contains(arrival.getDate())
                                  .click();
                          }
                      });
                  cy.get(':nth-child(3) > .CalendarMonth > .CalendarMonth_caption')
                      .then(($rightMonthCap) => {
                          rightMonthText = $rightMonthCap.text();
                          if (rightMonthText.includes(monthList[departure.getMonth()])) {
                              cy.get(':nth-child(3) > .CalendarMonth > .CalendarMonth_table')
                                  .contains(departure.getDate())
                                  .click();
                          };
                      });
              };
          });
      });
      cy.get('input[value="' + formArrDate + '"]').should('have.value', '14/04/2023');
      cy.get('input[value="' + formDepDate + '"]').should('have.value', '14/06/2023');
      cy.get('form[data-testid="form"]')
          .find('textarea')
          .as('comment')
          .clear();
      cy.get('@comment').type('Date picker automation test by Dmitry');
  });

  it('User cannot submit contact form without a valid name', () => {
      cy.get('input[name="name"]').as('name').clear();
      cy.get('input[name="phone"]').as('phone').clear().type('+37123344567')
      cy.get('input[name="email"]').as('email').clear().type('hello@wor.ld');
      cy.get('input[name="guests"]').as('guests').clear().type('1');
      cy.get('form[data-testid="form"]')
          .find('textarea')
          .as('comment')
          .clear()
          .type('Name validation automation test by Dmitry');
      cy.get('button[type=submit]').should('be.disabled');
  });

  it('User cannot submit contact form without a valid Phone number', () => {
      cy.get('input[name="name"]').as('name').clear().type('testName' + new Date().getTime());
      cy.get('input[name="phone"]').as('phone').clear();
      cy.get('input[name="email"]').as('email').clear().type('hello@wor.ld');
      cy.get('input[name="guests"]').as('guests').clear().type('1');
      cy.get('form[data-testid="form"]')
          .find('textarea')
          .as('comment')
          .clear()
          .type('Phone number validation automation test by Dmitry');
      cy.get('button[type=submit]').should('be.disabled');
  });

  it('User cannot submit contact form without a valid email', () => {
      cy.get('input[name="name"]').as('name').clear().type('testName' + new Date().getTime());
      cy.get('input[name="phone"]').as('phone').clear().type('+37123344567');
      cy.get('input[name="email"]').as('email').clear();
      cy.get('input[name="guests"]').as('guests').clear().type('1');
      cy.get('form[data-testid="form"]')
          .find('textarea')
          .as('comment')
          .clear()
          .type('Email validation automation test by Dmitry');
      cy.get('button[type=submit]').should('be.disabled');
  });

  it('User cannot submit contact form without a comment', () => {
      cy.get('input[name="name"]').as('name').clear().type('testName' + new Date().getTime());
      cy.get('input[name="phone"]').as('phone').clear().type('+37123344567');
      cy.get('input[name="email"]').as('email').clear().type('hello@wor.ld');
      cy.get('input[name="guests"]').as('guests').clear().type('1');
      cy.get('form[data-testid="form"]')
          .find('textarea')
          .as('comment')
          .clear();
      cy.get('@phone').click();
      cy.get('button[type=submit]').should('be.disabled');
  });
});

context('Lodgify pricing page', () => {
  it('Page title is correct', () => {
    cy.visit(baseUrl + '/Pricing.html');
    cy.title().should('equal', 'Lodgify Pricing | Affordable Vacation Rental Software From $11');
  });

  it('Yearly plan with 50 rentals displays correct Starter plan pricing info (USD)', () => {
      let rentals = 50;
    cy.get('#scroll-prop-plan').type(
        '{backspace}' + rentals
    );
    cy.get('.plan-price-2').should('contain', '$64');
  });

  it('Yearly plan with 50 rentals displays correct Professional plan pricing info (USD)', () => {
    cy.get('.plan-price-1').should('contain', '$375');
  });

  it('Yearly plan with 50 rentals displays correct Ultimate plan pricing info (USD)', () => {
    cy.get('.plan-price-3').should('contain', '$525');
  });

  it('Changing currency in drop-down list changes currency symbol of pricing plans', () => {
    cy.get('select').select('gbp');
    cy.get('.price-item').should('contain','£');
    cy.get('select').select('eur');
    cy.get('.price-item').should('contain', '€');
    cy.get('select').select('usd');
    cy.get('.price-item').should('contain','$');
  });
});