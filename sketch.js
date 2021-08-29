var zilla, zilla_run, bordas, ground, soloInvisivel, imagemDaNuvem, obstaculo, pontuacao, grupoDeNuvens, grupoDeObstaculos, trex_colidiu, imagemDoSolo, fimDoJogo, imagemFimDoJogo, obstaculo1, obstaculo2, obstaculo3, obstaculo4, obstaculo5, obstaculo6, reiniciar, imagemReiniciar, somSalto, somMorte, somCheckPoint, nuvem;

var JOGAR = 1;
var ENCERRAR = 0;
var estadoJogo= JOGAR;

function preload(){
  
  //criar animação do T-Rex correndo
  zilla_run = loadAnimation('trex1.png','trex3.png','trex4.png');
  
  //criar animação do T-Rex
  trex_colidiu = loadAnimation("trex_colidiu.png");
  
  //carregar imagem do ground
  imagemDoSolo = loadImage("solo2.png");
  
  //carregar imagem da nuvem
  imagemDaNuvem = loadImage("nuvem.png");
  
  // carregar imagens dos obstaculos
  obstaculo1 = loadImage("obstaculo1.png");
  obstaculo2 = loadImage("obstaculo2.png");
  obstaculo3 = loadImage("obstaculo3.png");
  obstaculo4 = loadImage("obstaculo4.png");
  obstaculo5 = loadImage("obstaculo5.png");
  obstaculo6 = loadImage("obstaculo6.png");
  
  //carregar imagens de final
  imagemFimDoJogo= loadImage("fimDoJogo.png");
  imagemReiniciar= loadImage("reiniciar.png");
  
  //carregar sons
  somSalto = loadSound("pulo.mp3");
  somMorte = loadSound("morte.mp3");
  somCheckPoint = loadSound("checkPoint.mp3");
}

function setup(){
  
  //cria a tela
  createCanvas(600,200);
  
  //cria bordas
  bordas = createEdgeSprites();
  
  //aprendendo sobre console.log
  //escreve o nome do jogo no terminal
  console.log("T-Rex corredor");
  
  //cria ground
  ground = createSprite(300,190,1200,20);
  //adiciona imagem de ground
  ground.addImage("ground", imagemDoSolo)
  ground.x = ground.width/2;
  
  //cria ground invisível
  soloInvisivel = createSprite(300,200,600,10);
  soloInvisivel.visible = false;
  
  //cria sprite do T-Rex
  zilla = createSprite(50,100,20,50);
  zilla.scale = 0.5;
  zilla.x = 50;
  //adiciona a animação de T-Rex correndo ao sprite
  zilla.addAnimation('correndo',zilla_run);
  //adiciona a animação de T-rex colidindo ao sprite
  zilla.addAnimation("colidiu" , trex_colidiu);
  
  //atribuir valor inicial à pontuação
  pontuacao = 0
  
  //criar grupos de nuvens e obstáculos
  grupoDeObstaculos = new Group();
  grupoDeNuvens = new Group();
  
  //adicionar e ajustar imagens do fim
  fimDoJogo = createSprite(300,80,400,20);
  fimDoJogo.addImage(imagemFimDoJogo);

  reiniciar = createSprite(300,120);
  reiniciar.addImage(imagemReiniciar);

  fimDoJogo.scale = 0.5;
  reiniciar.scale = 0.5;
  
  zilla.setCollider("circle",0,0);
  
  //para Trex inteligente
  //zilla.setCollider("rectangle",250,0);

}

