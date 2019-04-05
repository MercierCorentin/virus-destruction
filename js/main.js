// ----------------------------------------------------------CODE DU JEU-------------------------------------------------------------------//
//l'item d'attaque désigne l'objet qui tombe. Noté IA
//l'item de défense désigne l'objet qui est tiré par le canon. Noté IDD
//la base du canon est l'objet sur lequel le canon est posé, elle est indépendante du canon

$(function(){ //on attent le chargement du DOM
	"use strict";
//-----------------------------Déclarations----------------------------------------//

	var hauteurImageIA=32; //Entrer ici la hauteur de l'image de l'IA en pixels(px)
	var largeurImageIA=32; //Ici la largeur de l'image de l'IA en px 
	var hauteurImageIDD=8; //Ici la hauteur de l'image de l'IDD en px
	var largeurImageIDD=8; //Ici la largeur de l'image de l'IDD en pk
	var innerX=window.outerWidth-10;//On récupère la largeur de l'écran
	var innerY=window.outerHeight-20;//On récupère la hauteur de l'écran

	var IAApparitionTime=3000; //temps initial entre chaque apparition de virus 
	var IASpeed=20; //vitesse initiale des virus
	var lifePoint=100;//nombre de points de vie

	//variables déclarées ici et itilisées plus tard
	var randomNumber=0;
	var IDDCounter=0;
	var a=0;
	var b=0;
	var h=0;
	var i=0;
	var l=0;
	var p=0;
	var r=0;
	var z=0;
	var launchPosition=0;
	var score=0;
	var deathMessageLeft=0;
	var deathMessageTop=0;
	var canonLeft=0;
	var pauseMenuTop=0;
	var pauseMenuLeft=0;
	var startMenuTop=0;
	var startMenuLeft=0;
	var intervalMoveVirus=0;
	var intervalLaunch=0;
	var stop=false;
	var pause=true;

	var virusTable=[];
	var bulletTable=[];

//----------------------------------------fonctions--------------------------------------------//
//fonction déclenchée lors d'un clic sur l'ecran
	function moveCanonAndShoot(e){
		if(!pause){
			//-----Calcul de l'angle entre la position du clic et le canon----//
			var xSide=innerX/2-e.pageX;
			var ySide=innerY-e.pageY;
			var angleRad=Math.atan(ySide/Math.abs(xSide));
			var angleDeg =(180*angleRad/Math.PI);
			var angleDegRounded=Math.round(angleDeg/10)*10;
			if(xSide>0){
				angleDeg=(180-angleDeg);
				angleDegRounded=180-angleDegRounded;
				angleRad=Math.PI-angleRad;
			}
			//---------fin du calcul----------------------------------------//
			
			if((IDDCounter<4)&&(IDDCounter>=0)&&(angleRad<Math.PI)&&(angleRad>0)){
				$('#canon').attr('src', 'img/canon/'+angleDegRounded+'.png');
				if(p==4){p=0;}
				var currentBullet=bulletTable[p];
				p++;
				currentBullet.angleRad=angleRad;
				currentBullet.angleDeg=angleDeg;
				currentBullet.display();
				clearInterval(currentBullet.intervalMoveBullet);
				currentBullet.intervalMoveBullet=setInterval(function(){currentBullet.move()},5);
			}
		}
	};

	function initGame(){
		pause=false;
		IAApparitionTime=3000; //temps initial entre chaque apparition de virus 
		IASpeed=20; //vitesse initiale des virus
		lifePoint=100;//nombre de points de vie
		clearAllInterval();
		intervalLaunch =setInterval(function(){launchVirus();},IAApparitionTime);
		$('#green').css('width',lifePoint+"%");
		$('#canon').attr('src', 'img/canon/90.png');
		score=0
		$('#current-score-player').text(": "+score);
	};
	function clearAllInterval(){
		clearInterval(intervalLaunch);
		bulletTable.forEach(function(el){
			if (el.intervalMoveBullet!='undefined'){
				clearInterval(el.intervalMoveBullet);
			}
			el.element.detach();
		});
		virusTable.forEach(function(el){
			if (el.intervalMoveVirus!='undefined'){
				clearInterval(el.intervalMoveVirus);
			}
			el.element.detach();
		});
	}

//---------------------------------------Création des objets--------------------------------//
	var virus={
		init:function(element,posX,posY){
			this.element=element;
			this.posX=posX;
			this.posY=posY;
			this.intervalMoveVirus=0;
		},
		display: function(){
			$('#death-message').after(this.element);
			this.posX=Math.round(Math.random()*(innerX-34)+17);
			this.posY=0;
			this.element.css('left',this.posX+'px').css('top',this.posY+'px');

		},
		move: function(intervalMoveVirus){
			if(!pause){
				this.element.css("top",'+=1');
				if (this.element.position().top>(innerY-hauteurImageIA)){
					clearInterval(this.intervalMoveVirus);
					this.element.detach();
					lifePoint-=20;
					if(lifePoint<=0){
						clearAllInterval();
						$("#death-message").css("display", "block");

					}
					$('#green').css('width',lifePoint+"%");
				}
			}
		}
	};
	
	var bullet={
		init:function(element,posX,posY){
			this.element=element;
			this.posX=posX;
			this.posY=posY;
			this.angleDeg=0;
			this.angleRad=0;
			this.intervalMoveBullet=0;
		},
		display: function(){
			$('#death-message').after(this.element);
			var xBullet=Math.round(Math.cos(this.angleRad)*45)+innerX/2;
			var yBullet=innerY-(Math.round(Math.sin(this.angleRad)*45));
			$('#death-message').after(this.element);
			var posBullet=this.element.offset();
			posBullet.top=yBullet;
			posBullet.left=xBullet;
			this.element.offset(posBullet)
			IDDCounter++;
		},
		move: function(){
			if (!pause){
				var element=this.element;
				if (this.angleDeg<=45){
					element.css('left','+=1');
					element.css('top',innerY-Math.tan(this.angleRad)*(element.offset().left-innerX/2));
				}else if ((this.angleDeg>45)&&(this.angleDeg<=90)){
					element.css('top','-=1');
					element.css('left',(innerX/2)+(innerY-element.offset().top)/Math.tan(this.angleRad));
				}else if ((this.angleDeg>90)&&(this.angleDeg<=135)){
					element.css('top','-=1');
					element.css('left',(innerX/2)-(innerY-element.offset().top)/Math.tan(Math.PI-this.angleRad));
				}else if (this.angleDeg>135){
					element.css('left',"-=1");
					element.css('top',innerY-Math.tan(Math.PI-this.angleRad)*((innerX/2)-element.offset().left))
				}
				for (var n= 0; n <= 5; n++) {
					var collision=this.testCollision(virusTable[n]);
					if(collision){
						return;
					}else{continue;}
				}
				if ((element.offset().top<=8)||(element.offset().top>=(innerY))||(element.offset().left>innerX-8)||(element.offset().left<8) ){
					clearInterval(this.intervalMoveBullet);
					element.detach();
					IDDCounter--;
					return;
				}
			}

		},
		testCollision: function(virus){
			var bulletTop=this.element.offset().top;
			var bulletLeft=this.element.offset().left;
			var virusTop=virus.element.offset().top;
			var virusLeft=virus.element.offset().left;
			if((bulletLeft<(virusLeft+hauteurImageIA-1))&&(bulletLeft>virusLeft-(largeurImageIDD-1))&&(virusTop!=0)&&(virusTop!=0)){
				if((bulletTop>virusTop-(hauteurImageIDD-1)&&(bulletTop<virusTop+hauteurImageIA-1)&&(virusTop!=0)&&(virusTop!=0))){
		 			clearInterval(virus.intervalMoveVirus);
	 				clearInterval(this.intervalMoveBullet);
					virus.element.detach();
					this.element.detach();
					score++;
		 			$('#current-score-player').text(": "+score);
	 				IDDCounter--;
	 				return true;
				}else{return false;}
			}else{return false;}
		}
	};

//------------------------Remplissage des tableaux d'objets---------------------------------------//
	for (h =0; h<=5; h++) {
		virusTable[h]=Object.create(virus);
		virusTable[h].init($('#virus_'+h));
		virusTable[h].element.detach();
	};
	for (z =0; z <=3; z++) {
		bulletTable[z]=Object.create(bullet);
		bulletTable[z].init($('#bullet_'+z));
		bulletTable[z].element.detach();
	};

//-----------------------------Positionnements-----------------------------------------------------------//
	$('body, #game-container, html').css('width',innerX).css('height',innerY);//on donne au éléments conteneurs la taille de l'écran
	$("#life-bar").css('left',innerX-80); //On place la barre de vie 
	$('#imagePause').css('left',innerX-120);
	//positionnement du message de mort 
	deathMessageLeft=(innerX/2)-($('#death-message').outerWidth()/2);
	deathMessageTop=(innerY/2)-($('#death-message').outerHeight()/2);
	$('#death-message').css({'left':deathMessageLeft,
							 'top':deathMessageTop});
	//positionnement du canon
	canonLeft=(innerX/2)-($('#canon').outerWidth()/2);
	$('#canon').css('left',canonLeft);

	//positionnement du menu pause 
	pauseMenuTop=(innerY/2)-($('#pause-menu').innerHeight())/2;
	pauseMenuLeft=(innerX/2)-($('#pause-menu').innerWidth())/2;
	$('#pause-menu').css({'top':pauseMenuTop,
						  'left':pauseMenuLeft});

	//positionnement du bouton start
	startMenuTop=(innerY/2)-$('#start-button').innerHeight()/2;
	startMenuLeft=(innerX/2)-$('#start-button').innerWidth()/2;
	$('#start-button').css({'top':startMenuTop,
							'left':startMenuLeft});


	$('#game-container').css('display','none');


//-----------------------------Evènements--------------------------------------------------------------//
	
	$('#start-button').click(function(){
		$('#game-container').css('display','block');
		$('#start-menu').css('display','none');
		initGame();
		pause=false;
	});

	$('#imagePause').click(function(){ // Si on clique sur Pause
		pause=true;
		$('#pause-menu').css('display','block');
	});

	$('#continue').click(function(){
		pause=false;
		$('#pause-menu').css('display','none');
	});
	$('#exit').click(function(){
		$('#game-container').css('display','none')
		$('#pause-menu').css('display','none');
		clearAllInterval();
		$('#start-menu').css('display','block');
	});
	$('#death-message').click(function(){
		$('#death-message').css('display','none');
		$('#game-container').css('display','none');
		$('#start-menu').css('display','block');
	});

	document.getElementById('game-container').addEventListener("click",moveCanonAndShoot);// Detection du clic sur l'écran qui déclenche le tir
		

//----------------------Lancement des virus-----------------------------------------------------------//
	function launchVirus(){
		if(!pause){
			if(l>=6){l=0;}
			if (IAApparitionTime>1000){
				IAApparitionTime-=100;
			}
			if (IASpeed>=13){
				r++;
				if(r==5){IASpeed--;r=0;}
			}
			var currentVirus=virusTable[l];
			l++;
			currentVirus.display();
			clearInterval(intervalLaunch);
			clearInterval(currentVirus.intervalMoveBullet);
			intervalLaunch=setInterval(function(){launchVirus();},IAApparitionTime);
			currentVirus.intervalMoveVirus=setInterval(function(){currentVirus.move(intervalMoveVirus)},IASpeed);
		}
	}


});