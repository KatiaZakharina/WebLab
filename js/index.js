let shopApp = angular.module('shopApp', []);

shopApp.controller('purchaseCtrl', function ($scope, $http) {
  const PORT = 3000;

  $http({
    method: 'GET',
    url: `http://localhost:${PORT}/bd`,
    headers: {
      'Content-type': 'application/json;charset=utf-8',
    },
  }).then(function success(response) {
    $scope.list = response.data;

    $scope.fieldList = [];
    for (let fieldName in $scope.list[0]) {
      $scope.fieldList.push(fieldName);
    }

    $scope.formList = $scope.fieldList.reduce((acc, curr) => {
      acc[curr] = null;
      return acc;
    }, {});

    function getSum() {
      $scope.sum = $scope.fieldList.map((field) => {
        let sumInColumn = 0;
        $scope.list.forEach((obj) => {
          sumInColumn += +obj[field];
        });
        return sumInColumn || '';
      });
      $scope.sum.shift();
    }
    function getAvg() {
      $scope.avg = $scope.sum.map((sum) => ~~(sum / $scope.list.length) || '');
    }

    getSum();
    getAvg();

    $scope.action = 'Add';

    $scope.addNewPurchase = function (e) {
      if ($scope.action == 'Edit') {
        editPurchaseInTable();
        $scope.action = 'Add';
        return;
      }
      if (document.querySelector(!$scope.postInputs.$valid)) return;
      for (let key in $scope.formList) {
        if (!$scope.formList[key]) {
          $scope.formList[key] = '';
        }
      }
      $scope.list.push($scope.formList);
      postPurchaseInDB($scope.formList);
      $scope.formList = {};
      getSum();
      getAvg();
      getManagerInfo();

      function postPurchaseInDB(data) {
        $http({
          method: 'POST',
          url: `http://localhost:${PORT}/bd`,
          headers: {
            'Content-type': 'application/json;charset=utf-8',
          },
          data: data,
        }).catch((err) => {
          showWarningMessage(err);
        });
      }
    };

    $scope.deletePurchase = function () {
      deletePurchaseFromDB($scope.list[this.$index].id);
      $scope.list.splice(this.$index, 1);
      getSum();
      getAvg();
      getManagerInfo();

      function deletePurchaseFromDB(id) {
        $http({
          method: 'DELETE',
          url: `http://localhost:${PORT}/bd/${id}`,
          headers: {
            'Content-type': 'application/json;charset=utf-8',
          },
        }).catch((err) => {
          showWarningMessage(err);
        });
      }
    };

    $scope.editPurchase = function () {
      $scope.currentId = this.$index;
      $scope.action = 'Edit';
      for (field of $scope.fieldList) {
        $scope.formList[field] = $scope.list[$scope.currentId][field];
      }
    };

    function editPurchaseInTable() {
      $http({
        method: 'PUT',
        url: `http://localhost:${PORT}/bd/${$scope.list[$scope.currentId].id}`,
        data: $scope.formList,
        headers: {
          'Content-type': 'application/json;charset=utf-8',
        },
      }).then(() => {
        $scope.list[$scope.currentId] = { ...$scope.formList };
        getSum();
        getAvg();
        getManagerInfo();
        $scope.formList = {};
      }, showWarningMessage);
    }

    function getManagerInfo(keyColumnNumb = 6, firstCrit = 2, secondCrit = 3) {
      $scope.keyProperty = $scope.fieldList[7];
      $scope.allKeyValue = $scope.list.map((obj) => {
        return obj[$scope.keyProperty];
      });
      $scope.allKeyValue = [...new Set($scope.allKeyValue)];
      $scope.allKeyValue = $scope.allKeyValue.map((manager) => {
        return {
          name: manager,
          firstCrit: getTotal(firstCrit, manager),
          secondCrit: getTotal(secondCrit, manager),
        };
      });
      function getTotal(columnNum, manager) {
        let total = 0;
        $scope.list.forEach((obj) => {
          if (obj[$scope.keyProperty] == manager) {
            total += +obj[$scope.fieldList[columnNum]];
          }
        });
        return total;
      }
    }
    getManagerInfo();
  }, showWarningMessage);

  function showWarningMessage(err) {
    console.log(
      'Пожалуйста, убедитесь, что json-server запустился на 3000 порту, иначе поменяйте переменную PORT'
    );
    throw err;
  }
});
