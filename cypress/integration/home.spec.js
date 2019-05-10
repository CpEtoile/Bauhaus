describe('Home Page', function() {
	it(`Should go to the Concepts page and come back`, function() {
		cy.server().visit(`/`);
		cy.get('li:nth-child(1) a').click();

		cy.url().should('match', /\/concepts$/);
		cy.go('back');
		cy.get('.page-title').contains(
			'Application de gestion des métadonnées de référence'
		);
	});

	it(`Should go to the Nomenclatures page and come back`, function() {
		cy.server().visit(`/`);
		cy.get('li:nth-child(2) a').click();
		cy.url().should('match', /\/classifications$/);
		cy.go('back');
		cy.get('.page-title').contains(
			'Application de gestion des métadonnées de référence'
		);
	});
	it(`Should go to the Operations page and come back`, function() {
		cy.server().visit(`/`);
		cy.get('li:nth-child(3) a').click();
		cy.url().should('match', /\/operations\/series$/);
		cy.go('back');
		cy.get('.page-title').contains(
			'Application de gestion des métadonnées de référence'
		);
	});
	it(`Should contain a footer`, function() {
		cy.server().visit(`/`);
		cy.get('footer').should('exist');
	});
});
