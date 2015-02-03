


//Here is where the main part of the project was done

if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var sceneContainer, stats;
var bgScene = new THREE.Scene();
var bgCam = new THREE.Camera();
var camera, controls, scene, renderer, projector;
var mercury, venus, earth, mars, jupiter, saturn, uranus, neptune;
var planets = [];

//labels, orbit speeds and angle global
var mercurySpriteText;
var venusSpriteText;
var earthSpriteText;
var marsSpriteText;
var jupiterSpriteText;
var saturnSpriteText;
var uranusSpriteText;
var neptuneSpriteText;

var earthSpeed = .667; //orbit of earth speed in pixels
var mercurySpeed = (100/24) * earthSpeed; // ratio to earth Years (.24 years)
var venusSpeed = (100/62)* earthSpeed; // ratio to earth Years (.62 years)
var marsSpeed = earthSpeed/1.88; // ratio to earth Years (1.88 years)
var jupiterSpeed = earthSpeed/11.86; // ratio to earth Years (11.86 years)
var saturnSpeed = earthSpeed/29.46; // ratio to earth Years (29.46 years)
var uranusSpeed = earthSpeed/84.01; // ratio to earth Years (84.01 years)
var neptuneSpeed = earthSpeed/164.8; // ratio to earth Years (164.8 years)

//Starting Positions
var mercuryAngle = 90;
var venusAngle = 140;
var earthAngle = 0;
var marsAngle = 260;
var jupiterAngle = 30;
var saturnAngle = 310;
var uranusAngle = 0;
var neptuneAngle = 180;

var currentPlanet; // used to store which planet information to be shown



init();
animate();

