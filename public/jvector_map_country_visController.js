// Create an Angular module for this plugin
var module = require('ui/modules').get('jvector_map_country_vis');


module.controller('JVectorMapCountryController', function($scope, Private) {

	var filterManager = Private(require('ui/filter_manager'));

	
	$scope.hexToRGB = function(hex){
		 	hex=hex.replace(/#/g,'');
		    var r = parseInt('0x'+hex[0]+hex[1]);
		    var g = parseInt('0x'+hex[2]+hex[3]);
		    var b = parseInt('0x'+hex[4]+hex[5]);
	    	return [r,g,b];
	}
	
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

		if($scope.vis.aggs.bySchemaName['locations']== undefined)
		{
			$scope.locations = null;
			return;
		}

		// Retrieve the id of the configured tags aggregation
		var locationsAggId = $scope.vis.aggs.bySchemaName['locations'][0].id;
		// Retrieve the metrics aggregation configured
		var metricsAgg = $scope.vis.aggs.bySchemaName['locationsize'][0];
		var buckets = resp.aggregations[locationsAggId].buckets;



		var min = Number.MAX_VALUE;
		var max = - Number.MAX_VALUE;



		// Transform all buckets into tag objects
		$scope.locations = buckets.map(function(bucket) {
			// Use the getValue function of the aggregation to get the value of a bucket
			var value = metricsAgg.getValue(bucket);
			// Finding the minimum and maximum value of all buckets
			min = Math.min(min, value);
			max = Math.max(max, value);
			
			return {
				label: bucket.key,
				//geo:$scope.decodeGeoHash(bucket.key),
				value: value
			};
		});

		var countrycolormin=$scope.hexToRGB($scope.vis.params.countryColorMin)		
		var countrycolormax=$scope.hexToRGB($scope.vis.params.countryColorMax)		
		var countrycolor=countrycolormin;


		// Calculate the font size for each tag
		$scope.locations = $scope.locations.map(function(location) {
//			console.log("location---");
			console.log(location);
			
			if(max!=min)
			{
				var tmpval=(location.value - min) / (max - min);
				
				circlecolor=[];
				for(var x=0;x<circlecolormin.length;x++)
				{
					circlecolor.push(Math.floor(tmpval*(circlecolormax[x]-circlecolormin[x])+circlecolormin[x]));				
				}
				location.color=circlecolor;
				console.log(circlecolor);
			}
			

			return location;
		});
				
		// Draw Map
			
		var dynmarkers=[];
	
		angular.forEach($scope.locations, function(value, key){
			 /*dynmarkers.push({latLng: [value.geo.latitude[2], value.geo.longitude[2]]
				 , name: 'lat:'+value.geo.latitude[2]+' lon:'+value.geo.longitude[2]+' ('+value.value+')'
				 ,style: {fill: 'rgba('+value.color[0]+','+value.color[1]+','+value.color[2]+','+($scope.vis.params.circleOpacity/100)+')', r:value.radius}})
				 */
		});

		
		try { $('#map').vectorMap('get', 'mapObject').remove(); }
		catch(err) {}
		
		var data = {
		  "AF": 16.63,
		  "AL": 11.58,
		  "DZ": 158.97,
		  "AO": 85.81,
		  "AG": 1.1,
		  "AR": 351.02,
		  "AM": 8.83,
		  "AU": 1219.72,
		  "AT": 366.26,
			"AZ": 52.17};
		
        $('#map').vectorMap(
  			  {
  				  map: $scope.vis.params.selectedMap+'_mill',			  
			      series: {
			        regions: [{
			          values: data,
			          scale: ['#C8EEFF', '#0071A4'],
			          normalizeFunction: 'polynomial'
			        }]
			      },
			      onRegionTipShow: function(e, el, code){
			        el.html(el.html()+' (GDP)');
			      }
				  ,
  				  backgroundColor: $scope.vis.params.mapBackgroundColor/*,
  				  markers: dynmarkers*/
  			}
  	  	);     		
		// End of draw map
		
	});
});
