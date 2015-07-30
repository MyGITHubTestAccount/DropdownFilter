define( [ 	// Note: If you load .js files, omit the file extension, otherwise
        	// requireJS will not load it correctly !
			'jquery' ,
			'./properties',
			'text!./scoped-bootstrap.css',
			'./bootstrap.min',
			'text!./bootstrap-select.min.css',
			'./bootstrap-select.min',
			'qlik'
		

		],

    	function ($, properties, cssBootstrap, jsBootstrap, cssBootstrapSelect, jsBootstrapSelect, qlik) { // include dependency arguments, give them shortnames in the sequence listed under define[]  
    
        	'use strict';

        	// use the Mashup API for building a list instead of a hypercube which seems to be the default in the extension API
        	var $currApp = qlik.currApp( this );
    
        	return {

					definition: properties, //returns the contents of properties.js

		            // paint and rendering logic
		            paint: function ( $element, layout ) {

				       
						// ****************************************************************************************
						// write the main objects to the console so that we can examine them
						// ****************************************************************************************

						console.log( '$element -->' );
						console.log( $element );
						console.log( '$layout -->' );
						console.log( layout );

						// ****************************************************************************************
						// Solve the "multiply problem" - Lazy way
						// ****************************************************************************************

						$element.empty();

						// ****************************************************************************************
						// and now for the rest
						// ****************************************************************************************
						
						// first load bootstrap into the HTML header
						$( "<style>" ).html( cssBootstrap ).appendTo( "head" );
						$( "<style>" ).html( cssBootstrapSelect ).appendTo( "head" );

						// then create a scoped bootstrap div so that bootrap does not mess up the sense client.
						var $scopedBootstrap = $( document.createElement( 'div' ) ); 
						$scopedBootstrap.attr( 'class' , 'bootstrap_inside' );
						$element.append( $scopedBootstrap );

						// next get the data, then build the HTML syntax for it, but don't insert it into the DOM yet.
						// The reason is that the selectpicker library changes the select tag into a button dropdown statement and it
						// becomes difficult to find the right entrypoints for the select option. So we build the entire string 1st
						// and then pass it to selectpicker as a whole

						// get the data
						$currApp.createList({
							"qDef": {
								"qFieldDefs": [
									"Alpha"
								]
							},
							"qInitialDataFetch": [{
									qTop : 0,
									qLeft : 0,
									qHeight : 100,
									qWidth : 1
									}]
							},
							function(reply) {

								// build the HTML Syntax, see all selectpicker options at http://silviomoreto.github.io/bootstrap-select
								var $selectTag = '<select id="mySelect" class="selectpicker" multiple data-size="10" data-live-search="true" data-style="btn-inverse">'
								var $optionList = "<option>Something</option>"; // start with "something", allows to better debug what gets added to the options string

								$.each(reply.qListObject.qDataPages[0].qMatrix, function(key, value) {
									$optionList += '<option>' + value[0].qText + '</option>' ;
								});
								console.log( 'optionList' );
								console.log( $optionList );

								// add the entire <SELECT> plus <OPTION>'s' dropdown to the DOM inside the boostrapped div's
								$( '.bootstrap_inside' ).append( $selectTag + $optionList + '</select>' );
								
								// let selectpicker beautify (=modify) the complete <SELECT> list
								$('.selectpicker').selectpicker();

							}
						); // end get data 
								           	
		           	} //end paint and rendering logic

        	}; //end return

		} // end function ( /* dependency arguments */ )

); // end define


				