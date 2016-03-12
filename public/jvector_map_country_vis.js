// Include the angular controller
require('plugins/jVectorMapCountry/jvector_map_country_visController');
require('plugins/jVectorMapCountry/jquery-jvectormap-2.0.3.min');
require('plugins/jVectorMapCountry/jquery-jvectormap-world-mill');
require('plugins/jVectorMapCountry/jquery-jvectormap-europe-mill');


require('plugins/jVectorMapCountry/jquery-jvectormap-2.0.3.css');



// The provider function, which must return our new visualization type
function JVectorMapCountryProvider(Private) {
	var TemplateVisType = Private(require('ui/template_vis_type/TemplateVisType'));
	// Include the Schemas class, which will be used to define schemas
	var Schemas = Private(require('ui/Vis/Schemas'));

	// Describe our visualization
	return new TemplateVisType({
		name: 'jVectorMapCountry', // The internal id of the visualization (must be unique)
		title: 'Offline Country Map', // The title of the visualization, shown to the user
		description: 'Offline Country Map Visualizer using jVectormap.', // The description of this vis
		icon: 'fa-map', // The font awesome icon of this visualization		
		template: require('plugins/jVectorMapCountry/jvector_map_country_vis.html'), // The template, that will be rendered for this visualization
		params: {
			editor: require('plugins/jVectorMapCountry/jvector_map_country_vis_editor.html'), // Use this HTML as an options editor for this vis
			defaults: { // Set default values for paramters (that can be configured in the editor)
				mapBackgroundColor:"#C0C0FF",countryColorMin:"#00FF00",countryColorMax:"#FF0000"
				,selectedMap:'world',maps:['world','europe']
			}
		},
		// Define the aggregation your visualization accepts
		schemas: new Schemas([
				{
					group: 'metrics',
					name: 'locationsize',
					title: 'LocationSize',
					min: 1,
					max: 1,
					aggFilter: ['count', 'avg', 'sum', 'min', 'max', 'cardinality', 'std_dev']
				},
				{
					group: 'buckets',
					name: 'locations',
					title: 'Locations',
					min: 1,
					max: 1,
					aggFilter: '!geohash_grid'
				}
			])
	});
}

require('ui/registry/vis_types').register(JVectorMapCountryProvider);
