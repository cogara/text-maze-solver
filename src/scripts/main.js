(function() {
    
uiRouter.$inject = ['$stateProvider','$urlRouterProvider', '$locationProvider'];
angular.module('PeopleNetCodeChallenge', ['ui.router']);

angular.module('PeopleNetCodeChallenge').config(uiRouter);

function uiRouter($stateProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider.otherwise('/');
    var homeState = {
        name: 'index',
        url: '/',
        templateUrl: '/templates/maze.html'
    }

    var aboutState = {
        name: 'about',
        url: '/about',
        templateUrl: '/templates/about.html'
    }

    $stateProvider.state(homeState);
    $stateProvider.state(aboutState);

    $locationProvider.html5Mode(true);
}
})();