function init() {

	projector = new THREE.Projector();
	// PerspectiveCamera( fov, aspect, near, far )
	// Foz = 60, aspect = screen aspect. near = 1 , far - 8k (largest radius is Neptune at 3k and diameter will be 6k)
	camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000000 );
	camera.position = new THREE.Vector3( 0, 0, 3001);

	//Declare camera Controls (three OrbitControls)
	controls = new THREE.OrbitControls( camera );
	controls.addEventListener( 'change', render );

	scene = new THREE.Scene();



	//Background
	var bg = new THREE.Mesh(
	  new THREE.PlaneGeometry(2, 2, 0),
	  new THREE.MeshBasicMaterial({map: THREE.ImageUtils.loadTexture('images/stars.png')})
	);
	bg.material.depthTest = false;
	bg.material.depthWrite = false;
	bgScene.add(bgCam);
	bgScene.add(bg);


	/*
	__________.__                        __          
	\______   \  | _____    ____   _____/  |_  ______
	 |     ___/  | \__  \  /    \_/ __ \   __\/  ___/
	 |    |   |  |__/ __ \|   |  \  ___/|  |  \___ \ 
	 |____|   |____(____  /___|  /\___  >__| /____  >
	                    \/     \/     \/          \/ 
	*/
	// sphereGeometry arguments = (radius,segmentsWidth,segmentsHeight)
	//segments width and heighth refer to how perfect the circle is (higher value = more rendering power required)

	//This is not a metrically accurate system, not is the sun in any way as to do so the solar system would be mostly empty space (as in the real world)
	//The ratios of the radiuses of the planets are related -- as are the orbits ratios -- (however the two are not linked)
	//This is for visuals only
	var sunGeo = new THREE.SphereGeometry( 20, 24,24 );
	//Radius in relation to earth's radius = 10
	var mercuryGeo = new THREE.SphereGeometry( 3.8, 24, 24 );
	var venusGeo = new THREE.SphereGeometry( 9.5, 24, 24 );
	var earthGeo = new THREE.SphereGeometry( 10, 24, 24 );
	var marsGeo = new THREE.SphereGeometry( 5.3, 24, 24 );
	var jupiterGeo = new THREE.SphereGeometry( 110, 24, 24 );
	var saturnGeo = new THREE.SphereGeometry( 94, 24, 24 );
	var uranusGeo = new THREE.SphereGeometry( 44, 24, 24 );
	var neptuneGeo = new THREE.SphereGeometry( 39, 24, 24 );

	//NB, if these textures dont load, reaload the page with the materials below 
	// no idea why they wont load, spent too long trying to figure it out - stars.png loads perfectly using the same process
	

	var sunMaterial = new THREE.MeshLambertMaterial({map: THREE.ImageUtils.loadTexture('images/sunmap.jpg')});
	var mercuryMaterial = new THREE.MeshLambertMaterial({map: THREE.ImageUtils.loadTexture('images/mercurymap.jpg')});
	var venusMaterial = new THREE.MeshLambertMaterial({map: THREE.ImageUtils.loadTexture('images/venusmap.jpg')});
	var earthMaterial = new THREE.MeshLambertMaterial({map: THREE.ImageUtils.loadTexture('images/earthmap.jpg')});
	var marsMaterial = new THREE.MeshLambertMaterial({map: THREE.ImageUtils.loadTexture('images/marsmap.jpg')});
	var jupiterMaterial = new THREE.MeshLambertMaterial({map: THREE.ImageUtils.loadTexture('images/jupitermap.jpg')});
	var saturnMaterial = new THREE.MeshLambertMaterial({map: THREE.ImageUtils.loadTexture('images/saturnmap.jpg')});
	var uranusMaterial = new THREE.MeshLambertMaterial({map: THREE.ImageUtils.loadTexture('images/uranusmap.jpg')});
	var neptuneMaterial = new THREE.MeshLambertMaterial({map: THREE.ImageUtils.loadTexture('images/neptunemap.jpg')});

	/*
	var sunMaterial = new THREE.MeshLambertMaterial( { color: 0xFFFFB5, shading: THREE.SmoothShading } ) ;
	var mercuryMaterial= new THREE.MeshLambertMaterial( { color: 0xEDCC72, shading: THREE.SmoothShading } ) ;
	var venusMaterial = new THREE.MeshLambertMaterial( { color: 0xDB9F4B, shading: THREE.SmoothShading } ) ;
	var earthMaterial = new THREE.MeshLambertMaterial( { color: 0x7498FC, shading: THREE.SmoothShading } ) ;
	var marsMaterial = new THREE.MeshLambertMaterial( { color: 0xA33A1D, shading: THREE.SmoothShading } ) ;
	var jupiterMaterial = new THREE.MeshLambertMaterial( { color: 0xF2C57C, shading: THREE.SmoothShading } ) ;
	var saturnMaterial= new THREE.MeshLambertMaterial( { color: 0xEDD5AD, shading: THREE.SmoothShading } ) ;
	var uranusMaterial = new THREE.MeshLambertMaterial( { color: 0xD7EDFC, shading: THREE.SmoothShading } ) ;
	var neptuneMaterial = new THREE.MeshLambertMaterial( { color: 0x2D88C4, shading: THREE.SmoothShading } ) ;
	*/
	

	theSun = new THREE.Mesh(sunGeo, sunMaterial);
	theSun.position = new THREE.Vector3( 0, 0, 0 );
	planets.push(theSun);

	mercury = new THREE.Mesh(mercuryGeo, mercuryMaterial);
	mercury.position = new THREE.Vector3( 39, 0, 0 );
	planets.push(mercury);

	venus = new THREE.Mesh(venusGeo, venusMaterial);
	venus.position = new THREE.Vector3( 72, 0, 0 );
	planets.push(venus);

	earth = new THREE.Mesh(earthGeo, earthMaterial);
	earth.position = new THREE.Vector3( 100, 0, 0 );
	planets.push(earth);

	mars = new THREE.Mesh(marsGeo, marsMaterial);
	mars.position = new THREE.Vector3( 150, 0, 0 );
	planets.push(mars);

	jupiter = new THREE.Mesh(jupiterGeo, jupiterMaterial);
	jupiter.position = new THREE.Vector3( 520, 0, 0 );
	planets.push(jupiter);

	saturn = new THREE.Mesh(saturnGeo, saturnMaterial);
	saturn.position = new THREE.Vector3( 950, 0, 0 );
	planets.push(saturn);

	uranus = new THREE.Mesh(uranusGeo, uranusMaterial);
	uranus.position = new THREE.Vector3( 1900, 0, 0 );
	planets.push(uranus);

	neptune = new THREE.Mesh(neptuneGeo, neptuneMaterial);
	neptune.position = new THREE.Vector3( 3000, 0, 0 );
	planets.push(neptune);


	//Names to be stored for later use (future plan)
	theSun.nameOfPlanet = 'sun';
	mercury.nameOfPlanet = 'mercury';
	venus.nameOfPlanet = 'venus';
	earth.nameOfPlanet = 'earth';
	mars.nameOfPlanet = 'mars';
	jupiter.nameOfPlanet = 'jupiter';
	saturn.nameOfPlanet = 'saturn';
	uranus.nameOfPlanet = 'uranus';
	neptune.nameOfPlanet = 'neptune';


	//Add planets to the scene
	scene.add( theSun );
	scene.add( mercury );
	scene.add( venus );
	scene.add( earth );
	scene.add( mars );
	scene.add( jupiter );
	scene.add( saturn );
	scene.add( uranus );
	scene.add( neptune );
	

  /*.____          ___.          .__          
	|    |   _____ \_ |__   ____ |  |   ______
	|    |   \__  \ | __ \_/ __ \|  |  /  ___/
	|    |___ / __ \| \_\ \  ___/|  |__\___ \ 
	|_______ (____  /___  /\___  >____/____  >
	        \/    \/    \/     \/          \/ */


	//Sprite functionality taken from stemkoski's threejs example library (modified for my programme)
	// - https://github.com/stemkoski/stemkoski.github.com/blob/master/Three.js/Sprite-Text-Labels.html
	function makeTextSprite( message, parameters )
	{
		if ( parameters === undefined ) parameters = {};

		var fontface = parameters.hasOwnProperty("fontface") ? 
			parameters["fontface"] : "Arial";

		var fontsize = parameters.hasOwnProperty("fontsize") ? 
			parameters["fontsize"] : 1;

		var borderThickness = parameters.hasOwnProperty("borderThickness") ? 
			parameters["borderThickness"] : 1;

		var borderColor = parameters.hasOwnProperty("borderColor") ?
			parameters["borderColor"] : { r:255, g:255, b:255, a:1.0 };

		var backgroundColor = parameters.hasOwnProperty("backgroundColor") ?
			parameters["backgroundColor"] : { r:255, g:255, b:255, a:1.0 };

		var canvas = document.createElement('canvas');
		var context = canvas.getContext('2d');
		context.font = "Bold " + fontsize + "px " + fontface;
	    
		// get size data (height depends only on font size)
		var metrics = context.measureText( message );
		var textWidth = metrics.width;

		// background color
		context.fillStyle   = "rgba(" + backgroundColor.r + "," + backgroundColor.g + ","
									  + backgroundColor.b + "," + backgroundColor.a + ")";
		// border color
		context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + ","
									  + borderColor.b + "," + borderColor.a + ")";

		context.lineWidth = borderThickness;
		// 1.4 is extra height factor for text below baseline: g,j,p,q.

		// text color
		context.fillStyle = "rgba(255, 255, 255, 1.0)";

		context.fillText( message, borderThickness, fontsize + borderThickness);

		// canvas contents will be used for a texture
		var texture = new THREE.Texture(canvas) 
		texture.needsUpdate = true;

		var spriteMaterial = new THREE.SpriteMaterial( 
			{ map: texture, useScreenCoordinates: false} );
		var sprite = new THREE.Sprite( spriteMaterial );
		sprite.scale.set(100,50,1.0);
		return sprite;	
	}

	sunSpriteText = makeTextSprite( "Sun", 
		{ fontsize: 24, fontface: "Georgia", borderColor: {r:0, g:0, b:255, a:1.0} } );
	sunSpriteText.position.set(0,0,0);
	scene.add( sunSpriteText );

	mercurySpriteText = makeTextSprite( "Mercury", 
		{ fontsize: 12, fontface: "Georgia", borderColor: {r:0, g:0, b:255, a:1.0} } );
	mercurySpriteText.position.set(39,0,0);
	scene.add( mercurySpriteText );

	venusSpriteText = makeTextSprite( "Venus", 
		{ fontsize: 24, fontface: "Georgia", borderColor: {r:0, g:0, b:255, a:1.0} } );
	venusSpriteText.position.set(72,0,0);
	scene.add( venusSpriteText );

	earthSpriteText = makeTextSprite( "Earth", 
		{ fontsize: 24, fontface: "Georgia", borderColor: {r:0, g:0, b:255, a:1.0} } );
	earthSpriteText.position.set(100,0,0);
	scene.add( earthSpriteText );

	marsSpriteText = makeTextSprite( "Mars", 
		{ fontsize: 24, fontface: "Georgia", borderColor: {r:0, g:0, b:255, a:1.0} } );
	marsSpriteText.position.set(0,0,0);
	scene.add( marsSpriteText );

	jupiterSpriteText = makeTextSprite( "Jupiter", 
		{ fontsize: 32, fontface: "Georgia", borderColor: {r:0, g:0, b:255, a:1.0} } );
	jupiterSpriteText.position.set(520,0,0);
	scene.add( jupiterSpriteText );

	saturnSpriteText = makeTextSprite( "Saturn", 
		{ fontsize: 24, fontface: "Georgia", borderColor: {r:0, g:0, b:255, a:1.0} } );
	saturnSpriteText.position.set(950,0,0);
	scene.add( saturnSpriteText );

	uranusSpriteText = makeTextSprite( "Uranus", 
		{ fontsize: 24, fontface: "Georgia", borderColor: {r:0, g:0, b:255, a:1.0} } );
	uranusSpriteText.position.set(1900,0,0);
	scene.add( uranusSpriteText );

	neptuneSpriteText = makeTextSprite( "Neptune", 
		{ fontsize: 24, fontface: "Georgia", borderColor: {r:0, g:0, b:255, a:1.0} } );
	neptuneSpriteText.position.set(3000,0,0);
	scene.add( neptuneSpriteText );




	/*
	________       ___.   .__  __    .____    .__                      
	\_____  \______\_ |__ |__|/  |_  |    |   |__| ____   ____   ______
	 /   |   \_  __ \ __ \|  \   __\ |    |   |  |/    \_/ __ \ /  ___/
	/    |    \  | \/ \_\ \  ||  |   |    |___|  |   |  \  ___/ \___ \ 
	\_______  /__|  |___  /__||__|   |_______ \__|___|  /\___  >____  >
	        \/          \/                   \/       \/     \/     \/ 
		*/


	//Backburner - circles aren't circles...
	/* why are the circles coming out slightly rectagular....
	//Orbit lines to show orbit
	var createOrbitLine = function(radius){
		var circleRadius = radius;
		var circleShape = new THREE.Shape();
		circleShape.moveTo( 0, circleRadius );
		circleShape.quadraticCurveTo( circleRadius, circleRadius, circleRadius, 0 );
		circleShape.quadraticCurveTo( circleRadius, -circleRadius, circleRadius, -circleRadius );
		circleShape.quadraticCurveTo( -circleRadius, -circleRadius, -circleRadius, -circleRadius );
		circleShape.quadraticCurveTo( -circleRadius, circleRadius, -circleRadius, circleRadius );
		
		var points = circleShape.createPointsGeometry();
		var line = new THREE.Line( points, new THREE.LineBasicMaterial( { color: 0xFFFFFF, linewidth: 0.01, opacity : 0.1} ) );
		line.position.set(0,0,0);
		scene.add(line);
	};

	createOrbitLine(39);
	createOrbitLine(72);
	createOrbitLine(100);
	createOrbitLine(150);
	createOrbitLine(520);
	createOrbitLine(950);
	createOrbitLine(1900);
	createOrbitLine(3000);
	*/




