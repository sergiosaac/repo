(function(){

'use strict';

angular.module('application')
.controller('PerfilController', PerfilController);

PerfilController.$inject = ['$scope'];

function PerfilController($scope) {
    $scope.usuarioNombre = 'Lorem Ipsum';
    $scope.usuarioDescripcion = 'Lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500, cuando un impresor (N. del T. persona que se dedica a la imprent';
}

angular.module('application')
.controller('ConectadoController', ConectadoController);

ConectadoController.$inject = ['$scope'];

function ConectadoController($scope) {
    $scope.mensajes = [];

}


})();