function draw(){

  //fundo branco
  background("white");
  
  console.log(estadoJogo)
  
  text("Pontuação: "+pontuacao,500,20);
  
  if(mousePressedOver(reiniciar)){
    reinicie();
  }
  
  //desenha os sprites
  drawSprites();
  
  //Trex colide com o ground
  zilla.collide(soloInvisivel);
  
  //estados de jogo
  if(estadoJogo === JOGAR){
    
    //faz o T-Rex correr adicionando velocidade ao ground
    ground.velocityX = -(4 + pontuacao/10);
    //faz o ground voltar ao centro se metade dele sair da tela
    if (ground.x<0){
      ground.x=ground.width/2;
    }
    
    //som a cada 100 pontos
    if(pontuacao>0 && pontuacao%100 === 0){
        somCheckPoint.play();
    }
    
    //T-Rex pula ao apertar espaço
    if(keyDown('space') && zilla.y>170){
      zilla.velocityY = -15; 
      somSalto.play();
    }
    
    //gravidade
    zilla.velocityY = zilla.velocityY + 1;
    
    //gerar nuvens
    gerarNuvens();
    //gerar obstáculos
    gerarObstaculos();
    
    //pontuação continua rodando
    pontuacao = pontuacao + Math.round(frameRate()/60);
    
    //imagens do fim ficam invisíveis
    fimDoJogo.visible = false;
    reiniciar.visible = false;
    
    //quando o zilla toca o obstáculo, o jogo se encerra
    if(grupoDeObstaculos.isTouching(zilla)){
      estadoJogo = ENCERRAR;
      //som de morte
      somMorte.play();
      
      //Trex inteligente
      //zilla.velocityY= -12;
      //somSalto.play();
    }
  } else if(estadoJogo === ENCERRAR){
    //para os sprites em movimento
    zilla.velocityY =0;
    ground.velocityX = 0;
    grupoDeObstaculos.setVelocityXEach(0);
    grupoDeNuvens.setVelocityXEach(0);
    //impede que obstáculos sumam
    grupoDeObstaculos.setLifetimeEach(-1);
    grupoDeNuvens.setLifetimeEach(-1);
    
    //animação de T-Rex colidido
    zilla.changeAnimation("colidiu" , trex_colidiu);
    
    //mostrar imagens do fim
    fimDoJogo.visible = true;
    reiniciar.visible = true;
  }
    //console.log("estado de jogo: "+estadoJogo);
}

function gerarNuvens(){
  //gerar sprites de nuvem a cada 60 quadros, com posição Y aleatória
  if(frameCount %60 === 0){
    nuvem = createSprite(600,100,40,10);
    nuvem.y = Math.round(random(40,120));
    //atribuir imagem de nuvem e adequar escala
    nuvem.addImage(imagemDaNuvem);
    nuvem.scale =0.5;
    //ajustar profundidade da nuvem
    nuvem.depth = zilla.depth;
    zilla.depth = zilla.depth +1;
    nuvem.depth = reiniciar.depth;
    reiniciar.depth = reiniciar.depth +1;
    nuvem.depth = fimDoJogo.depth;
    fimDoJogo.depth = fimDoJogo.depth +1;
    //dar velocidade e direção à nuvem
    nuvem.velocityX=-3;
    //dar tempo de vida à nuvem
    nuvem.lifetime = 220;
    //adicionar a um grupo
    grupoDeNuvens.add(nuvem);
  }
}

function gerarObstaculos(){
  //criar sprite de obstáculo a cada 60 quadros
  if(frameCount %60 === 0){
    obstaculo = createSprite(600,175,10,40);
    obstaculo.velocityX= -(6+ pontuacao/10);
  
    //adicionar imagem ao obstaculo aleatoriamente
    var rand = Math.round(random(1,6));
    switch(rand){
      case 1: obstaculo.addImage(obstaculo1);
        	break;
      case 2: obstaculo.addImage(obstaculo2);
        	break;
   	  case 3: obstaculo.addImage(obstaculo3);
        	break;
      case 4: obstaculo.addImage(obstaculo4);
        	break;
      case 5: obstaculo.addImage(obstaculo5);
        	break;
      case 6: obstaculo.addImage(obstaculo6);
        	break;
      default: break;
    }
    //atribuir escala e tempo de vida aos obstáculos
    obstaculo.scale = 0.5;
    obstaculo.lifetime = 300;
    //ajustar profundidade da nuvem
    obstaculo.depth = zilla.depth;
    zilla.depth = zilla.depth +1;
    //adicionar a um grupo
    grupoDeObstaculos.add(obstaculo);
  }
}
function reinicie(){
  estadoJogo=JOGAR;
  reiniciar.visible=false;
  fimDoJogo.visible=false;
  grupoDeObstaculos.destroyEach();
  grupoDeNuvens.destroyEach();
  zilla.changeAnimation("correndo",zilla_run);
  pontuacao=0;
}
