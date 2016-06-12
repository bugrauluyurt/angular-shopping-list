app.controller("shoppingCtrl",['$scope','$timeout', function($scope, $timeout){
	$scope.products = ["Milk", "Bread", "Cheese"];

	$scope.addItem = function() {
		if ($scope.products.indexOf($scope.addMe) == -1) {
			$scope.products.push($scope.addMe);
		} else {
			$scope.errorText = "The item is already in your shopping list.";
			$timeout(function(){
				$scope.errorText = "";
			}, 3000);
		}

	};

	$scope.removeItem = function(index) {
		$scope.products.splice(index, 1);
	};
}]);