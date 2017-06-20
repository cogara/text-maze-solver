(function() {
    
urRouter.$inject = ['$stateProvider'];
angular.module('PeopleNetCodeChallenge', ['ui.router']);

angular.module('PeopleNetCodeChallenge').config(uiRouter);

function uiRouter($stateProvider) {
    var homeState = {
        name: 'index',
        url: '/',
        template: '/templates/maze.html',
        controller: 'MainController',
        controllerAs: 'main'
    }

    var aboutState = {
        name: 'about',
        url: '/about',
        template: '/templates/about.html'
    }

    $stateProvider.state(homeState);
    $stateProvider.state(aboutState);
}
})();