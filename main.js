import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";


// ===== SETUP =====
const scene = new THREE.Scene();

const camera = new THREE.OrthographicCamera(-50,50,50,-50,0.1,10);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(window.innerWidth,window.innerHeight);
renderer.setClearColor(0xfff0f5);

document.body.appendChild(renderer.domElement);


// ===== DRAW PIXEL =====
const p = (x,y,color=0xff69b4,size=3,opacity=1)=>{
    const g = new THREE.BufferGeometry();
    g.setAttribute("position",
        new THREE.Float32BufferAttribute([x,y,0],3)
    );

    const mat = new THREE.PointsMaterial({
        color,
        size,
        transparent:true,
        opacity
    });

    scene.add(new THREE.Points(g,mat));
};


// ===== HEART SHAPE =====
const heart = (cx,cy,s,color,size,opacity)=>{
    for(let t=0;t<Math.PI*2;t+=0.05){
        let x = 16*Math.pow(Math.sin(t),3);
        let y = 13*Math.cos(t)
              - 5*Math.cos(2*t)
              - 2*Math.cos(3*t)
              - Math.cos(4*t);

        p(cx + x*s, cy + y*s, color, size, opacity);
    }
};


// ===== MAIN HEART (ĐẬM + NỔI) =====
const mainHeart = (scale)=>{

    // glow nhẹ
    heart(0,0,scale*1.3,0xff69b4,10,0.1);
    heart(0,0,scale*1.15,0xff69b4,7,0.2);

    // viền
    heart(0,0,scale*1.05,0xff1493,5,1);

    // lõi đậm
    heart(0,0,scale*0.9,0xff0066,4,1);

    // highlight
    heart(0,0,scale*0.75,0xff4da6,2,1);
};


// ===== FLOAT HEART =====
let hearts = [];

// ===== FIREWORK =====
let particles = [];

const createHeart = (x,y)=>{
    hearts.push({
        x,y,
        size:0.2+Math.random()*0.3,
        speed:0.2+Math.random()*0.4,
        life:1
    });
};

const burst = (x,y)=>{
    for(let i=0;i<25;i++){
        particles.push({
            x,y,
            vx:(Math.random()-0.5)*3,
            vy:(Math.random()-0.5)*3,
            size:0.15+Math.random()*0.2,
            life:1
        });
    }
};


// ===== INTERACTION =====
const getPos = (e)=>({
    x:(e.clientX/window.innerWidth)*100 - 50,
    y:-(e.clientY/window.innerHeight)*100 + 50
});

// kéo chuột
window.addEventListener("mousemove",(e)=>{
    if(e.buttons===1){
        let pos = getPos(e);
        createHeart(pos.x,pos.y);
    }
});

// click → nổ
window.addEventListener("click",(e)=>{
    let pos = getPos(e);
    burst(pos.x,pos.y);
});

// touch
window.addEventListener("touchmove",(e)=>{
    let t = e.touches[0];
    let pos = getPos(t);
    createHeart(pos.x,pos.y);
});


// ===== ANIMATION =====
function animate(){

    requestAnimationFrame(animate);
    scene.clear();

    let t = Date.now()*0.003;

    // 💗 HEART CHÍNH
    let scale = 2.5 + Math.sin(t)*0.2;
    mainHeart(scale);


    // 💕 HEART BAY
    hearts.forEach((h,i)=>{

        h.y += h.speed;
        h.life -= 0.01;

        if(h.life<=0){
            hearts.splice(i,1);
            return;
        }

        heart(h.x,h.y-1,h.size,0xffc0cb,2,0.2); // trail
        heart(h.x,h.y,h.size,0xff69b4,2,h.life);
    });


    // 💥 PARTICLES NỔ
    particles.forEach((pcl,i)=>{

        pcl.x += pcl.vx;
        pcl.y += pcl.vy;
        pcl.life -= 0.02;

        if(pcl.life<=0){
            particles.splice(i,1);
            return;
        }

        heart(pcl.x,pcl.y,pcl.size,0xff69b4,2,pcl.life);
    });


    renderer.render(scene,camera);
}

animate();