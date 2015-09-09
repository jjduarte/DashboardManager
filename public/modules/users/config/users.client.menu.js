'use strict';

// Configuring the Users module
angular.module('users').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'USUÁRIOS', 'users', 'dropdown', '/users(/create)?', 'false', '1,2', '1');
		Menus.addSubMenuItem('topbar', 'users', 'Listar', 'users');
		Menus.addSubMenuItem('topbar', 'users', 'Cadastrar', 'users/create');
		Menus.addMenuItem('topbar', 'HOME', 'dash-home', '', 'dash-home', 'false', '1,2,3', '0');
	}
]);
