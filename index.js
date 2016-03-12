module.exports = function(kibana) {
	return new kibana.Plugin({
		uiExports: {
			visTypes: ['plugins/jVectorMapCountry/jvector_map_country_vis']
		}
	});
};