/*	.____    .__       .__     __          
	|    |   |__| ____ |  |___/  |_  ______
	|    |   |  |/ ___\|  |  \   __\/  ___/
	|    |___|  / /_/  >   Y  \  |  \___ \ 
	|_______ \__\___  /|___|  /__| /____  >
	        \/ /_____/      \/          \/ */

	//Don't think this is necessary for the project in it's current form
	scene.add( new THREE.AmbientLight( 0xffffff ) ); 

	// renderer for the scene (using WebGL)
	// can be set to true depending on machine
	renderer = new THREE.WebGLRenderer( { antialias: false } );
	// size of scene is entrie screen size
	renderer.setSize( window.innerWidth, window.innerHeight );
	sceneContainer = document.getElementById( 'sceneContainer' );
	sceneContainer.appendChild( renderer.domElement );
	window.addEventListener( 'resize', onWindowResize, false );
	sceneContainer.addEventListener( 'mousedown', onMouseDown, false );

}


//animate the scene
function animate() {
	requestAnimationFrame( animate );
	render();
}


//render the scene
function render() {


	/* for background */
	renderer.autoClear = false;
	renderer.clear();


/*  ________       ___.   .__  __       _____         .__                __  .__               
	\_____  \______\_ |__ |__|/  |_    /  _  \   ____ |__| _____ _____ _/  |_|__| ____   ____  
	 /   |   \_  __ \ __ \|  \   __\  /  /_\  \ /    \|  |/     \\__  \\   __\  |/  _ \ /    \ 
	/    |    \  | \/ \_\ \  ||  |   /    |    \   |  \  |  Y Y  \/ __ \|  | |  (  <_> )   |  \
	\_______  /__|  |___  /__||__|   \____|__  /___|  /__|__|_|  (____  /__| |__|\____/|___|  /
	        \/          \/                   \/     \/         \/     \/                    \/  */

	
	//Relative orbit speeds referenced from "http://www.windows2universe.org/our_solar_system/planets_table.html"
	
	/*                                                 
	  _____   ___________  ____  __ _________ ___.__.
	 /     \_/ __ \_  __ \/ ___\|  |  \_  __ <   |  |
	|  Y Y  \  ___/|  | \|  \___|  |  /|  | \/\___  |
	|__|_|  /\___  >__|   \___  >____/ |__|   / ____|
	      \/     \/           \/              \/     */

	var origin = new THREE.Vector3(0,0,0); //Orbited position
	var radius = 39; // Orbiting Distance From Origin
	var rad = mercuryAngle * (Math.PI / 180); // Converting Degrees To Radians
	mercury.position.x = origin.x + radius * Math.cos(rad); // Position The Orbiter Along x-axis
	mercury.position.y = origin.y + radius * Math.sin(rad); // Position The Orbiter Along y-axis
	mercurySpriteText.position.set( mercury.position.x + 10, mercury.position.y, 0 );
	mercuryAngle += mercurySpeed; // Object will orbit clockwise

	/*                                  
	___  __ ____   ____  __ __  ______
	\  \/ // __ \ /    \|  |  \/  ___/
	 \   /\  ___/|   |  \  |  /\___ \ 
	  \_/  \___  >___|  /____//____  >
	           \/     \/           \/ */

	var origin = new THREE.Vector3(0,0,0); //Orbited position
	var radius = 72; // Orbiting Distance From Origin
	var rad = venusAngle * (Math.PI / 180); // Converting Degrees To Radians
	venus.position.x = origin.x + radius * Math.cos(rad); // Position The Orbiter Along x-axis
	venus.position.y = origin.y + radius * Math.sin(rad); // Position The Orbiter Along y-axis
	venusSpriteText.position.set( venus.position.x + 5, venus.position.y, 0 );
	venusAngle += venusSpeed; // Object will orbit clockwise


	/*                    __  .__     
	  ____ _____ ________/  |_|  |__  
	_/ __ \\__  \\_  __ \   __\  |  \ 
	\  ___/ / __ \|  | \/|  | |   Y  \
	 \___  >____  /__|   |__| |___|  /
	     \/     \/                 \/ */

	var origin = new THREE.Vector3(0,0,0); //Orbited position
	var radius = 100; // Orbiting Distance From Origin
	var rad = earthAngle * (Math.PI / 180); // Converting Degrees To Radians
	earth.position.x = origin.x + radius * Math.cos(rad); // Position The Orbiter Along x-axis
	earth.position.y = origin.y + radius * Math.sin(rad); // Position The Orbiter Along y-axis
	earthSpriteText.position.set( earth.position.x + 5, earth.position.y, 0 );
	earthAngle += earthSpeed; // Object will orbit clockwise

	/*                             
	  _____ _____ _______  ______
	 /     \\__  \\_  __ \/  ___/
	|  Y Y  \/ __ \|  | \/\___ \ 
	|__|_|  (____  /__|  /____  >
	      \/     \/           \/  */

	var origin = new THREE.Vector3(0,0,0); //Orbited position
	var radius = 150; // Orbiting Distance From Origin
	var rad = marsAngle * (Math.PI / 180); // Converting Degrees To Radians
	mars.position.x = origin.x + radius * Math.cos(rad); // Position The Orbiter Along x-axis
	mars.position.y = origin.y + radius * Math.sin(rad); // Position The Orbiter Along y-axis
	marsSpriteText.position.set( mars.position.x + 10, mars.position.y, 0 );
	marsAngle += marsSpeed; // Object will orbit clockwise

	/*   __             .__  __                
	    |__|__ ________ |__|/  |_  ___________ 
	    |  |  |  \____ \|  \   __\/ __ \_  __ \
	    |  |  |  /  |_> >  ||  | \  ___/|  | \/
	/\__|  |____/|   __/|__||__|  \___  >__|   
	\______|     |__|                 \/        */

	var origin = new THREE.Vector3(0,0,0); //Orbited position
	var radius = 520; // Orbiting Distance From Origin
	var rad = jupiterAngle * (Math.PI / 180); // Converting Degrees To Radians
	jupiter.position.x = origin.x + radius * Math.cos(rad); // Position The Orbiter Along x-axis
	jupiter.position.y = origin.y + radius * Math.sin(rad); // Position The Orbiter Along y-axis
	jupiterSpriteText.position.set( jupiter.position.x - 105, jupiter.position.y, 0 );
	jupiterAngle += jupiterSpeed; // Object will orbit clockwise

	/*_________       __                       
	 /   _____/____ _/  |_ __ _________  ____  
	 \_____  \\__  \\   __\  |  \_  __ \/    \ 
	 /        \/ __ \|  | |  |  /|  | \/   |  \
	/_______  (____  /__| |____/ |__|  |___|  /
	        \/     \/                       \/ */

	var origin = new THREE.Vector3(0,0,0); //Orbited position
	var radius = 950; // Orbiting Distance From Origin
	var rad = saturnAngle * (Math.PI / 180); // Converting Degrees To Radians
	saturn.position.x = origin.x + radius * Math.cos(rad); // Position The Orbiter Along x-axis
	saturn.position.y = origin.y + radius * Math.sin(rad); // Position The Orbiter Along y-axis
	saturnSpriteText.position.set( saturn.position.x - 90, saturn.position.y, 0 );
	saturnAngle += saturnSpeed; // Object will orbit clockwise

   /*____ ___                                   
	|    |   \___________    ____  __ __  ______
	|    |   |_  __ \__  \  /    \|  |  \/  ___/
	|    |  / |  | \// __ \|   |  \  |  /\___ \ 
	|______/  |__|  (____  /___|  /____//____  >
	                     \/     \/           \/ */

	var origin = new THREE.Vector3(0,0,0); //Orbited position
	var radius = 1900; // Orbiting Distance From Origin
	var rad = uranusAngle * (Math.PI / 180); // Converting Degrees To Radians
	uranus.position.x = origin.x + radius * Math.cos(rad); // Position The Orbiter Along x-axis
	uranus.position.y = origin.y + radius * Math.sin(rad); // Position The Orbiter Along y-axis
	uranusSpriteText.position.set( uranus.position.x - 30, uranus.position.y, 0 );
	uranusAngle += uranusSpeed; // Object will orbit clockwise

  /* _______                 __                       
	 \      \   ____ _______/  |_ __ __  ____   ____  
	 /   |   \_/ __ \\____ \   __\  |  \/    \_/ __ \ 
	/    |    \  ___/|  |_> >  | |  |  /   |  \  ___/ 
	\____|__  /\___  >   __/|__| |____/|___|  /\___  >
	        \/     \/|__|                   \/     \/  */

	var origin = new THREE.Vector3(0,0,0); //Orbited position
	var radius = 3000; // Orbiting Distance From Origin
	var rad = neptuneAngle * (Math.PI / 180); // Converting Degrees To Radians
	neptune.position.x = origin.x + radius * Math.cos(rad); // Position The Orbiter Along x-axis
	neptune.position.y = origin.y + radius * Math.sin(rad); // Position The Orbiter Along y-axis
	neptuneSpriteText.position.set( neptune.position.x - 30, neptune.position.y, 0 );
	neptuneAngle += neptuneSpeed; // Object will orbit clockwise




	renderer.render(bgScene, bgCam);  //backgound image
	renderer.render( scene, camera ); //Scene and camera
}


