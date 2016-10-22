// Create an Angular module for this plugin
var module = require('ui/modules').get('jvector_map_country_vis');


module.controller('JVectorMapCountryController', function($scope, Private) {

	var filterManager = Private(require('ui/filter_manager'));




	$scope.filter = function(tag) {
		// Add a new filter via the filter manager
		filterManager.add(
			// The field to filter for, we can get it from the config
			$scope.vis.aggs.bySchemaName['locations'][0].params.field,
			// The value to filter for, we will read out the bucket key from the tag
			location.label,
			// Whether the filter is negated. If you want to create a negated filter pass '-' here
			null,
			// The index pattern for the filter
			$scope.vis.indexPattern.title
		);
	};

	$scope.$watch('esResponse', function(resp) {
		if (!resp) {
			$scope.locations = null;
			return;
		}

		if($scope.vis.aggs.bySchemaName['countries']== undefined)
		{
			$scope.locations = null;
			return;
		}

		// Retrieve the id of the configured tags aggregation
		var locationsAggId = $scope.vis.aggs.bySchemaName['countries'][0].id;
		// Retrieve the metrics aggregation configured
		var metricsAgg = $scope.vis.aggs.bySchemaName['countryvalue'][0];
		var buckets = resp.aggregations[locationsAggId].buckets;


		// Transform all buckets into tag objects
		$scope.locations = buckets.map(function(bucket) {
			// Use the getValue function of the aggregation to get the value of a bucket

				var value = metricsAgg.getValue(bucket);

				return {
					label: bucket.key,
					value: value
				};

		});

		if($scope.vis.params.normalizeInput)
		{
			//console.log("TOTO:"+JSON.stringify($scope.locations));
			var locshm={};
			var locs=$scope.locations;
			for (var i=0;i<locs.length;i++)
			{
				locs[i].label=locs[i].label.toUpperCase();
				if(locshm[locs[i].label]!=null)
				  locshm[locs[i].label].value+=locs[i].value;
			  else
			  		locshm[locs[i].label]=locs[i];
			}

			var locs2=[];

			for (var type in locshm)
			    locs2.push(locshm[type]);

			$scope.locations=locs2;
		}

/*		$scope.locations = $scope.locations.map(function(location) {

			return location;
		});*/

		// Draw Map

		var data={};

		angular.forEach($scope.locations, function(value, key){
			if(value.label!=undefined)
				data[value.label.toUpperCase()]=value.value;

		});


		//console.log(data);

		try { $('#map').vectorMap('get', 'mapObject').remove(); }
		catch(err) {}



        $('#map').vectorMap(
  			  {
  				  map: $scope.vis.params.selectedMap+'_mill',
			      series: {
			        regions: [{
			          values: data,
			          scale: [$scope.vis.params.countryColorMin, $scope.vis.params.countryColorMax],
			          normalizeFunction: 'polynomial'
			        }]
			      },
			      onRegionTipShow: function(e, el, code){
			        el.html(el.html()+' ('+data[code]+')');
			      }
				  ,
  				  backgroundColor: $scope.vis.params.mapBackgroundColor
  			}
  	  	);
		// End of draw map

	});
});
