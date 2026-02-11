let scene, camera, renderer;
let player, platforms=[], coins=[], powerups=[];
let lanePositions = [-2,0,2];
let playerLane=1;
let speed = 0.2;
let score = 0;
let multiplier = 1;

// Initialize Scene
function init(){
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 1000);
    camera.position.set(0,5,10);
    camera.lookAt(0,0,0);

    renderer = new THREE.WebGLRenderer({antialias:true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('game-container').appendChild(renderer.domElement);

    // Player
    let geom = new THREE.SphereGeometry(0.5,16,16);
    let mat = new THREE.MeshStandardMaterial({color:0xff0000});
    player = new THREE.Mesh(geom, mat);
    player.position.set(0,0.5,0);
    scene.add(player);

    // Light
    let light = new THREE.DirectionalLight(0xffffff,1);
    light.position.set(5,10,5);
    scene.add(light);

    // Platforms
    for(let i=0;i<20;i++) addPlatform(i*2);

    // Coins
    for(let i=0;i<10;i++) addCoin(i*5+5);

    // Power-ups
    for(let i=0;i<5;i++) addPowerup(i*10+5);

    // Controls
    window.addEventListener('keydown', movePlayer);
    window.addEventListener('touchstart', handleTouchStart,false);
    window.addEventListener('touchend', handleTouchEnd,false);

    animate();
}

// Platforms
function addPlatform(z){
    let geom = new THREE.BoxGeometry(1.8,0.2,2);
    let mat = new THREE.MeshStandardMaterial({color:0x00ff00});
    let p = new THREE.Mesh(geom, mat);
    p.position.set(0,0,-z);
    scene.add(p);
    platforms.push(p);
}

// Coins
function addCoin(z){
    let geom = new THREE.TetrahedronGeometry(0.3);
    let mat = new THREE.MeshStandardMaterial({color:0xffff00});
    let c = new THREE.Mesh(geom, mat);
    c.position.set(lanePositions[Math.floor(Math.random()*3)],0.5,-z);
    scene.add(c);
    coins.push(c);
}

// Power-ups
function addPowerup(z){
    let geom = new THREE.BoxGeometry(0.4,0.4,0.4);
    let mat = new THREE.MeshStandardMaterial({color:0x00ffff});
    let p = new THREE.Mesh(geom, mat);
    p.position.set(lanePositions[Math.floor(Math.random()*3)],0.5,-z);
    scene.add(p);
    powerups.push(p);
}

// Player Movement
function movePlayer(e){
    if(e.key==='ArrowLeft') playerLane=Math.max(0,playerLane-1);
    if(e.key==='ArrowRight') playerLane=Math.min(2,playerLane+1);
    player.position.x = lanePositions[playerLane];
}

// Touch
let xDown=null;
function handleTouchStart(evt){ xDown=evt.touches[0].clientX; }
function handleTouchEnd(evt){
    if(!xDown) return;
    let xUp = evt.changedTouches[0].clientX;
    let xDiff = xDown - xUp;
    if(xDiff>30) playerLane=Math.min(2,playerLane+1);
    if(xDiff<-30) playerLane=Math.max(0,playerLane-1);
    player.position.x = lanePositions[playerLane];
    xDown = null;
}

// Animate
function animate(){
    requestAnimationFrame(animate);

    // Increase speed gradually
    speed += 0.00005;

    // Move platforms
    platforms.forEach(p=>{
        p.position.z += speed;
        if(p.position.z>2) p.position.z=-38;
    });

    // Coins
    coins.forEach(c=>{
        c.position.z += speed;
        if(Math.abs(c.position.z)<0.5 && Math.abs(c.position.x-player.position.x)<0.5){
            score += 10 * multiplier;
            multiplier++;
            document.getElementById('score').innerText="Score: "+score;
            document.getElementById('multiplier').innerText="x"+multiplier;
            c.position.z = -50;
            c.position.x = lanePositions[Math.floor(Math.random()*3)];
        }
        if(c.position.z>2) c.position.z=-50;
    });

    // Power-ups
    powerups.forEach(p=>{
        p.position.z += speed;
        if(Math.abs(p.position.z)<0.5 && Math.abs(p.position.x-player.position.x)<0.5){
            // Random powerup effect
            multiplier *= 2;
            document.getElementById('multiplier').innerText="x"+multiplier;
            p.position.z=-50;
        }
        if(p.position.z>2) p.position.z=-50;
    });

    renderer.render(scene,camera);
}

init();
