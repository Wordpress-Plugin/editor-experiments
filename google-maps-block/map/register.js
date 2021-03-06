/* global google */

( function( $, views ) {
	'use strict';

	views.register( 'map', {
		edit: function( text, node ) {
			var self = this;

			this.modal( node, function( modal ) {
				var mapElement, latLng, map, marker, autocomplete,
					attributes = self.shortcode.attrs.named,
					maps = google.maps,
					addListener = maps.event.addListener,
					inputAddress = modal.find( 'input[name="address"]' ),
					inputLat = modal.find( 'input[name="latitude"]' ),
					inputLng = modal.find( 'input[name="longitude"]' ),
					inputType = modal.find( 'input[name="type"]' ),
					inputZoom = modal.find( 'input[name="zoom"]' ),
					inputMarker = modal.find( 'input[name="marker"]' );

				mapElement = document.createElement( 'DIV' );
				mapElement.className = 'map';
				mapElement.style.width = '100%';
				mapElement.style.height = attributes.height;

				modal[0].appendChild( mapElement );

				latLng = new maps.LatLng( attributes.latitude, attributes.longitude );

				map = new maps.Map( mapElement, {
					zoom: parseInt( attributes.zoom, 10 ),
					center: latLng,
					mapTypeId: maps.MapTypeId[ attributes.type.toUpperCase() ]
				} );

				marker = new maps.Marker( {
					position: latLng,
					map: map,
					draggable: true,
					visible: !! attributes.marker
				} );

				autocomplete = new maps.places.Autocomplete( inputAddress[0] );
				autocomplete.bindTo( 'bounds', map );

				inputMarker.on( 'change', function() {
					marker.setVisible( inputMarker.is( ':checked' ) );
				} );

				addListener( autocomplete, 'place_changed', function() {
					var place = autocomplete.getPlace();

					if ( ! place.geometry ) {
						return;
					}

					map.panTo( place.geometry.location );
				} );

				addListener( map, 'center_changed', _.debounce( function() {
					var center = map.getCenter();
					marker.setPosition( center );
					inputLat.val( center.lat() );
					inputLng.val( center.lng() );
				}, 500 ) );

				addListener( map, 'zoom_changed', function() {
					inputZoom.val( map.getZoom() );
				} );

				addListener( map, 'maptypeid_changed', function() {
					inputType.val( map.getMapTypeId() );
				} );

				addListener( marker, 'dragend', function() {
					var center = marker.getPosition();
					map.panTo( center );
					inputLat.val( center.lat() );
					inputLng.val( center.lng() );
				} );

				maps.event.addDomListener( inputAddress[0], 'keydown', function( event ) {
					if ( event.keyCode === 13 ) {
						event.preventDefault();
					}
				} );
			} );
		}
	} );

} )( jQuery, wp.mce.views );
