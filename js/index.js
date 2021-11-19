let db = [
  {
    id: '365b2f56-d827-5974-b250-ee99dc480ed7',
    productName: 'Awesome Cotton Chips',
    quantity: 93,
    price: 96,
    producer: 'Wunsch, Pagac and Durgan',
    cайт: 'http://dion.com',
    кассир: 'Gust',
    менеджер: 'Jenifer',
  },
  {
    id: '6933b066-69b8-5419-b545-cebb7926e072',
    productName: 'Gorgeous Rubber Gloves',
    quantity: 50,
    price: 922,
    producer: 'Morar - Lubowitz',
    cайт: 'https://jefferey.net',
    кассир: 'Payton',
    менеджер: 'Sylvester',
  },
  {
    id: '0904a938-788f-555c-80f0-f02edd5dfbaf',
    productName: 'Fantastic Wooden Soap',
    quantity: 28,
    price: 240,
    producer: 'Stiedemann - Zieme',
    cайт: 'http://enos.net',
    кассир: 'Federico',
    менеджер: 'Ericka',
  },
];
let shopApp = angular.module('shopApp', []); //создание модула

shopApp.controller('purchaseCtrl', function ($scope, $http) {

  $http({ method: 'GET', url: 'http://localhost:3000/bd' }).then(
    function success(response) {
      console.log(response);
      $scope.list = response.data;

      $scope.fieldList = [];
      for (let fieldName in $scope.list[0]) {
        $scope.fieldList.push(fieldName);
      }

      $scope.sum = $scope.fieldList.map((field) => {
        let sumInColumn = 0;
        $scope.list.forEach((obj) => {
          sumInColumn += +obj[field];
        });
        return sumInColumn || '';
      });
      $scope.sum.shift();

      $scope.avg = $scope.sum.map((sum) => ~~(sum / $scope.list.length) || '');

      $scope.addNewPurchase = function () {
        let newObj = {};
        $scope.fieldList.forEach((field) => {
          newObj[field] = $scope[field];
        });
        $scope.list.push(newObj);
      };
    }
  );
});
