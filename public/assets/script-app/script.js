(function(){

'use strict';

angular.module('application')
.controller('PerfilController', PerfilController);

PerfilController.$inject = ['$scope'];

function PerfilController($scope) {
    $scope.usuarioNombre = 'Sergio Amarilla';
    $scope.usuarioDescripcion = 'Es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texun impresor (N. del T. persona que se dedica a';
}

angular.module('application')
.controller('ConectadoController', ConectadoController);

ConectadoController.$inject = ['$scope'];

function ConectadoController($scope) {
    $scope.mensajes = [];

}


})();