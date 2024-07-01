describe('The application', () => {

  beforeEach(() => {
    // Navigate to the root URL before each test
    cy.visit('/');
  });

  it('should display loading state initially', () => {
    cy.contains('Fetching Posts...').should('be.visible');
  });



  it('should fetch and display posts', () => {
    cy.request({
      url: 'https://jsonplaceholder.typicode.com/posts'
    }).then(
      () => {
        cy.get('.post-container app-post-id').should('have.length', 100);
      }
    )
  });

  it('should handle error state correctly', () => {
    cy.intercept('GET', 'https://jsonplaceholder.typicode.com/posts', {
      statusCode: 500,
      body: 'Error',
    }).as('getPostsError');

    cy.visit('/');
    cy.wait('@getPostsError');

    cy.contains('Sorry having trouble fetching posts, please try again later').should('be.visible');
  });



  it('should reset active post when button is clicked', () => {
    cy.request({
      url: 'https://jsonplaceholder.typicode.com/posts'
    }).then(
      () => {
        cy.get('.post-container app-post-id').first().click();
        cy.get('button').click();
        cy.contains('No Post selected').should('be.visible');
      }
    )
  });

  it('should display active post ID when a post is selected', () => {
    cy.request({
      url: 'https://jsonplaceholder.typicode.com/posts'
    }).then(
      () => {
        cy.get('.post-container app-post-id').first().click();
        cy.contains('Active Post ID : 1').should('be.visible');
      }
    )
  });


  it('should cycle through props when a post is clicked continuously', () => {
    cy.request({
      url: 'https://jsonplaceholder.typicode.com/posts'
    }).then(
      () => {
        cy.get('.post-container app-post-id').first().click();
        cy.get('.single-post').first().find('p').contains('body')

        cy.get('.post-container app-post-id').first().click();
        cy.get('.single-post').first().find('p').contains('userId')

        cy.get('.post-container app-post-id').first().click();
        cy.get('.single-post').first().find('p').contains('id')

        cy.get('.post-container app-post-id').first().click();
        cy.get('.single-post').first().find('p').contains('title')
      }
    )
  });

  it('should reset display prop of first post when another post is clicked and update active post id', () => {
    cy.request({
      url: 'https://jsonplaceholder.typicode.com/posts'
    }).then(
      () => {
        cy.get('.post-container app-post-id').first().click();
        cy.get('.single-post').first().find('p').contains('body')

        cy.get('.post-container app-post-id').last().click();
        cy.get('.single-post').first().find('p').contains('title')

        cy.contains('Active Post ID : 100').should('be.visible');
      }
    )
  });

})
