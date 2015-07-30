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

    	function ($, properties, cssBootstrap, jsBootstrap, cssBootstrapSelect, jsBootstrapSelect, qlik) { 
    		// include dependency arguments, give them shortnames in the sequence listed under define[]  
    
        	'use strict';

        	// use the Mashup API for building a list instead of a hypercube which seems to be the default in the extension API
        	var $currApp = qlik.currApp( this );


        	// define various functions that we will use in the return function
        	var writeToConsole = function(){
				for(var i=0; i<arguments.length; i++) {
					console.log( 'Argument [' + i + '] --> ');
					console.log( arguments[i] );
				};
			}

			var addCSS = function(CSS){

					$( "<style>" ).html( CSS ).appendTo( "head" );
			}

			var addBootstrapDiv = function($element){
				var $scopedBootstrap = $( document.createElement( 'div' ) ); 
				$scopedBootstrap.attr( 'class' , 'bootstrap_inside' );
				$element.append( $scopedBootstrap );
			}

			var buildDropdown = function(field, top,left,heigth,width, command){
				// first get the data, then build the HTML syntax for it, but don't insert it into the DOM yet.
				// The reason is that the selectpicker library changes the select tag into a button dropdown statement and it
				// becomes difficult to find the right entrypoints for the select option. So we build the entire string 1st first
				// and then pass it to selectpicker as a whole
				$currApp.createList({
					"qDef": {
						"qFieldDefs": [
							field
						]
					},
					"qInitialDataFetch": [{
							qTop : top,
							qLeft : left,
							qHeight : heigth,
							qWidth : width
							}]
					},
					function(reply) {

						buildSelect(reply, command);						
					}
						); // end createList 
			}

			var buildSelect = function(reply, command){

				// build the HTML <SELECT> skeleton 
				var $selectTag = '<select id="mySelect" class="selectpicker" ';
				// see all selectpicker options at http://silviomoreto.github.io/bootstrap-select
				var $selectTagOptions = 'multiple data-size="10" data-live-search="true" data-style="btn-inverse" header="true">';
				// start with "something", allows to better debug what gets added to the options string
				var $optionList = "<option>Something</option>"; 

				switch(command){
					case 'create':
						$.each(reply.qListObject.qDataPages[0].qMatrix, function(key, value) {
							$optionList += '<option>' + value[0].qText + '</option>' ;
						});	 
					default:
						$.each(reply.qListObject.qDataPages[0].qMatrix, function(key, value) {
							$optionList += '<option>' + value[0].qText + '</option>' ;
						}); 
				}

				// add the entire <SELECT> plus <OPTION>'s' dropdown to the DOM inside the boostrapped div's
				$( '.bootstrap_inside' ).append( $selectTag + $selectTagOptions + $optionList + '</select>' );
				writeToConsole($selectTag, $selectTagOptions, $optionList);
			}

			var showDropdown = function(){
				$('.selectpicker').selectpicker();
				//$('.selectpicker').hide();
				// writeToConsole('selectpicker hidden');
				// $('.selectpicker').show();
				writeToConsole('selectpicker shown');			
			}
    
    		// start extension
        	return {

					definition: properties, //returns the contents of properties.js to paint the right side panel for the extension

		            // rendering logic
		            paint: function ( $element, layout ) {

				       	// writeToConsole($element, layout);

						// Solve the "multiply problem" - Lazy way
						$element.empty();
						
						// load bootstrap into HTML header and create a scoped bootstrap div to avoid messing up the sense client. 
						addCSS(cssBootstrap);
						addCSS(cssBootstrapSelect); //for selectpicker
						addBootstrapDiv($element);

						// build and show the dropdown the data
						buildDropdown('Alpha',0,0,100,1, 'create');
						showDropdown();

		           	} //end rendering logic

        	}; //end extension

		} // end dependency arguments 

); // end define


				