//Make the scenesize dynamic
function onWindowResize() {
	//renderer must always be screen size
	renderer.setSize( window.innerWidth, window.innerHeight );
	//Camera Aspect is also the same
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix(); //projections also must be updated
	render();//Scene must be re rendered when resizing is done
}


//Info feature
function onMouseDown( event ) {
	
	//here I am creating a raycaster currently for myself to click on objects and get their values
	// future work may include giving a pop up with basic information about this planet and links to more information
	event.preventDefault();
	//creating a vector that essentially points out of the mouse to the scene
	vector = new THREE.Vector3((event.clientX / window.innerWidth) * 2 - 1, - (event.clientY / window.innerHeight) * 2 + 1, 1 );
	projector.unprojectVector( vector, camera );
	var raycaster = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );

	//Store all objects intersected by the ray
	var intersects = raycaster.intersectObjects( planets );
	if(intersects.length >0){
		if(currentPlanet) togglePlanetInfo(currentPlanet);
		currentPlanet = intersects[0].object.nameOfPlanet;
		console.log(currentPlanet);
		togglePlanetInfo(currentPlanet);
	}
}

//Toggle info
function togglePlanetInfo(planet) {
   var e = document.getElementById(planet);
   if(e.style.display == 'block')
      e.style.display = 'none';
   else
      e.style.display = 'block';
}

//End of js